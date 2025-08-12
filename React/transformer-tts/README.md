# React Transformer TextToSpeech

- transformer

  - transformer.js AI 机器学习库
  - 来自于 huggingface 全球最大开源大模型社区
  - 将模型下载到浏览器端，js 开发者的智能战场未来

- 项目亮点
  - 使用 transformers.js 实现端模型
  - 使用 tailwindcss 使用原子 css 快速开发 类名文档语义化，特别适合 AI 生成
  - tailwindcss 高效解决适配 w-full max-w-xl
  - webworker nlp 任务
    1. 延迟加载模型
    2. 先渲染组件再实例化，提高渲染速度
    3. 卸载时移除事件
  - 封装组件
- 项目的难点

  - 单例模式封装 MyTextToSpeechPipeline
  - getInstance 只实例化一次
  - 懒执行
  - Promise.all + nlp 流程理解 (tokenizer model vocoder )

- 需要有一个一格 audio 标签的 url <- URL.createObjectURL(Blob)<---二进制数据位<---ttsModel 生成 <---input_ids(tokenizer 分词)+speeak_embeddings + vocoder 合成器 <---tokenizer.decode(input_ids) 解码
- URL.revokeObjectURL(url) 删除一个 url
- URL.createObjectURL(file)
- 大模型返回的 file (张量 )--> blob ---> URL.createObjectURL(blob) 创建一个 url
