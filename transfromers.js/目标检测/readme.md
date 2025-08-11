# 目标检测（DETR）

- **用途**: 画框/抠图、小型安防或教学 Demo
- **模型**: `Xenova/detr-resnet-50`（检测）、`Xenova/segment-anything`（分割，较大）

## 运行

- 请在本地 HTTP 服务下运行（不要用 file:// 打开页面）
  - `npx http-server -p 5173 -c-1 --cors`
- 访问 `http://localhost:5173/transfromers.js/目标检测/index.html`

如需避免远程模型的 CORS：

- 将模型目录放到 `transfromers.js/目标检测/models/Xenova/detr-resnet-50`（或等效路径）
- 代码已启用本地优先加载（`env.allowLocalModels = true`，`env.localModelPath = './models'`）
- 若本地不存在则回退远程 CDN

## 使用

1. 选择图片
2. 勾选 WebGPU（若浏览器支持）
3. 点击“开始检测”，稍等即可在画布上看到检测框与右侧结果列表

## 文件

- `index.html` 页面与控件
- `main.js` 主线程：加载图片、发送到 Worker、绘制检测框
- `worker.js` Worker：加载 `object-detection` 管道（DETR），输出检测结果
