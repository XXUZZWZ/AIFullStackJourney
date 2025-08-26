// Array.prototype.sort 深入讲解
// - 就地排序：会直接修改原数组（in-place），并返回同一个数组引用
// - 默认比较规则：若未提供 compareFn，则元素会先被转为字符串，再按 UTF-16 码点（字典序）比较
//   - 这导致数值数组默认排序往往不是我们期望的数值大小顺序（例如 10 会排在 2 前面）
// - compareFn(a, b) 规则：
//   - 返回 < 0：a 排在 b 前
//   - 返回 = 0：相对顺序保持（现代 JS 规范要求稳定排序：ES2019+）
//   - 返回 > 0：a 排在 b 后
//   - 返回值不必是 -1/0/1，任何负/零/正数皆可
// - 稳定性：ES2019 开始要求稳定排序（Modern V8/SpiderMonkey/JavaScriptCore 均已实现）。
// - 稀疏数组与 undefined：空槽和 undefined 会被排到末尾（在默认排序下）。
// - 性能提示：compareFn 应为纯函数且返回一致的结果；不一致的比较逻辑会导致未定义行为或性能问题。
// - 本地化字符串排序：对人类语言友好的排序使用 localeCompare，例如 arr.sort((a,b)=>a.localeCompare(b,'zh-Hans')).

let arr = [1, 8, 2];

// 1) 不传 compareFn：默认按字典序（字符串）排序
// - 每个元素会先 toString()，再按 UTF-16 码点比较
// - 注意：sort() 返回的引用与原数组相同（同一个对象），因此 arr.sort() === arr 为 true
console.log(arr.sort(), arr, arr.sort() === arr);

// 2) 提供数值升序的 compareFn
// - 经典写法：a - b
// - 若结果为负数，说明 a < b，a 应在前；为正数则相反；为 0 则保持相对顺序
// - 这是进行“数值排序”的正确方式
//   提示：不要使用 return a > b，因为这会返回布尔值（true/false），引擎会转成 1/0，虽常“看起来能用”，但不严谨
//  >=0 升序
console.log(arr.sort((a, b) => a - b));

// 3) 提供数值降序的 compareFn
// - 经典写法：b - a
//  <0 降序
console.log(arr.sort((a, b) => b - a));

// 4) 默认排序的一个典型“坑”：数值被当做字符串比较
// - 下面示例展示了默认排序如何先比较字符串的首字符，再比较第二个字符……
// - 因此 '10' 会排在 '2' 之前，因为 '1' < '2'
// 不传值的时候按按字典序 ascll 码来排序
// 先比较首位
console.log([10, 1, 20, 3, 5].sort());
// 打印 [ 1, 10, 20, 3, 5 ]

// 5) 更多边界与最佳实践说明（仅注释说明）：
// - 混合类型数组：默认排序会把不同类型都转成字符串比较，结果可能与预期不符。
// - NaN：比较函数应显式处理 NaN，否则 a - b 可能得到 NaN，导致比较逻辑异常。
// - 大对象与昂贵比较：将重计算/昂贵属性提取到外层，先生成键（decorate-sort-undecorate/Schwartzian transform）可提升性能：
//   const keyed = arr.map(x => ({ key: expensiveKey(x), value: x }))
//   keyed.sort((a,b)=>compare(a.key,b.key))
//   const result = keyed.map(k=>k.value)
// - 字符串自然排序（如 'item2' < 'item10'）：可用 Intl.Collator({numeric:true}) 或 localeCompare 的 numeric 选项：
//   const collator = new Intl.Collator('en', { numeric: true })
//   arr.sort((a,b)=>collator.compare(a,b))

console.log(arr.reverse(), arr, arr.reverse() === arr);

// es6推出的
console.log(arr.fill(0, 1, 3), arr);
// value start end
