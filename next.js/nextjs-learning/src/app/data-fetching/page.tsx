import Link from 'next/link'
import UserList from './UserList'
import TodoForm from './TodoForm'

// 模拟API数据
async function getUsers() {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '前端开发' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '后端开发' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '产品经理' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'UI设计师' },
  ]
}

async function getTodos() {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return [
    { id: 1, title: '学习Next.js基础', completed: true },
    { id: 2, title: '理解Server Components', completed: false },
    { id: 3, title: '掌握App Router', completed: false },
    { id: 4, title: '学习Server Actions', completed: false },
  ]
}

export default async function DataFetching() {
  // 在Server Component中直接使用async/await获取数据
  const users = await getUsers()
  const todos = await getTodos()

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
            🔄 Next.js 数据获取
          </h1>
          <p className="text-gray-600">
            探索Next.js中不同的数据获取方法：Server Components、Server Actions和API Routes。
          </p>
        </div>

        {/* 数据获取方法对比 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            数据获取方法对比
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-600 mb-2">Server Components</h3>
              <p className="text-sm text-gray-600 mb-2">
                在服务器上直接获取数据，减少客户端JavaScript
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 直接在组件中使用async/await</li>
                <li>• 数据在服务器上获取</li>
                <li>• 减少客户端包大小</li>
              </ul>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">Server Actions</h3>
              <p className="text-sm text-gray-600 mb-2">
                处理表单提交和数据变更的服务器函数
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 处理表单提交</li>
                <li>• 数据库操作</li>
                <li>• 渐进式增强</li>
              </ul>
            </div>
            <div className="p-4 border border-purple-200 rounded-lg">
              <h3 className="font-semibold text-purple-600 mb-2">API Routes</h3>
              <p className="text-sm text-gray-600 mb-2">
                创建RESTful API端点
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 创建API端点</li>
                <li>• 第三方集成</li>
                <li>• 客户端数据获取</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Server Components 数据获取演示 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Server Component 数据获取
            </h3>
            <UserList users={users} />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>特点：</strong> 数据在服务器上获取，页面在服务器上渲染，然后发送到客户端。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4">
              Server Actions 演示
            </h3>
            <TodoForm initialTodos={todos} />
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>特点：</strong> 表单提交直接调用服务器函数，无需创建API端点。
              </p>
            </div>
          </div>
        </div>

        {/* 代码示例 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            代码示例
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">Server Component 数据获取</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 在Server Component中直接获取数据
export default async function Page() {
  const users = await getUsers() // 在服务器上执行
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">Server Actions</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 定义Server Action
async function addTodo(formData: FormData) {
  'use server'
  
  const title = formData.get('title')
  // 处理数据...
}

// 在组件中使用
<form action={addTodo}>
  <input name="title" />
  <button type="submit">添加</button>
</form>`}
              </pre>
            </div>
          </div>
        </div>

        {/* React vs Next.js 数据获取对比 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            React vs Next.js 数据获取对比
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">React (传统方式)</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 需要在客户端获取数据
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>加载中...</div>
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Next.js (Server Components)</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`// 在服务器上直接获取数据
async function UserList() {
  const users = await getUsers() // 服务器端执行
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}`}
              </pre>
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
              href="/components-demo"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              组件演示
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


