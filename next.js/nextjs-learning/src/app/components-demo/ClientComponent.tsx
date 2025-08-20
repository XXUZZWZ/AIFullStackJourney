'use client'

import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [timestamp, setTimestamp] = useState('')
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    const updateTime = () => {
      setTimestamp(new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    setClickCount(prev => prev + 1)
  }

  return (
    <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
      <h4 className="font-semibold text-green-800 mb-2">客户端组件</h4>
      <p className="text-sm text-green-700 mb-2">
        当前时间: <span className="font-mono">{timestamp}</span>
      </p>
      <p className="text-xs text-green-600 mb-3">
        这个时间戳每秒更新，包含交互功能
      </p>
      <button 
        onClick={handleClick}
        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
      >
        点击次数: {clickCount}
      </button>
    </div>
  )
}


