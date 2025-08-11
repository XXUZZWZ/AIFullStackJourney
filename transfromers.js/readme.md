### 可以玩的方向（都能在浏览器本地跑）
- 文本生成/对话（小模型）
  - **用途**: 本地小助手、离线补全
  - **模型**: `Xenova/gpt2` 等小型 text-generation
  - 代码:
    ```js
    import { pipeline } from '@xenova/transformers';
    const generate = await pipeline('text-generation', 'Xenova/gpt2', { device: 'webgpu' });
    const out = await generate('Once upon a time', { max_new_tokens: 40 });
    ```

- 语音转文字（ASR，麦克风）
  - **用途**: 语音输入、字幕
  - **模型**: `Xenova/whisper-tiny` / `whisper-small`
  - 代码:
    ```js
    const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
    // audioBuffer/Float32Array → 识别
    const text = await asr(audioFloat32, { chunk_length_s: 30 });
    ```

- 图片描述（Image Captioning）
  - **用途**: 给图配文、无障碍辅助
  - **模型**: `Xenova/blip-image-captioning-base`
  - 代码:
    ```js
    const captioner = await pipeline('image-to-text', 'Xenova/blip-image-captioning-base');
    const out = await captioner(fileOrImageBitmap);
    ```

- 目标检测/分割
  - **用途**: 画框/抠图、小型安防或教学 Demo
  - **模型**: `Xenova/detr-resnet-50`（检测）、`Xenova/segment-anything`（分割，较大）

- 零样本分类（Zero-shot）
  - **用途**: 无需训练的多标签分类
  - **模型**: `Xenova/mobilebert-zeroshot-v2` 等
  - 代码:
    ```js
    const zsc = await pipeline('zero-shot-classification');
    await zsc('这篇文章讲AI', ['体育','科技','美食']);
    ```

- 句向量/相似度（Embedding）
  - **用途**: 本地搜索、RAG 客户端侧重排
  - **模型**: `Xenova/all-MiniLM-L6-v2`
  - 代码:
    ```js
    const fe = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const emb = await fe('你好，世界'); // Float32Array
    ```

- 翻译/摘要
  - **用途**: 网页内快速处理文本
  - **模型**: `Xenova/mbart-large-50-many-to-many-mmt`（翻译）、`Xenova/pegasus-xsum`（摘要）

- 本地缓存/离线
  - 浏览器会自动把模型缓存到 IndexedDB（你已在 Application → Cache Storage 看到 `transformers-cache`）。
  - 也可把模型放到本地静态目录，设置 `env.localModelPath` 离线加载。

- 性能技巧
  - 勾选 WebGPU（可用则显著提速），无则回退 CPU/WASM。
  - 使用量化模型（`quantized: true`）省内存、提速，质量略降。
  - 懒加载 pipeline、复用同一实例。