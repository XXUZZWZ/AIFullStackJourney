// Object Detection worker.js - DETR pipeline
import {
  env,
  pipeline,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1";

let detector = null;
let loadingPromise = null;
let currentAbortController = null;

env.allowLocalModels = true;
env.localModelPath = "./models";
env.backends.onnx.wasm.wasmPaths =
  "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/";

function postStatus(msg) {
  self.postMessage({ type: "status", msg });
}

self.addEventListener("error", (e) => {
  try {
    self.postMessage({
      type: "error",
      error: e?.message || String(e?.error || e),
    });
  } catch {}
});
self.addEventListener("unhandledrejection", (e) => {
  try {
    const r = e?.reason;
    const msg =
      (r && (r.message || r.toString())) || "Unhandled promise rejection";
    self.postMessage({ type: "error", error: msg });
  } catch {}
});

try {
  if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
    env.backends.onnx.wasm.numThreads = 1;
  }
} catch {}

self.onmessage = async (e) => {
  const data = e.data;
  if (data.cmd === "detect") {
    const { image, model = "Xenova/detr-resnet-50", useWebGPU = true } = data;

    if (currentAbortController) {
      currentAbortController.abort?.();
    }
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    try {
      let device = "cpu";
      if (useWebGPU && typeof navigator !== "undefined" && navigator.gpu)
        device = "webgpu";
      postStatus(`初始化 DETR（device=${device}）`);

      if (!detector) {
        if (!loadingPromise) {
          loadingPromise = (async () => {
            const baseOpts = { device };
            const loadWith = (task, modelId, opts) =>
              pipeline(task, modelId, opts);
            const localCandidate =
              model.startsWith("./") || model.startsWith("../")
                ? model
                : `./models/${model}`;
            try {
              // 本地优先
              return await loadWith(
                "object-detection",
                localCandidate,
                baseOpts
              );
            } catch (eLocal) {
              try {
                // 远端回退
                return await loadWith("object-detection", model, baseOpts);
              } catch (e1) {
                if (baseOpts.device === "webgpu") {
                  try {
                    postStatus("WebGPU 初始化失败，回退 CPU/WASM");
                    return await loadWith("object-detection", model, {
                      device: "cpu",
                    });
                  } catch (e2) {
                    throw e2;
                  }
                }
                throw e1;
              }
            }
          })();
        }
        detector = await loadingPromise;
        postStatus("模型加载完成，开始检测");
      }

      if (signal.aborted) throw new Error("已取消");

      // 将传来的 PNG/JPEG ArrayBuffer 转为 ImageData 供 pipeline 使用
      const blob = new Blob([image]);
      const bitmap = await createImageBitmap(blob);
      const off = new OffscreenCanvas(bitmap.width, bitmap.height);
      const offCtx = off.getContext("2d");
      offCtx.drawImage(bitmap, 0, 0);
      const imageData = offCtx.getImageData(0, 0, off.width, off.height);

      const outputs = await detector(imageData);

      if (signal.aborted) throw new Error("已取消");

      // 标准化输出：[{ label, score, box:[x,y,w,h] }]
      const detections = (outputs || []).map((o) => ({
        label: o.label || o.class || "object",
        score: o.score ?? o.score ?? 0,
        box: [
          o.box?.x ?? o.box?.xmin ?? 0,
          o.box?.y ?? o.box?.ymin ?? 0,
          o.box?.width ?? o.box?.xmax - o.box?.xmin ?? 0,
          o.box?.height ?? o.box?.ymax - o.box?.ymin ?? 0,
        ],
      }));

      self.postMessage({ type: "detections", detections });
      postStatus("就绪");
    } catch (err) {
      if (err?.name === "AbortError" || err?.message === "已取消") {
        postStatus("已取消");
        self.postMessage({ type: "error", error: "用户取消" });
      } else {
        console.error("Worker DETR 错误：", err);
        postStatus("失败");
        self.postMessage({ type: "error", error: err?.message ?? String(err) });
        loadingPromise = null;
        detector = null;
      }
    } finally {
      currentAbortController = null;
    }
  } else if (data.cmd === "cancel") {
    if (currentAbortController) {
      currentAbortController.abort?.();
      postStatus("取消请求已发出");
    } else {
      postStatus("无可取消任务");
    }
  }
};
