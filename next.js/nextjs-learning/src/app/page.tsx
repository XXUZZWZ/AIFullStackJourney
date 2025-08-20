import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🚀 Next.js 学习之旅
          </h1>
          <p className="text-xl text-gray-600">
            欢迎React开发者探索Next.js的强大功能！
          </p>
        </div>

        {/* 学习路径卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              📁 文件系统路由
            </h3>
            <p className="text-gray-600 mb-4">
              告别React Router，体验基于文件系统的自动路由
            </p>
            <Link 
              href="/routing-demo" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              查看示例 →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              ⚡ 服务端组件
            </h3>
            <p className="text-gray-600 mb-4">
              学习Server Components和Client Components的区别
            </p>
            <Link 
              href="/components-demo" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              查看示例 →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              🔄 数据获取
            </h3>
            <p className="text-gray-600 mb-4">
              探索Server Actions和新的数据获取模式
            </p>
            <Link 
              href="/data-fetching" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              查看示例 →
            </Link>
          </div>
        </div>

        {/* React vs Next.js 对比 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            React vs Next.js 核心差异
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">特性</th>
                  <th className="text-left py-3 px-4 font-semibold">React</th>
                  <th className="text-left py-3 px-4 font-semibold">Next.js</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">路由</td>
                  <td className="py-3 px-4 text-gray-600">React Router</td>
                  <td className="py-3 px-4 text-green-600">文件系统路由</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">渲染</td>
                  <td className="py-3 px-4 text-gray-600">客户端渲染</td>
                  <td className="py-3 px-4 text-green-600">SSR/SSG/ISR</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">数据获取</td>
                  <td className="py-3 px-4 text-gray-600">useEffect + API</td>
                  <td className="py-3 px-4 text-green-600">Server Actions</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">SEO</td>
                  <td className="py-3 px-4 text-gray-600">需要额外配置</td>
                  <td className="py-3 px-4 text-green-600">开箱即用</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 快速开始按钮 */}
        <div className="text-center">
          <Link 
            href="/routing-demo"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            开始学习 Next.js
          </Link>
        </div>
      </div>
    </main>
  )
}
