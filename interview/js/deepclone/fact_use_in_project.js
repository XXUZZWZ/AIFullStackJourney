// # 怎么用的，参数的默认值

// 用户会传入的，Object.assign() 收入囊中
// 合并参数和默认参数

// 实战中实际运用 使用{} 是空对象 合并用户传参和默认参数
// 合并配置项，要求配置项key: value value 是简单数据类型
// Options 是传入的对象
function createUser(options = {}) {
  const defaults = { name: "Tom", age: 18, isAdmin: false };
  const config = Object.assign({}, defaults, options);
  console.log(config);
}

createUser({ name: "Jerry", age: 20, king: true });

const baseConfig = {
  api: "/api",
  timeout: 5000,
};
const envConfig = {
  timeout: 3000,
  debug: true,
};
// 实现合并网络请求相关的配置项
const finalConfig = Object.assign({}, baseConfig, envConfig);
