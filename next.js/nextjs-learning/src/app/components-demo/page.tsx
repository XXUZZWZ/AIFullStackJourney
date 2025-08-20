import Link from 'next/link'
import ServerComponent from './ServerComponent'
import ClientComponent from './ClientComponent'

export default function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ⚡ 服务端组件 vs 客户端组件
          </h1>
          <p className="text-gray-600">
            学习Next.js中Server Components和Client Components的区别和使用场景。
          </p>
        </div>

        {/* 概念解释 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            核心概念
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Server Components (默认)
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 在服务器上渲染</li>
                <li>• 减少客户端JavaScript包大小</li>
                <li>• 可以直接访问后端资源</li>
                <li>• 不能使用useState、useEffect等hooks</li>
                <li>• 不能添加事件处理器</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-2">
                Client Components
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 在浏览器中渲染</li>
                <li>• 可以使用所有React hooks</li>
                <li>• 可以添加事件处理器</li>
                <li>• 可以访问浏览器API</li>
                <li>• 需要添加 'use client' 指令</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 实际演示 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Server Component 示例
            </h3>
            <ServerComponent />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>特点：</strong> 这个组件在服务器上渲染，时间戳在构建时确定，不会在客户端更新。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              Client Component 示例
            </h3>
            <ClientComponent />
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>特点：</strong> 这个组件在客户端渲染，时间戳会实时更新，包含交互功能。
              </p>
            </div>
          </div>
        </div>

        {/* 代码对比 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            代码对比
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Server Component</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 默认就是Server Component
export default function ServerComponent() {
  const timestamp = new Date().toLocaleString()
  
  return (
    <div>
      <p>服务器时间: {timestamp}</p>
      {/* 不能使用useState、onClick等 */}
    </div>
  )
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Client Component</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`'use client' // 必须添加这个指令

import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [timestamp, setTimestamp] = useState('')
  
  useEffect(() => {
    const updateTime = () => {
      setTimestamp(new Date().toLocaleString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div>
      <p>客户端时间: {timestamp}</p>
      <button onClick={() => alert('点击了!')}>
        点击我
      </button>
    </div>
  )
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* 使用建议 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            何时使用哪种组件？
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">使用 Server Components 当：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 需要获取数据</li>
                <li>• 访问后端资源</li>
                <li>• 在服务器上保持敏感信息</li>
                <li>• 减少客户端JavaScript包大小</li>
                <li>• 初始页面加载性能很重要</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">使用 Client Components 当：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 需要添加交互和事件监听器</li>
                <li>• 使用useState或其他React hooks</li>
                <li>• 使用浏览器专用API</li>
                <li>• 需要自定义hooks</li>
                <li>• 使用依赖于useState、useEffect的第三方库</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 导航 */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/routing-demo"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              路由演示
            </Link>
            <Link 
              href="/data-fetching"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              数据获取
            </Link>
            <Link 
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


