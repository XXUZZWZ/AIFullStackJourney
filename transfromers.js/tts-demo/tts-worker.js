// tts-worker.js
import {
  env,
  pipeline,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1";

let tts = null;
let loadingPromise = null;
let currentAbortController = null;

// 可配置：WASM 文件路径（仅在回退到 wasm 时用到）
env.allowLocalModels = false;
env.backends.onnx.wasm.wasmPaths =
  "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/";

// SpeechT5 需要提供一个说话人嵌入，否则会报错或发出默认/随机音色
const DEFAULT_SPEAKER_EMBEDDINGS_URL =
  "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin";

// 小 helper：向主线程发送状态
function postStatus(msg, progress) {
  self.postMessage({ type: "status", msg, progress });
}

// 捕获 Worker 全局未捕获错误并转发到主线程，便于调试
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
    const reason = e?.reason;
    const msg =
      (reason && (reason.message || reason.toString())) ||
      "Unhandled promise rejection";
    self.postMessage({ type: "error", error: msg });
  } catch {}
});

// 若页面不具备跨源隔离（COOP/COEP），避免多线程 WASM 配置导致崩溃
try {
  if (typeof crossOriginIsolated !== "undefined" && !crossOriginIsolated) {
    env.backends.onnx.wasm.numThreads = 1;
  }
} catch {}

self.onmessage = async (e) => {
  const data = e.data;

  if (data.cmd === "speak") {
    const { text, useWebGPU = true, useQuant = false } = data;

    // 如果之前存在正在进行的请求，先拒绝或尝试取消
    if (currentAbortController) {
      postStatus("正在取消上一次任务，请稍候");
      currentAbortController.abort?.();
      // 继续并创建新的 controller
    }
    currentAbortController = new AbortController();
    const signal = currentAbortController.signal;

    try {
      // 1) 确定 device：尝试 WebGPU（若允许 & 支持），否则回退到 "cpu"/wasm
      let device = "cpu";
      if (useWebGPU && typeof navigator !== "undefined" && navigator.gpu) {
        device = "webgpu";
      }

      postStatus(`初始化 TTS 模型（device=${device}）`, 0.05);

      // 2) 延迟加载模型（只加载一次）
      if (!tts) {
        // 防止并发多次加载：若已有 loadingPromise，等待它
        if (!loadingPromise) {
          loadingPromise = (async () => {
            const baseOpts = {
              device, // 'webgpu' 或 'cpu'
              quantized: useQuant,
            };

            const loadWith = async (task, opts) => {
              postStatus(
                `开始从远端加载模型（task=${task}, device=${opts.device}）`,
                0.1
              );
              return pipeline(task, "Xenova/speecht5_tts", opts);
            };

            try {
              // 首选 text-to-speech
              return await loadWith("text-to-speech", baseOpts);
            } catch (e1) {
              // 若 webgpu 失败，尝试 CPU 回退
              if (baseOpts.device === "webgpu") {
                try {
                  postStatus("WebGPU 初始化失败，回退到 CPU/WASM", 0.12);
                  return await loadWith("text-to-speech", {
                    ...baseOpts,
                    device: "cpu",
                  });
                } catch (e2) {
                  // 若仍失败，尝试别名 task
                  try {
                    postStatus("回退到别名管道 text-to-audio (CPU)", 0.12);
                    return await loadWith("text-to-audio", {
                      ...baseOpts,
                      device: "cpu",
                    });
                  } catch (e3) {
                    throw e3;
                  }
                }
              }

              // 非 webgpu 场景，尝试别名
              try {
                postStatus("text-to-speech 不可用，尝试 text-to-audio", 0.12);
                return await loadWith("text-to-audio", baseOpts);
              } catch (e4) {
                throw e4;
              }
            }
          })();
        }
        // 等待加载完成（或失败）
        tts = await loadingPromise;
        postStatus("模型加载完成，准备推理", 0.4);
      } else {
        postStatus("模型已在内存，准备推理", 0.4);
      }

      // check cancel
      if (signal.aborted) throw new Error("已取消");

      // 3) 推理
      postStatus("开始语音合成...", 0.6);

      // 有的 pipeline 支持传入 signal/abort token —— 若库支持可接入，否则我们在外层处理
      let output = await tts(text, {
        speaker_embeddings: DEFAULT_SPEAKER_EMBEDDINGS_URL,
      });

      // 如果 output 包含 progress 信息（某些实现可能返回部分流式数据），可在这里 postStatus 更新
      // 但常规 pipeline 返回一个完整结果：{ audio: Float32Array, sampling_rate: number }

      if (signal.aborted) throw new Error("已取消");

      if (!output || !output.audio) {
        throw new Error("模型没有返回 audio 字段");
      }

      // 把音频缓冲传给主线程（transfer）
      const audioBuffer = output.audio.buffer;
      const sampling_rate = output.sampling_rate ?? 24000; // 若没有采样率，假设 24000

      postStatus("合成完成，发送音频到主线程", 0.95);
      self.postMessage({ type: "audio", audio: audioBuffer, sampling_rate }, [
        audioBuffer,
      ]);

      postStatus("就绪", 1);
    } catch (err) {
      if (err?.name === "AbortError" || err?.message === "已取消") {
        postStatus("已取消", 0);
        self.postMessage({ type: "error", error: "用户取消" });
      } else {
        console.error("Worker TTS 错误：", err);
        postStatus("失败", 0);
        self.postMessage({ type: "error", error: err?.message ?? String(err) });
        // 若加载失败，清空 loadingPromise 以便后续重试
        loadingPromise = null;
        tts = null;
      }
    } finally {
      // 清理 abort controller
      currentAbortController = null;
    }
  } else if (data.cmd === "cancel") {
    if (currentAbortController) {
      currentAbortController.abort?.();
      postStatus("取消请求已发出");
    } else {
      postStatus("无进行中的任务可取消");
    }
  }
};
