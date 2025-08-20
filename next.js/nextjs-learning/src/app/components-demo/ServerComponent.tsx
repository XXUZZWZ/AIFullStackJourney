export default function ServerComponent() {
  // 这个时间戳在服务器上生成，不会在客户端更新
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
      <h4 className="font-semibold text-blue-800 mb-2">服务器组件</h4>
      <p className="text-sm text-blue-700 mb-2">
        当前时间: <span className="font-mono">{timestamp}</span>
      </p>
      <p className="text-xs text-blue-600">
        这个时间戳在服务器构建时确定，不会动态更新
      </p>
    </div>
  )
}


