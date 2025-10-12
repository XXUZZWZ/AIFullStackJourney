import React, { useState } from "react";
import { type TreeNode } from "./TreeNode";
import ConditionalTree from "./ConditionalTree";

interface MyData {
  type: string;
  value: number;
}

const tree: TreeNode<MyData>[] = [
  {
    id: "1",
    condition: (data) => data.type === 'A',
    render: (data) => <div>类型A: {data.value}</div>,
    children: [
      {
        id: 11,
        condition: (data) => data.value > 10,
        render: (data) => <div>数值大于10的数字 {data.value}</div>
      }
    ]
  },
  {
    id: 2,
    condition: (data) => data.type === 'B',
    render: (data) => <div>type 为B {data.value}</div>
  }
];

export default function App() {
  const [data, setData] = useState<MyData>({
    type: 'A',
    value: 15
  });

  return (
    <div>
      <h2>条件树渲染示例</h2>
      <ConditionalTree data={data} nodes={tree} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setData({ type: 'A', value: 5 })}>改A 值为 5</button>
        <button onClick={() => setData({ type: 'B', value: 20 })}>改B 值为 20</button>
      </div>
    </div>
  );
}