// Node.js 运行环境中，global 是顶级对象（类似于浏览器中的 window）
global.gc(); // 手动触发垃圾回收（需要启动时加上 --expose-gc 参数）

// 打印初始内存使用情况
console.log("初始内存使用情况:");
console.log(process.memoryUsage());
/*
内存单位说明：
- 1 字节(Byte) = 8 比特(bit)
- 1 KB = 1024 字节
- 1 MB = 1024 KB = 1,048,576 字节
- 1 GB = 1024 MB = 1,073,741,824 字节

返回对象说明：
{
  rss: 43761664,        // 43761664 字节 ≈ 41.7 MB (进程在物理内存中占用的空间)
  heapTotal: 5304320,   // 5304320 字节 ≈ 5.1 MB (V8引擎分配的堆内存总量)
  heapUsed: 3825640,    // 3825640 字节 ≈ 3.6 MB (实际使用的堆内存量)
  external: 1230932,    // 1230932 字节 ≈ 1.2 MB (V8管理的C++对象绑定到JS对象的内存)
  arrayBuffers: 10515   // 10515 字节 ≈ 10.3 KB (ArrayBuffer和SharedArrayBuffer实例的内存)
}
 */

// 创建一个新的 Map 对象（ES6 引入的数据结构，用于存储键值对）
let map = new Map();

// 创建一个包含 1000万个元素的数组（这会占用大量内存）
// 每个数组元素大约占用 8 字节（64位系统），所以这个数组大约占用：
// 10,000,000 * 8 = 80,000,000 字节 ≈ 76.3 MB
let key = new Array(10000000);

// 打印创建大数组后的内存使用情况
console.log("\n创建大数组后的内存使用情况:");
console.log(process.memoryUsage());

// 将大数组作为键添加到 Map 中
// 这会创建一个强引用，阻止垃圾回收器回收 key 数组
map.set(key, 1);

// 打印将大数组添加到 Map 后的内存使用情况
console.log("\n将大数组添加到 Map 后的内存使用情况:");
console.log(process.memoryUsage());

// 将 key 变量设置为 null，尝试释放对大数组的引用
// 但是由于 Map 中仍然持有对 key 的强引用，所以大数组不会被垃圾回收
key = null;

// 打印将 key 设置为 null 后的内存使用情况
console.log("\n将 key 设置为 null 后的内存使用情况:");
console.log(process.memoryUsage());

// 手动触发垃圾回收（需要启动时加上 --expose-gc 参数）
global.gc();

// 打印手动垃圾回收后的内存使用情况
console.log("\n手动垃圾回收后的内存使用情况:");
console.log(process.memoryUsage());

// 清空 Map，释放对大数组的引用
map.clear();

// 打印清空 Map 后的内存使用情况
console.log("\n清空 Map 后的内存使用情况:");
console.log(process.memoryUsage());

// 再次手动触发垃圾回收
global.gc();

// 打印最终的内存使用情况
console.log("\n最终内存使用情况:");
console.log(process.memoryUsage());
/*
内存管理对比分析：

1. Map 的强引用特性：
   - 当我们将大数组作为键添加到 Map 中时，Map 会持有对该数组的强引用
   - 即使我们将 key 变量设置为 null，大数组仍然不会被垃圾回收
   - 只有当 Map 被清空或删除对应条目时，大数组才能被垃圾回收

2. 与 WeakMap 的区别：
   - WeakMap 持有的是弱引用，不会阻止垃圾回收
   - 如果 WeakMap 的键没有其他强引用，垃圾回收器可以回收该键和对应的值
   - 这使得 WeakMap 特别适合用于缓存和避免内存泄漏

3. 实际应用场景：
   - Map：适用于需要长期保存键值对的场景
   - WeakMap：适用于临时缓存、事件监听器存储等场景，避免内存泄漏
*/

console.log("\n" + "=".repeat(50));
console.log("WeakMap 对比示例");
console.log("=".repeat(50));

// 创建另一个大数组用于 WeakMap 测试
let weakMapKey = new Array(10000000);

// 创建 WeakMap
let weakMap = new WeakMap();

// 打印创建 WeakMap 后的内存使用情况
console.log("\n创建 WeakMap 后的内存使用情况:");
console.log(process.memoryUsage());

// 将大数组作为键添加到 WeakMap 中
// WeakMap 持有的是弱引用，不会阻止垃圾回收
weakMap.set(weakMapKey, 1);

// 打印将大数组添加到 WeakMap 后的内存使用情况
console.log("\n将大数组添加到 WeakMap 后的内存使用情况:");
console.log(process.memoryUsage());

// 将 weakMapKey 变量设置为 null
// 由于 WeakMap 持有的是弱引用，大数组可以被垃圾回收
weakMapKey = null;

// 打印将 weakMapKey 设置为 null 后的内存使用情况
console.log("\n将 weakMapKey 设置为 null 后的内存使用情况:");
console.log(process.memoryUsage());

// 手动触发垃圾回收（需要启动时加上 --expose-gc 参数）
// global.gc();

// 打印手动垃圾回收后的内存使用情况
// 注意：WeakMap 中的条目可能已经被垃圾回收
console.log("\n手动垃圾回收后的内存使用情况:");
console.log(process.memoryUsage());

/*
WeakMap 与 Map 的关键区别：

1. 引用类型：
   - Map：强引用，阻止垃圾回收
   - WeakMap：弱引用，不阻止垃圾回收

2. 键的类型限制：
   - Map：可以使用任何值作为键
   - WeakMap：只能使用对象作为键（不能使用原始类型）

3. 可遍历性：
   - Map：可以遍历所有键值对
   - WeakMap：不可遍历，没有 size 属性

4. 垃圾回收行为：
   - Map：即使没有其他引用，Map 中的键值对也不会被回收
   - WeakMap：当键没有其他强引用时，键值对会被自动回收

5. 实际应用：
   - Map：缓存、数据存储
   - WeakMap：DOM 元素关联数据、私有属性存储、避免内存泄漏
*/
