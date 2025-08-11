# Transformers.js TTS（WebGPU 可选）示例说明

本示例在浏览器中使用 `@xenova/transformers` 做文本转语音（TTS），并将生成的音频：

- 通过 WebAudio 立即播放；
- 写入页面上的 `<audio id="audio">` 控件，支持暂停、拖动与下载。

## 运行方式

- 请在本地 HTTP 服务下运行（不要用 `file://` 打开页面）。
- 推荐命令（项目根目录执行）：
  - `npx http-server -p 5173 -c-1 --cors`
- 浏览器访问：`http://localhost:5173/deepseek/tts-demo/index.html`
- WebGPU 可选；若不可用会自动回退到 CPU/WASM。

## 目录与文件

- `index.html`：页面结构（文本框、按钮、进度、`<audio>`）。
- `main.js`：主线程逻辑（与 Worker 通信、WebAudio 播放、写入 `<audio>`）。
- `tts-worker.js`：Worker 线程（加载管道、推理、错误转发）。

## 实现方法（核心思路）

1. 在 Worker 端（`tts-worker.js`）加载 TTS 管道并推理：

- 通过 CDN 引入 `@xenova/transformers`（示例使用 `2.17.1`），并设置 `env.backends.onnx.wasm.wasmPaths` 到同版本 `dist/`；
- 若页面不具备跨源隔离（无 COOP/COEP），设置 `env.backends.onnx.wasm.numThreads = 1`；
- 设备选择：若勾选 WebGPU 且 `navigator.gpu` 存在，则 `device='webgpu'`，否则 `cpu`；
- 延迟加载管道，优先 `text-to-speech`，失败则回退到 `cpu` 或别名 `text-to-audio`；
- SpeechT5 需要说话人嵌入 `speaker_embeddings`（URL），示例默认值：
  `https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin`；
- 得到 `{ audio: Float32Array, sampling_rate }` 后，用 `postMessage` 发回主线程（Transferable）。

1. 在主线程（`main.js`）接收音频并播放/写入 `<audio>`：

- WebAudio 即时播放：
  - 创建 `AudioContext` 与 `AudioBuffer`，将 `Float32Array` 拷贝到通道后播放；
- 将 Float32 PCM 编码为标准 16-bit PCM WAV，并写入 `<audio>`：
  - 通过 `encodeWAV(float32Array, sampleRate)` 生成 WAV Blob；
  - 用 `URL.createObjectURL(wavBlob)` 生成 URL，赋给 `audio.src`；
  - 复用时先 `URL.revokeObjectURL(lastAudioObjectUrl)` 释放旧 URL，避免内存泄漏。

核心片段（写入 `<audio>`）：

```js
const wavBlob = encodeWAV(floatArray, data.sampling_rate);
if (lastAudioObjectUrl) URL.revokeObjectURL(lastAudioObjectUrl);
lastAudioObjectUrl = URL.createObjectURL(wavBlob);
audioEl.src = lastAudioObjectUrl;
```

## 常见问题

- Unsupported pipeline: text-to-speech
  - 使用的 Transformers.js 版本过旧；请使用 ≥ 2.7.0（示例用 2.17.1）。
- TypeError: Failed to fetch
  - 多因网络/CORS；请确保在本地 HTTP 服务下运行，且能访问 CDN 和 `speaker_embeddings` URL。
- 首次加载慢
  - 模型较大，需耐心等待；后续通常更快（受缓存影响）。
- WebGPU 不可用
  - 自动回退到 CPU/WASM，功能正常但速度会慢一些。

## 参考

- Transformers.js 文档（Pipelines）：`https://huggingface.co/docs/transformers.js/api/pipelines`
- 模型：`Xenova/speecht5_tts`
