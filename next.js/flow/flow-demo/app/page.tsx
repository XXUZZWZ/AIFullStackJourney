"use client"

import ReactFlow,{
  Background,
  BackgroundVariant
} from 'reactflow'
import React from 'react'
import'reactflow/dist/style.css'


export default function Home() {
  const nodes = [
    {
      id: "1",
      position: {
        x: 100,
        y: 100
      },
      data: {
        label: "开始节点"
      }
    },{
      id:"2",
      position:{
        x:100,
        y:200
      },
      data:{
        label:"结束节点"
      }
    }
  ]
  const edges = [
    {
      id:"e1-2",
      source:"1",
      target:"2"
    }
  ]

  return (
    <div style={ {width:"100vw",height:"100vh"}}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Background
       
        />
      </ReactFlow>
    </div>
  )
}
