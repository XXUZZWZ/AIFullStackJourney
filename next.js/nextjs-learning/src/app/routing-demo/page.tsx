import Link from 'next/link'

export default function RoutingDemo() {
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
            📁 文件系统路由演示
          </h1>
          <p className="text-gray-600">
            在Next.js中，路由是基于文件系统的。每个文件夹代表一个路由段，每个page.tsx文件代表一个路由。
          </p>
        </div>

        {/* 路由结构展示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            当前路由结构
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="text-gray-600">src/app/</div>
            <div className="ml-4 text-gray-600">├── page.tsx</div>
            <div className="ml-4 text-gray-600">├── routing-demo/</div>
            <div className="ml-8 text-green-600">├── page.tsx ← 当前页面</div>
            <div className="ml-4 text-gray-600">├── components-demo/</div>
            <div className="ml-8 text-gray-600">├── page.tsx</div>
            <div className="ml-4 text-gray-600">└── data-fetching/</div>
            <div className="ml-8 text-gray-600">└── page.tsx</div>
          </div>
        </div>

        {/* 路由示例 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              静态路由
            </h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">/routing-demo</code> → 当前页面</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">/components-demo</code> → 组件演示</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">/data-fetching</code> → 数据获取</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              动态路由示例
            </h3>
            <div className="space-y-2 text-sm">
              <div><code className="bg-gray-100 px-2 py-1 rounded">/blog/[id]</code> → /blog/123</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">/users/[id]/posts/[postId]</code> → /users/1/posts/456</div>
              <div><code className="bg-gray-100 px-2 py-1 rounded">/products/[...slug]</code> → /products/electronics/phones</div>
            </div>
          </div>
        </div>

        {/* 导航链接 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            导航到其他示例页面
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/components-demo"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              组件演示
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

        {/* React Router vs Next.js 对比 */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            React Router vs Next.js 路由对比
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">React Router</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 需要手动配置路由
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/users/:id" element={<User />} />
  </Routes>
</BrowserRouter>`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Next.js</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 基于文件系统自动生成路由
src/app/
├── page.tsx          // "/"
├── about/
│   └── page.tsx      // "/about"
└── users/
    └── [id]/
        └── page.tsx  // "/users/[id]"`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


