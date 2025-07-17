const undefined = require('undefined');

// 缺少 React 导入
function MyComponent() {
  return React.createElement('div', {}, 'Hello');
}

// 缺少 lodash 导入
const data = _.map([1, 2, 3], x => x * 2);

// 缺少 fs 导入
fs.readFile('test.txt', 'utf8', (err, data) => {
  console.log(data);
});
