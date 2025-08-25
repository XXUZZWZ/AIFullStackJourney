"use client"
import {
  useEffect, useState
} from 'react';
import {
  type Todo,
  type User,
  type CreateTodoRequest,
  type TodoStats
} from '@/types';
import TodoStatsChart from '@/components/TodoStatsChart';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [input, setInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 显示消息并自动消失
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // 3秒后自动消失
  };

  // 清理消息
  const clearMessage = () => {
    setMessage(null);
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      const todos = data.todos || data;

      // 确保ID是数字类型
      const formattedTodos = todos.map((todo: any) => ({
        ...todo,
        id: Number(todo.id),
        userId: todo.userId ? Number(todo.userId) : null
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Fetch todos error:', error);
      showMessage('error', '加载待办事项失败');
    } finally {
      setIsLoading(false);
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      const users = data.users || data;

      // 确保ID是数字类型
      const formattedUsers = users.map((user: any) => ({
        ...user,
        id: Number(user.id)
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Fetch users error:', error);
      showMessage('error', '加载用户列表失败');
    }
  }

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/todos/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
      showMessage('error', '加载统计数据失败');
    } finally {
      setStatsLoading(false);
    }
  }
  const addTodo = async () => {
    const title = input.trim();
    if (!title) return;

    setIsSubmitting(true);
    clearMessage();

    // 创建临时ID（用于UI更新）
    const tempId = Date.now();

    // 准备todo数据
    const todoData: CreateTodoRequest = {
      title,
      userId: selectedUserId
    };

    // 找到选中的用户信息
    const selectedUser = users.find(user => user.id === selectedUserId);

    // 乐观更新：立即更新UI
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      completed: false,
      userId: selectedUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: selectedUser || null
    };

    // 立即更新UI
    setTodos([optimisticTodo, ...todos]);
    setInput('');
    setSelectedUserId(null);
    showMessage('success', '添加成功！');

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '添加失败');
      }

      const newTodo = data.todo || data;

      // 更新为真实的todo数据
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === tempId ? {
            ...newTodo,
            id: Number(newTodo.id),
            userId: newTodo.userId ? Number(newTodo.userId) : null
          } : todo
        )
      );

      showMessage('success', '待办事项添加成功！');
      // 刷新统计数据
      fetchStats();
    } catch (error) {
      // 回滚UI状态
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
      setInput(title); // 恢复输入
      setSelectedUserId(todoData.userId ?? null); // 恢复用户选择

      const errorMessage = error instanceof Error ? error.message : '添加失败，请重试';
      showMessage('error', errorMessage);
      console.error('Add todo error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
  const toggleTodo = async (id: number, completed: boolean) => {
    // 找到当前todo，保留所有信息用于回滚
    const currentTodo = todos.find(todo => todo.id === id);
    if (!currentTodo) return;

    // 乐观更新：立即更新UI，保留所有原始信息
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    try {
      console.log('发送PATCH请求:', { id, completed: !completed });

      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: !completed })
      });

      console.log('PATCH响应状态:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error('PATCH错误响应:', errorData);

        // 回滚UI状态，恢复原始状态
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...currentTodo, completed } : todo
          )
        );
        showMessage('error', errorData.error || '更新状态失败');
        return;
      }

      const data = await res.json();
      const updatedTodo = data;

      // 调试信息
      console.log('API返回的数据:', updatedTodo);
      console.log('用户信息:', updatedTodo.user);

      // 格式化更新后的todo数据，保留原始用户信息
      const formattedTodo = {
        ...updatedTodo,
        id: Number(updatedTodo.id),
        userId: updatedTodo.userId ? Number(updatedTodo.userId) : null,
        user: updatedTodo.user ? {
          ...updatedTodo.user,
          name: updatedTodo.user.name || ''
        } : null
      };

      // 确保ID类型匹配
      setTodos(prevTodos =>
        prevTodos.map(todo => todo.id === id ? formattedTodo : todo)
      );

      // 刷新统计数据
      fetchStats();
    } catch (error) {
      // 回滚UI状态，恢复所有原始信息
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...currentTodo, completed } : todo
        )
      );
      showMessage('error', '更新状态失败，请重试');
      console.error('Toggle todo error:', error);
    }
  }
  const deleteTodo = async (id: number) => {
    try {
      if (!id) {
        console.error('Invalid todo ID:', id);
        return;
      }

      // 乐观更新：立即从UI中删除
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      showMessage('success', '删除成功！');

      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        // 回滚UI状态
        const todoToRestore = todos.find(todo => todo.id === id);
        if (todoToRestore) {
          setTodos(prevTodos => [todoToRestore, ...prevTodos]);
        }
        showMessage('error', '删除失败，请重试');
        return;
      }

      showMessage('success', '待办事项删除成功！');
      // 刷新统计数据
      fetchStats();
    } catch (error) {
      // 回滚UI状态
      const todoToRestore = todos.find(todo => todo.id === id);
      if (todoToRestore) {
        setTodos(prevTodos => [todoToRestore, ...prevTodos]);
      }
      showMessage('error', '删除失败，请重试');
      console.error('Delete todo error:', error);
    }
  }
  useEffect(() => {
    fetchTodos();
    fetchUsers();
    fetchStats();
  }, [])

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter 添加todo
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && input.trim()) {
        addTodo();
      }
      // Escape 清除输入
      if (e.key === 'Escape') {
        setInput('');
        setSelectedUserId(null);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [input, selectedUserId]);

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Todos</h1>

      {/* 统计信息 */}
      {!isLoading && todos.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex gap-4 text-sm">
            <span className="text-gray-600">
              总计: <span className="font-semibold">{todos.length}</span>
            </span>
            <span className="text-green-600">
              已完成: <span className="font-semibold">{todos.filter(t => t.completed).length}</span>
            </span>
            <span className="text-blue-600">
              进行中: <span className="font-semibold">{todos.filter(t => !t.completed).length}</span>
            </span>
          </div>
        </div>
      )}

      {/* 饼状图统计 */}
      <div className="mb-6">
        <TodoStatsChart stats={stats || undefined} isLoading={statsLoading} />
      </div>

      {/* 快捷键说明 */}
      {!isLoading && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
          <strong>快捷键：</strong>
          <kbd className="mx-1 px-1 bg-blue-200 rounded">Enter</kbd>添加待办事项
          <kbd className="mx-1 px-1 bg-blue-200 rounded">Ctrl+Enter</kbd>快速添加
          <kbd className="mx-1 px-1 bg-blue-200 rounded">Esc</kbd>清除输入
        </div>
      )}

      {/* 调试信息 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded text-xs text-gray-700">
          <strong>调试信息：</strong>
          <br />
          <span>Todo数量: {todos.length}</span>
          <br />
          <span>用户数量: {users.length}</span>
          <br />
          <span>加载状态: {isLoading ? '加载中' : '完成'}</span>
          <br />
          <span>提交状态: {isSubmitting ? '提交中' : '空闲'}</span>
        </div>
      )}

      {/* 消息提示 */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex justify-between items-center">
            <span>{message.text}</span>
            <button
              onClick={clearMessage}
              className="ml-2 text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
      {/* 用户选择下拉框 */}
      <div className="mb-4">
        <select
          value={selectedUserId || ''}
          onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
          className="border p-2 rounded-md w-full"
          disabled={isSubmitting}
        >
          <option value="">选择用户（可选）</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>
      
      {/* 用一个容器包裹输入框和按钮，保证宽度一致 */}
      <div className="flex mb-4 w-full">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isSubmitting ? "添加中..." : "Add a new todo（Enter或Ctrl+Enter）"}
          className="border p-2 rounded-md flex-1"
          disabled={isSubmitting}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button
          className={`px-4 py-2 rounded-md ml-2 transition-colors ${
            isSubmitting
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          onClick={addTodo}
          disabled={isSubmitting}
        >
          {isSubmitting ? '添加中...' : 'Add'}
        </button>
      </div>
      {/* 加载状态 */}
      {isLoading && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      )}

      {/* 列表也放在和输入框一样的宽度容器内 */}
      <ul className="w-full list-none">
        {!isLoading && todos.length === 0 && (
          <li className="text-center py-8 text-gray-500">
            暂无待办事项，添加一个吧！
          </li>
        )}

        {todos.map(todo => (
            <li
              key={todo.id}
              className="flex justify-between items-center p-2 border rounded mb-2 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <span
                  onClick={()=>toggleTodo(todo.id,todo.completed)}
                  className={`cursor-pointer transition-colors ${
                    todo.completed
                      ? 'line-through text-gray-500 hover:text-gray-600'
                      : 'hover:text-blue-600'
                  }`}
                >
                  {todo.title}
                </span>
                {/* 显示用户信息 */}
                {todo.user && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      👤 {todo.user.name}
                    </span>
                    <span className="text-gray-400">
                      📧 {todo.user.email}
                    </span>
                  </div>
                )}
                {!todo.user && (
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      👤 匿名用户
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={()=>deleteTodo(todo.id)}
                className='text-red-500 hover:text-red-700 ml-2 px-2 py-1 rounded transition-colors hover:bg-red-50'
                title="删除"
              >
                ❌
              </button>
            </li>
          ))
        }
      </ul>
    </main>
  );
}

// 说明：
// 1. 原来你的输入框和按钮是直接放在 main 里，输入框用了 flex-1，但没有外层 flex 容器，flex-1 不会生效，导致宽度不一致。
// 2. 现在用 <div className="flex mb-4 w-full"> 包裹输入框和按钮，输入框用 flex-1，按钮自适应宽度，这样输入框和列表都能占满 main 的最大宽度。
// 3. 列表 <ul> 也加了 w-full，保证和输入区域宽度一致。
// 4. main 的 className 里的 max-auto 应为 mx-auto，修正了拼写。
