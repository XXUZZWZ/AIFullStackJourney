function myObjectAssign(target, ...sources) {
  // 1. 检查目标对象是否为 null 或 undefined
  if (target == null) {
    throw new TypeError("Cannot convert undefined or null to object");
  }

  // 2. 将目标对象转换为对象（处理原始值）
  const to = Object(target);

  for (const source of sources) {
    // 3. 跳过 null 或 undefined 的源对象
    if (source == null) continue;

    // 4. 获取源对象的所有自有属性（字符串键 + Symbol键）
    const keys = [
      ...Object.getOwnPropertyNames(source),
      ...Object.getOwnPropertySymbols(source),
    ];

    for (const key of keys) {
      // 5. 检查属性是否可枚举
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        // 6. 执行赋值操作
        to[key] = source[key];
      }
    }
  }

  return to;
}
