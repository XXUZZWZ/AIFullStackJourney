// Object Detection Demo (DETR) - main thread
const worker = new Worker("./worker.js", { type: "module" });

const statusEl = document.getElementById("status");
const fileEl = document.getElementById("file");
const detectBtn = document.getElementById("detect");
const cancelBtn = document.getElementById("cancel");
const useWebGPUEl = document.getElementById("useWebGPU");
const modelEl = document.getElementById("model");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const listEl = document.getElementById("list");

let imageBitmap = null;
let pending = false;

function setStatus(text) {
  statusEl.textContent = `状态：${text}`;
}

fileEl.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  imageBitmap = await createImageBitmap(file);
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageBitmap, 0, 0);
  setStatus("图片已加载");
  detectBtn.disabled = false;
});

worker.onmessage = (e) => {
  const data = e.data;
  if (data.type === "status") {
    setStatus(data.msg);
    return;
  }
  if (data.type === "error") {
    setStatus(`错误 — ${data.error}`);
    pending = false;
    detectBtn.disabled = false;
    cancelBtn.disabled = true;
    return;
  }
  if (data.type === "detections") {
    drawDetections(data.detections);
    renderList(data.detections);
    pending = false;
    detectBtn.disabled = false;
    cancelBtn.disabled = true;
    setStatus("完成");
  }
};

worker.onerror = (e) => {
  console.error("Worker error", e);
  setStatus(`Worker 异常 ${e.message || e.error?.message || ""}`);
  pending = false;
  detectBtn.disabled = false;
  cancelBtn.disabled = true;
};

worker.addEventListener("messageerror", (e) => {
  console.error("Worker messageerror", e);
  setStatus("Worker message 序列化/反序列化错误");
  pending = false;
  detectBtn.disabled = false;
  cancelBtn.disabled = true;
});

detectBtn.addEventListener("click", async () => {
  if (!imageBitmap || pending) return;
  const useWebGPU = useWebGPUEl.checked;
  const model = modelEl.value;
  pending = true;
  detectBtn.disabled = true;
  cancelBtn.disabled = false;
  setStatus("发送到 Worker 进行检测...");
  const bitmap = imageBitmap; // not transferable; convert to ImageBitmap via OffscreenCanvas
  const off = new OffscreenCanvas(bitmap.width, bitmap.height);
  const offCtx = off.getContext("2d");
  offCtx.drawImage(bitmap, 0, 0);
  const blob = await off.convertToBlob({ type: "image/png" });
  const buf = await blob.arrayBuffer();
  worker.postMessage({ cmd: "detect", image: buf, model, useWebGPU }, [buf]);
});

cancelBtn.addEventListener("click", () => {
  worker.postMessage({ cmd: "cancel" });
  setStatus("已请求取消（请稍候）");
  cancelBtn.disabled = true;
});

function drawDetections(detections) {
  ctx.drawImage(imageBitmap, 0, 0);
  ctx.lineWidth = 2;
  ctx.font = "14px ui-monospace, monospace";
  ctx.textBaseline = "top";
  detections.forEach((det) => {
    const [x, y, w, h] = det.box; // box: [x, y, width, height]
    ctx.strokeStyle = "#ff4d4f";
    ctx.fillStyle = "rgba(255,77,79,0.15)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillRect(x, y, w, h);
    const label = `${det.label} ${(det.score * 100).toFixed(1)}%`;
    const textW = ctx.measureText(label).width + 6;
    const textH = 18;
    ctx.fillStyle = "#ff4d4f";
    ctx.fillRect(x, y - textH, textW, textH);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, x + 3, y - textH + 2);
  });
}

function renderList(detections) {
  if (!detections?.length) {
    listEl.textContent = "未检测到目标";
    return;
  }
  listEl.innerHTML = detections
    .map(
      (d) =>
        `- ${d.label}: ${(d.score * 100).toFixed(1)}% [${d.box
          .map((n) => n.toFixed(0))
          .join(", ")}]`
    )
    .join("<br/>");
}
