import React from "react";
import { type TreeNode } from "./TreeNode";

interface ConditionalTreeProps<T> {
  data: T;
  nodes: TreeNode<T>[];
}

export default function ConditionalTree<T>({ data, nodes }: ConditionalTreeProps<T>) {
  const renderNodes = (nodes: TreeNode<T>[]): React.ReactNode => {
    return nodes.map((node) => {
      // 如果有条件且不满足，则不渲染
      if (node.condition && !node.condition(data)) {
        return null;
      }

      return (
        <div key={node.id} style={{ marginLeft: '20px' }}>
          {/* 渲染当前节点 */}
          {node.render(data)}

          {/* 递归渲染子节点 */}
          {node.children && node.children.length > 0 && (
            <div style={{ marginLeft: '20px' }}>
              {renderNodes(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return <div>{renderNodes(nodes)}</div>;
}

