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
