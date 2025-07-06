# shot-word demo

概述；利用 React 框架 实现上传图片，调用 moon-shoot 多模态模型识别图片，并通过设计 prompt 生成返回一个 json 数据，并调用火山引擎语音模型生成对应的语音。

## 数据设计

1. 用户上传的图片 image
2. 图片多模态模型识别结果 data,里面有页面渲染需要的所有数据。
   `
{
"image_discription": "图片描述",
"representative_word": "图片代表的英文单词",
"example_sentence": "结合英文单词和图片描述，给出一个简单的例句",
"explaination": "结合图片解释英文单词，段落以 Look at...开头，将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句",
"explaination_replys": ["根据 explaination 给出的回复 1", "根据 explaination 给出的回复 2"]
}`
3. 例句语音，请求到的 explaination 的音频

## 页面结构

一个图片上传卡片，一个点击查看详情页面的按钮，以及点击按钮出现的详情页面，页面垂直排布，使用 flex 布局

## 事件处理

1. 处理图片上传事件
2. 点击查看详情按钮展开详情页和收起详情页

## 组件结构

- APP
  - PictureCard
