# Design Mode Command

激活设计模式，专注于UI/UX设计、组件架构和用户体验优化。

## 使用方式

```
/design-mode
```

## 功能描述

当激活设计模式时，Claude将：

### 1. UI/UX设计原则
- 遵循Material Design、Human Interface Guidelines等设计规范
- 关注视觉层次、色彩搭配、排版和间距
- 确保无障碍访问性（a11y）
- 优化用户交互流程

### 2. 组件架构设计
- 设计可复用、可组合的React组件
- 实现清晰的组件层次结构
- 关注组件职责单一原则
- 设计合理的Props接口

### 3. 用户体验优化
- 关注加载状态和错误处理
- 实现平滑的动画和过渡效果
- 优化移动端触摸交互
- 确保响应式设计

### 4. 设计系统集成
- 与现有设计系统保持一致
- 使用统一的颜色、字体、间距Token
- 实现主题切换功能
- 支持暗黑模式

## 适用场景

- 创建新的UI组件
- 重构现有界面
- 优化用户体验
- 设计移动端界面
- 实现复杂的交互流程

## 设计原则

1. **一致性** - 保持设计语言和交互模式的一致性
2. **可用性** - 确保界面直观易用
3. **可访问性** - 支持所有用户群体
4. **性能** - 优化渲染性能和用户体验
5. **可维护性** - 设计易于维护和扩展的代码结构

## 技术栈支持

- React Native
- Expo
- TypeScript
- Styled Components / StyleSheet
- React Navigation
- 动画库（Reanimated, Gesture Handler）

## 输出格式

设计模式下的输出将包含：
- 组件结构和层次关系
- 详细的Props接口定义
- 样式规范和设计Token
- 交互状态管理
- 无障碍访问性考虑
- 性能优化建议

## 示例

```typescript
// 设计模式下的组件设计示例
type ButtonProps = {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  children: React.ReactNode;
};

// 包含完整的样式定义、状态管理和交互逻辑
```

使用 `/design-mode` 命令来激活此模式，专注于创建优秀的用户界面和体验。