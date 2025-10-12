import React from "react";

/**
 * 树节点接口
 * 支持泛型，默认值为 any
 */
export interface TreeNode<T = any> {
  /** 节点唯一标识 */
  id: string | number;
  /** 条件函数，可选，用于决定是否渲染该节点 */
  condition?: (data: T) => boolean;
  /** 渲染函数，返回 React 节点 */
  render: (data: T) => React.ReactNode;
  /** 子节点数组，支持递归 */
  children?: TreeNode<T>[];
}

