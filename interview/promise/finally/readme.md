# finally 了解多少？ ES9

- finally 了解多少？
  - Promise.prototype.finaly 是 es2018 引入的 API ,用于在 Promise 成功或失败都执行的一次回调，它不会改变原来的值，只做收尾工作，它的返回值往往回被忽略，但如果回调错误会覆盖原来状态
  - loading 状态处理 相比 then catch 更简洁 ，语义化。

