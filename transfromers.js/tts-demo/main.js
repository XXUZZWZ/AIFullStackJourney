// main.js (主线程)
const worker = new Worker("./tts-worker.js", { type: "module" });

const statusEl = document.getElementById("status");
const progressBar = document.querySelector("#progress > i");
const speakBtn = document.getElementById("speak");
const cancelBtn = document.getElementById("cancel");
const audioEl = document.getElementById("audio");
let lastAudioObjectUrl = null;

let pending = false;

worker.onmessage = (e) => {
  const data = e.data;

  if (data.type === "status") {
    statusEl.textContent = `状态：${data.msg}`;
    if (data.progress !== undefined) {
      progressBar.style.width = `${Math.round(data.progress * 100)}%`;
    }
    if (data.msg === "就绪" || data.msg === "失败") {
      pending = false;
      speakBtn.disabled = false;
      cancelBtn.disabled = true;
    }
    return;
  }

  if (data.type === "error") {
    statusEl.textContent = `状态：错误 — ${data.error}`;
    pending = false;
    speakBtn.disabled = false;
    cancelBtn.disabled = true;
    progressBar.style.width = "0%";
    return;
  }

  // 音频返回
  if (data.type === "audio") {
    const floatArray = new Float32Array(data.audio);
    // 使用 WebAudio 即时播放
    playAudio(floatArray, data.sampling_rate);
    // 同时将音频编码为 WAV 并放入 <audio> 标签以便下载/回放
    const wavBlob = encodeWAV(floatArray, data.sampling_rate);
    if (lastAudioObjectUrl) URL.revokeObjectURL(lastAudioObjectUrl);
    lastAudioObjectUrl = URL.createObjectURL(wavBlob);
    audioEl.src = lastAudioObjectUrl;
    statusEl.textContent = `状态：播放音频（采样率 ${data.sampling_rate}），已写入 audio 标签`;
    pending = false;
    speakBtn.disabled = false;
    cancelBtn.disabled = true;
    progressBar.style.width = "0%";
  }
};

worker.onerror = (e) => {
  const msg = (e && (e.message || e.error?.message)) || "Unknown worker error";
  const file = e && e.filename ? ` @ ${e.filename}` : "";
  const line =
    e && e.lineno !== undefined ? `:${e.lineno}:${e.colno || 0}` : "";
  console.error("Worker error", e);
  statusEl.textContent = `状态：Worker 异常 ${msg}${file}${line}`;
  pending = false;
  speakBtn.disabled = false;
  cancelBtn.disabled = true;
  progressBar.style.width = "0%";
};

worker.addEventListener("messageerror", (e) => {
  console.error("Worker messageerror", e);
  statusEl.textContent = "状态：Worker message 序列化/反序列化错误";
  pending = false;
  speakBtn.disabled = false;
  cancelBtn.disabled = true;
  progressBar.style.width = "0%";
});

speakBtn.addEventListener("click", () => {
  if (pending) return;
  const text = document.getElementById("text").value.trim();
  if (!text) return alert("请输入文本");
  const useWebGPU = document.getElementById("useWebGPU").checked;
  const useQuant = document.getElementById("useQuant").checked;

  pending = true;
  speakBtn.disabled = true;
  cancelBtn.disabled = false;
  statusEl.textContent = "状态：发送文本到 Worker，开始推理...";
  worker.postMessage({ cmd: "speak", text, useWebGPU, useQuant });
});

cancelBtn.addEventListener("click", () => {
  if (!pending) return;
  worker.postMessage({ cmd: "cancel" });
  statusEl.textContent = "状态：已请求取消（请稍候）";
  cancelBtn.disabled = true;
});

function playAudio(floatArray, sampleRate) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // resume context if suspended (浏览器自动阻止 autoplay 的场景)
  if (audioCtx.state === "suspended") audioCtx.resume();
  const buffer = audioCtx.createBuffer(1, floatArray.length, sampleRate);
  buffer.copyToChannel(floatArray, 0);
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  src.start();
}

// 将 Float32 PCM 编码为 16-bit PCM 的 WAV Blob
function encodeWAV(float32Array, sampleRate) {
  const numChannels = 1;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataLength = float32Array.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // format = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits per sample
  writeString(view, 36, "data");
  view.setUint32(40, dataLength, true);

  // PCM 数据写入（Float32 -> Int16）
  let offset = 44;
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    // Float32 [-1,1] -> Int16 [-32768,32767]
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([view], { type: "audio/wav" });
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
