// ASR main.js - 使用 Web Worker 运行 transformers.js 以避免阻塞 UI
const worker = new Worker("./worker.js", { type: "module" });

const statusEl = document.getElementById("status");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const cancelBtn = document.getElementById("cancel");
const resultEl = document.getElementById("result");
const useWebGPUEl = document.getElementById("useWebGPU");
const modelEl = document.getElementById("model");

let mediaRecorder = null;
let audioChunks = [];
let recording = false;
let pending = false;

function setStatus(text) {
  statusEl.textContent = `状态：${text}`;
}

worker.onmessage = (e) => {
  const data = e.data;
  if (data.type === "status") {
    setStatus(data.msg);
    return;
  }
  if (data.type === "error") {
    setStatus(`错误 — ${data.error}`);
    pending = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    cancelBtn.disabled = true;
    return;
  }
  if (data.type === "text") {
    resultEl.value = data.text;
    setStatus("完成");
    pending = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    cancelBtn.disabled = false;
  }
};

worker.onerror = (e) => {
  console.error("Worker error", e);
  setStatus(`Worker 异常 ${e.message || e.error?.message || ""}`);
  pending = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  cancelBtn.disabled = true;
};

worker.addEventListener("messageerror", (e) => {
  console.error("Worker messageerror", e);
  setStatus("Worker message 序列化/反序列化错误");
  pending = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  cancelBtn.disabled = true;
});

startBtn.addEventListener("click", async () => {
  if (recording || pending) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) audioChunks.push(e.data);
    };
    mediaRecorder.onstart = () => {
      recording = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
      cancelBtn.disabled = false;
      setStatus("录音中...");
    };
    mediaRecorder.start();
  } catch (err) {
    console.error(err);
    setStatus(`无法访问麦克风：${err.message || err}`);
  }
});

stopBtn.addEventListener("click", async () => {
  if (!recording || pending) return;
  setStatus("停止录音，准备转写...");
  stopBtn.disabled = true;
  mediaRecorder.onstop = async () => {
    try {
      const blob = new Blob(audioChunks, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const float32 = await decodeToFloat32(arrayBuffer);

      const useWebGPU = useWebGPUEl.checked;
      const model = modelEl.value;

      pending = true;
      worker.postMessage(
        {
          cmd: "transcribe",
          audio: float32.buffer,
          sampleRate: 16000,
          model,
          useWebGPU,
        },
        [float32.buffer]
      );
      setStatus("已发送到 Worker 进行识别...");
    } catch (err) {
      console.error(err);
      setStatus(`处理音频失败：${err.message || err}`);
      recording = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  };
  mediaRecorder.stop();
  recording = false;
});

cancelBtn.addEventListener("click", () => {
  worker.postMessage({ cmd: "cancel" });
  setStatus("已请求取消（请稍候）");
  cancelBtn.disabled = true;
});

async function decodeToFloat32(arrayBuffer) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  const src = audioBuffer.getChannelData(0);
  // 若采样率不是 16k，做简单重采样（线性插值）
  if (audioBuffer.sampleRate === 16000) return new Float32Array(src);
  const targetLength = Math.floor(
    src.length * (16000 / audioBuffer.sampleRate)
  );
  const out = new Float32Array(targetLength);
  for (let i = 0; i < targetLength; i++) {
    const t = i * (audioBuffer.sampleRate / 16000);
    const i0 = Math.floor(t);
    const i1 = Math.min(i0 + 1, src.length - 1);
    const frac = t - i0;
    out[i] = src[i0] * (1 - frac) + src[i1] * frac;
  }
  return out;
}
