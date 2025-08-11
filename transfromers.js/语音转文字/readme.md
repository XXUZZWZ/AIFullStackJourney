# 语音转文字（ASR，麦克风）

用途: 语音输入、字幕

模型: Xenova/whisper-tiny / whisper-small

代码:

运行

- 使用本地 HTTP 服务器（不要用 file:// 打开）：
  - `npx http-server -p 5173 -c-1 --cors`
- 访问 `http://localhost:5173/transfromers.js/语音转文字/index.html`

避免远程模型的 CORS（可选本地模型）：

- 将模型放在 `transfromers.js/语音转文字/models/Xenova/whisper-tiny`（或其他 whisper 变体）
- 代码已启用本地优先（`env.allowLocalModels = true`，`env.localModelPath = './models'`）
- 本地缺失时回退远程 CDN

说明

- 勾选 WebGPU（若浏览器支持）可加速；否则回退 CPU/WASM。
- 点击“开始录音”，讲话后点击“停止并转写”触发识别。
- 识别文本会出现在文本框中。

主要文件

- `index.html` 页面结构与控件
- `main.js` 主线程：录音、解码、与 Worker 通信
- `worker.js` Worker：加载 ASR 管道并转写
