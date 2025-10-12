## src 目录学习笔记（lowcode-editor）

### 目录结构概览

- **App.tsx**: 应用根组件，使用 `allotment` 做整体布局（左右/多列分栏）。左侧容器挂载 `Editor`。
- **main.tsx**: 入口文件，使用 React 18 `createRoot` 挂载 `App`，并引入全局样式 `index.css`。
- **index.css**: 引入 `tailwindcss`，便于原子化样式开发。
- **vite-env.d.ts**: Vite 环境类型声明。
- **editor/**: 低代码编辑器核心模块
  - `index.tsx`: 编辑器主界面骨架，三栏布局：`Material`（物料区）| `EditorArea`（画布/编辑区）| `Setting`（属性设置区），顶部 `Header`。
  - `components/`
    - `Header/index.tsx`: 顶部工具栏占位。
    - `Material/index.tsx`: 物料面板占位。
    - `EditorArea/index.tsx`: 编辑区组件，演示向 store 注入组件并渲染 JSON 结构。
    - `Setting/index.tsx`: 右侧属性设置面板占位。
  - `stores/components.tsx`: 使用 `zustand` 管理组件树（增删查、属性存储、父子层级）。

### 关键技术点

- **布局**: `allotment` 提供可拖拽分栏；编辑器内部再次使用 `Allotment` 三栏布局。
- **样式体系**: Tailwind CSS（在 `index.css` 中通过 `@import "tailwindcss";` 引入）。
- **状态管理**: `zustand` 自定义 store：
  - `Component` 接口定义了节点的 `id/name/props/children/parentId/desc`。
  - `components` 初始包含根节点 `Page`（id=1）。
  - `addComponent(component, parentId?)`：
    - 传 `parentId` 时，将新组件挂到父节点 `children`；仅返回浅拷贝触发更新。
    - 未传或未找到父时，作为根级节点追加。
  - `deleteComponent(componentId)`：定位父节点后从 `children` 里移除并触发更新；仅处理有 `parentId` 的子节点删除。
  - `getComponentById(id, components)`：深度优先查找组件树。

### 运行时数据流（EditorArea 演示）

`EditorArea` 中：

```tsx
useEffect(() => {
  addComponent({ id: 2, name: "container", props: {} }, 1);
  addComponent({ id: 3, name: "Video", props: {} }, 2);
}, []);
```

- 第一次挂载时：
  - 向 id=1 的 `Page` 下添加 `container(id=2)`。
  - 向 `container(id=2)` 下添加 `Video(id=3)`。
- 界面通过 `JSON.stringify(components, null, 2)` 直观显示组件树结构。

### 可改进点与建议

- 删除根节点或无 `parentId` 节点的能力：目前 `deleteComponent` 只处理子节点。
- `updateComponent` / `updateComponentProps` 尚未实现。
- 组件 id 的生成应避免手写重复，可引入 `nanoid` 或集中 id 生成器。
- `props` 类型可细化成字典 + 定义各物料的属性 schema，方便右侧 `Setting` 自动表单化。
- 物料区 `Material` 可对接拖拽（如 `dnd-kit`）与画布落点；右侧 `Setting` 可基于选中节点联动。
- `EditorArea` 的示例逻辑应移至交互（拖拽/点击）事件，避免固定注入示例数据。

### 学习要点串讲

1. Allotment 的分栏用法（`Pane` 的 `preferredSize/minSize/maxSize/snap`）。
2. Tailwind 在 Vite/React 项目的接入与原子类使用。
3. 使用 `zustand` 维护树形数据：不可变更新、按引用触发渲染的注意点。
4. 低代码编辑器三栏信息架构：物料、画布、属性联动的最小闭环。

### 快速定位文件

- 布局骨架：`src/App.tsx`、`src/editor/index.tsx`
- 状态管理：`src/editor/stores/components.tsx`
- 三栏组件：`src/editor/components/*`
