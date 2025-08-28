// 正则基础示例：参数(修饰符/flags) 与常用方法返回值
// 目标：从文本中匹配中国大陆手机号(简单示例，不做完整校验)
const str = "我的手机号 13888888888 ，有空打给我。另一个号是 19912345678";

// 一、正则的两种创建方式
// 1) 字面量：/pattern/flags
// 2) 构造函数：new RegExp(pattern, flags)
const regLiteral = /1[3-9]\d{9}/g; // g 为全局匹配
const regCtor = new RegExp("1[3-9]\\d{9}", "gu"); // 等价模式，附加 u(Unicode) 标志

// 常见 flags(参数/修饰符)：
// g: 全局匹配(global)
// i: 忽略大小写(ignoreCase)
// m: 多行模式(multiline)，^ 和 $ 可匹配行首/行尾
// s: dotAll，使 . 可以匹配换行符
// u: Unicode 模式，启用 Unicode 感知
// y: sticky(粘连)模式，从 lastIndex 处开始匹配且不回退

// 二、RegExp 与 String 上与正则相关的方法及返回值
// 1) reg.test(str): 返回 boolean，表示是否匹配到
const hasMobile = regLiteral.test(str); // true 或 false

// 2) reg.exec(str): 返回一个匹配结果的数组或 null
//    - 数组[0]是整体匹配，后续是分组；附带 index、input 等属性
const firstExec = regLiteral.exec(str); // 例如：["13888888888", index: 6, input: str, ...] 或 null

// 注意：带 g 或 y 标志时，exec 会使用并推进 reg.lastIndex，便于多次迭代匹配
regLiteral.lastIndex = 0; // 可手动重置
let execAll = [];
let m;
while ((m = regLiteral.exec(str)) !== null) {
  execAll.push(m[0]);
}
// execAll: 所有匹配到的手机号字符串数组

// 3) str.match(reg):
//    - 无 g 标志：返回类似 exec 的“单次匹配详情数组”或 null
//    - 有 g 标志：返回“所有匹配项组成的数组”或 null（不含分组详情）
const matchNoG = str.match(/1[3-9]\d{9}/); // 单个匹配详情数组或 null
const matchWithG = str.match(/1[3-9]\d{9}/g); // ["13888888888", "19912345678"] 或 null

// 4) str.matchAll(reg): 返回一个可迭代器(Iterator)，每个条目是“匹配详情数组”
//    - 必须使用 g 标志
const allMatches = Array.from(str.matchAll(/1[3-9](\d{9})/g));
// allMatches 中的每一项形如：["13888888888", "888888888"(分组1), index, input, groups]

// 5) str.search(reg): 返回首个匹配的起始下标，未找到返回 -1
const firstIndex = str.search(/1[3-9]\d{9}/);

// 6) str.replace(reg, replacement): 返回替换后的新字符串
//    - replacement 可为字符串或回调函数
const maskedOnce = str.replace(
  /1[3-9](\d{2})(\d{4})(\d{4})/,
  (m, a, b, c) => `1${a}****${c}`
);

// 7) str.replaceAll(regOrStr, replacement): 全部替换，返回新字符串
const maskAllDigits = str.replaceAll(/\d/g, "*");

// 8) str.split(reg): 使用正则分割字符串，返回数组
const parts = str.split(/\s+/); // 以空白分割

// 9) 粘连 y 示例：从指定位置开始匹配且不回退
const sticky = /\d+/y;
sticky.lastIndex = str.indexOf("199");
const stickyExec = sticky.exec(str); // 若正好从 lastIndex 开始是数字，则返回匹配，否则返回 null

// 为便于在控制台观察，可自行打印：
console.log({
  hasMobile,
  firstExec,
  execAll,
  matchNoG,
  matchWithG,
  allMatches,
  firstIndex,
  maskedOnce,
  maskAllDigits,
  parts,
  stickyExec,
  regCtor,
});

const str2 = "iiiiiiii13888888888iiiii";

console.log(str2.match(/1[3-9]\d{9}/g));

const str3 = "{name},你不知道";

// str3.replace(/\{name\}/, "卢的高傲");
console.log(str3.replace(/\{name\}/, "卢的高傲"));