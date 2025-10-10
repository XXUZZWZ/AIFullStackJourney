'use client';
import React, {
  useCallback,
  useState,
  useEffect
} from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  Connection,
  Edge,
  Node
} from 'reactflow';
import 'reactflow/dist/style.css'
import {
  supabase
} from '@/lib/supabaseClient';

export default function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id:"1",
      position: {
        x: 100,
        y: 100
      },
      data: {
        label: '起点'
      }
    }
  ])
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(2);
  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds))
  }, [])
  const addNode = () => {
    const newId = String(nodeId);
    const newNode:Node = {
      id: newId,
      position: {
        x: 100 + nodeId * 50,
        y: 100
      },
      data: {
        label: `节点 ${newId}`
      }
    }
    setNodes((nds) => [...nds, newNode]);
    setEdges((edgs) => [
      ...edgs,
      {
        id: `e${nodeId - 1}-${newId}`,
        source: String(nodeId - 1),
        target: newId,
      }
    ]);
    setNodeId(id => id + 1);
  }
  const removeNode = () => {
    if(nodes.length <= 1){
      return 
    }
    const lastNode = nodes.at(-1);
    setNodes(nds => nds.filter(n => n.id !== lastNode?.id));
    setEdges(eds => eds.filter(e => e.source !== lastNode?.id && e.target !== lastNode?.id));
  }
  const saveFlow = async () => {
    const {
      error
    } = await supabase.from('flows').insert({
      name: "demo flow",
      nodes,
      edges
    });
    if (error) console.error(error);
    else alert('已保存到Supabase');
  }
  const onNodeDoubleClick = (_:React.MouseEvent, node:Node) => {
    // console.log(node);
    const newLabel = prompt("请输入新的节点内容", 
      node.data.label as string);
    if (newLabel !== null && newLabel.trim() !== '') {
      setNodes(nds => 
        nds.map(n => 
          n.id === node.id? { ...n, data: {...n.data, label: newLabel}}:n
        )
      )
    }
  }
  useEffect(()=>{
    const loadFlow = async () =>{
      const { data, error } = await supabase
        .from('flows')
        .select('nodes, edges')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error(error);
        return;
      }
      if (!data) return;
      const loadedNodes = (data.nodes ?? []) as unknown as Node[];
      const loadedEdges = (data.edges ?? []) as unknown as Edge[];
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      // 推断下一个节点ID（假设现有ID为数字字符串）
      const maxId = loadedNodes
        .map(n => Number(n.id))
        .filter(n => !Number.isNaN(n))
        .reduce((m, n) => Math.max(m, n), 0);
      setNodeId(maxId + 1);
    };
    loadFlow();
  }, [])
  return (
    <div style={{width:'100%', height: '100vh'}}>
      <div style={{marginBottom: 10}}>
        <button onClick={addNode} style={{marginRight: 10}}>添加节点</button>
        <button onClick={removeNode} style={{marginRight: 10}}>移除节点</button>
        <button onClick={saveFlow} style={{marginRight: 10}}>保存到supabase</button>
      </div>
      <ReactFlow
        nodes={nodes}
        onNodeDoubleClick={onNodeDoubleClick}
        onConnect={onConnect}
        edges={edges}
        fitView
      >
        <Background />
        <Controls/>
      </ReactFlow>
    </div>
  );
}