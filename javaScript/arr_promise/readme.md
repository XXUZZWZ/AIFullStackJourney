需求:
发送三个请求，等拿完三个链接 get, lee, shunwuyu 的仓库信息再执行下一行代码

api.github.io/users/XXUZZWZ/repos
api.github.io/users/LeeAt67/repos
api.github.io/users/shunwuyu/repos

- 有一堆的异步任务要执行
- 每一项是一个 promise
- Promise.all()
  - 本身返回一个接收结果的 Promise()
  - 所有项都解决了，都成功了,Promise.all() 就会成功并传入一个包含结果数组的 Promise
