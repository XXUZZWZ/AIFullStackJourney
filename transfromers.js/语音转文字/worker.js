// ASR worker.js - 在 Worker 里运行 transformers.js ASR 管道
import {
  env,
  pipeline,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1";

let asr = null;
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
  if (data.cmd === "transcribe") {
    const {
      audio,
      sampleRate = 16000,
      model = "Xenova/whisper-tiny",
      useWebGPU = true,
    } = data;

    if (currentAbortController) {
      currentAbortController.abort?.();
    }
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    try {
      let device = "cpu";
      if (useWebGPU && typeof navigator !== "undefined" && navigator.gpu)
        device = "webgpu";

      postStatus(`初始化 ASR（device=${device}）`);

      if (!asr) {
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
                "automatic-speech-recognition",
                localCandidate,
                baseOpts
              );
            } catch (eLocal) {
              try {
                // 远端回退
                return await loadWith(
                  "automatic-speech-recognition",
                  model,
                  baseOpts
                );
              } catch (e1) {
                if (baseOpts.device === "webgpu") {
                  try {
                    postStatus("WebGPU 初始化失败，回退 CPU/WASM");
                    return await loadWith(
                      "automatic-speech-recognition",
                      model,
                      {
                        device: "cpu",
                      }
                    );
                  } catch (e2) {
                    throw e2;
                  }
                }
                throw e1;
              }
            }
          })();
        }
        asr = await loadingPromise;
        postStatus("模型加载完成，开始识别");
      }

      if (signal.aborted) throw new Error("已取消");

      // 输入是 Float32Array，采样率 16k
      const float32 = new Float32Array(audio);
      const out = await asr(float32, { sampling_rate: sampleRate });

      if (signal.aborted) throw new Error("已取消");

      const text = out?.text || "";
      self.postMessage({ type: "text", text });
      postStatus("就绪");
    } catch (err) {
      if (err?.name === "AbortError" || err?.message === "已取消") {
        postStatus("已取消");
        self.postMessage({ type: "error", error: "用户取消" });
      } else {
        console.error("Worker ASR 错误：", err);
        postStatus("失败");
        self.postMessage({ type: "error", error: err?.message ?? String(err) });
        loadingPromise = null;
        asr = null;
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
