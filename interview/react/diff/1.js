// --------------------------------------------
// --------------------------------------------
// 注释：示例旧树 oldTree
// 作用：用来与 newTree 做对比，生成补丁 patches
// 结构：type 表示标签类型，props 表示属性，children 表示子节点数组
//       子节点既可以是字符串（文本节点），也可以是对象（元素节点）
// --------------------------------------------
const oldTree = {
  type: "div",
  props: { id: "root" },
  children: [
    {
      type: "h1",
      props: { key: "title" },
      children: ["Hello"],
    },
    {
      type: "p",
      props: { key: "desc" },
      children: ["Old Text"],
    },
  ],
};

// --------------------------------------------
// --------------------------------------------
// 注释：示例新树 newTree
// 作用：目标树，期望通过补丁把 oldTree 变成 newTree
// --------------------------------------------
const newTree = {
  type: "div",
  props: { id: "root" },
  children: [
    {
      type: "h1",
      props: { key: "title" },
      children: ["Hello World"],
    },
    {
      type: "span",
      props: { key: "extra" },
      children: ["New Node"],
    },
  ],
};

// --------------------------------------------
// --------------------------------------------
// 注释：理想中的补丁结构（旧示意，不参与运行）
// 说明：真实补丁在下方由 diff 函数生成，结构更统一（见 TEXT/PROPS/REPLACE/REMOVE）
// --------------------------------------------
// const patches = [
//   {"type":"text",oldTree,"content":"Hello World"},
//   {"type":"remove",oldTree.children[1]},
//   {"type":"add",newTree.children[1]},
// ]

// --------------------------------------------
// --------------------------------------------
// 注释：diff(oldNode, newNode, patches, path)
// 作用：比较旧节点与新节点，生成一组可应用的补丁（patches）。
// 参数：
//  - oldNode：旧树的某个节点（对象或字符串）
//  - newNode：新树的对应节点（对象或字符串）
//  - patches：补丁数组（收集输出），默认空数组
//  - path：从根到当前节点的索引路径（例如 [1,0] 表示 root.children[1].children[0]）
// 说明：
//  - path 的存在使补丁能够被序列化与精确定位，而不依赖对象引用。
// --------------------------------------------
function diff(oldNode, newNode, patches = [], path = []) {
  // --------------------------------------------
  // 注释：删除分支（新节点为空）
  // 说明：若 newNode == null，意味着需要把旧节点移除
  // 生成：{ type: 'REMOVE', path }
  // --------------------------------------------
  if (newNode == null) {
    patches.push({ type: "REMOVE", path });
    return patches;
  }

  // --------------------------------------------
  // 注释：类型判定（文本 or 元素）
  // 说明：用于后续判断是替换、文本更新还是深入比较 props/children
  // --------------------------------------------
  const oldIsText = typeof oldNode === "string";
  const newIsText = typeof newNode === "string";

  // --------------------------------------------
  // 注释：新增或类型替换
  // 情况：
  //  - oldNode 为空：新增
  //  - 文本/元素类型不一致：替换
  //  - 都是元素但 type 不同：替换
  // 生成：{ type: 'REPLACE', path, node: newNode }
  // --------------------------------------------
  if (
    oldNode == null ||
    oldIsText !== newIsText ||
    (!oldIsText && !newIsText && oldNode.type !== newNode.type)
  ) {
    patches.push({ type: "REPLACE", path, node: newNode });
    return patches;
  }

  // --------------------------------------------
  // 注释：文本更新
  // 情况：old/new 都是字符串，且内容不同
  // 生成：{ type: 'TEXT', path, content: newText }
  // --------------------------------------------
  if (oldIsText && newIsText) {
    if (oldNode !== newNode) {
      patches.push({ type: "TEXT", path, content: newNode });
    }
    return patches;
  }

  // --------------------------------------------
  // 注释：props 比较
  // 思路：把 oldProps 与 newProps 合并取键集，逐个比较值是否变化
  // 生成：{ type: 'PROPS', path, props: [{ key, value }, ...] }
  //       当 value 为 undefined 时等价于删除该 prop
  // --------------------------------------------
  const propPatches = [];
  const oldProps = oldNode.props || {};
  const newProps = newNode.props || {};
  const allProps = { ...oldProps, ...newProps };
  for (const key in allProps) {
    const oldVal = oldProps[key];
    const newVal = newProps[key];
    if (oldVal !== newVal) {
      propPatches.push({ key, value: newVal });
    }
  }
  if (propPatches.length) {
    patches.push({ type: "PROPS", path, props: propPatches });
  }

  // --------------------------------------------
  // 注释：children 比较（含 key 复用）
  // 思路：
  //  1) 为旧 children 建立 key -> index 的映射，便于根据新节点的 key 找到旧位置
  //  2) 按新 children 顺序遍历，确定应该对比的旧节点索引 idx
  //  3) 递归调用 diff(oldChild, newChild, ..., path.concat(idx))
  //  4) 若旧 children 更长，多出的尾部全部生成 REMOVE 补丁
  // --------------------------------------------
  const oldChildren = oldNode.children || [];
  const newChildren = newNode.children || [];

  const oldKeyIndex = {};
  for (let i = 0; i < oldChildren.length; i++) {
    const child = oldChildren[i];
    if (child && typeof child === "object") {
      const k = child.props && child.props.key;
      if (k != null) oldKeyIndex[k] = i;
    }
  }

  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    let oldChild = oldChildren[i];
    let idx = i;

    const newKey =
      newChild && typeof newChild === "object"
        ? newChild.props && newChild.props.key
        : undefined;
    if (newKey != null && newKey in oldKeyIndex) {
      idx = oldKeyIndex[newKey];
      oldChild = oldChildren[idx];
    }

    diff(oldChild, newChild, patches, path.concat(idx));
  }

  if (oldChildren.length > newChildren.length) {
    for (let j = newChildren.length; j < oldChildren.length; j++) {
      patches.push({ type: "REMOVE", path: path.concat(j) });
    }
  }

  return patches;
}

// --------------------------------------------
// --------------------------------------------
// 注释：示例——生成并打印补丁
// 说明：调用 diff(oldTree, newTree) 得到 patches，并打印出结果
// --------------------------------------------
const patches = diff(oldTree, newTree);
console.log(patches);

// --------------------------------------------
// --------------------------------------------
// 注释：getParentAndIndexByPath(root, path)
// 作用：根据路径找到对应的父节点与末端索引，便于对 parent.children[index] 做替换/删除/更新
// 返回：{ parent, index, node }，其中 node 是 parent.children[index]
// 特例：path 为空表示根节点，此时 parent 为 null，node 为 root
// --------------------------------------------
function getParentAndIndexByPath(root, path) {
  if (!Array.isArray(path) || path.length === 0) {
    return { parent: null, index: null, node: root };
  }
  let parent = root;
  for (let i = 0; i < path.length - 1; i++) {
    const idx = path[i];
    const next = parent && parent.children ? parent.children[idx] : undefined;
    parent = next;
  }
  const index = path[path.length - 1];
  const node = parent && parent.children ? parent.children[index] : undefined;
  return { parent, index, node };
}

// --------------------------------------------
// --------------------------------------------
// 注释：applyPatches(root, patches)
// 作用：把 diff 生成的补丁应用到一棵树上，返回更新后的新树
// 说明：
//  - 这里为演示易读，做了浅层克隆（cloneNode），避免直接修改输入 root
//  - 仅实现 TEXT/PROPS/REPLACE/REMOVE 四种最小语义
//  - 真实 DOM 环境中会把这些补丁翻译为具体的 DOM API 操作
// --------------------------------------------
function applyPatches(root, patches) {
  // 为简洁起见，这里做一个递归克隆，仅克隆到 children 层级
  const cloneNode = (n) => {
    if (typeof n === "string") return n;
    return {
      type: n.type,
      props: n.props ? { ...n.props } : undefined,
      children: n.children ? n.children.map(cloneNode) : [],
    };
  };

  const tree = cloneNode(root);

  for (const p of patches) {
    const { type, path, node, content, props } = p;
    // --------------------------------------------
    // 注释：TEXT 补丁
    // 效果：把目标位置的子节点替换为新的文本 content
    // --------------------------------------------
    if (type === "TEXT") {
      const { parent, index } = getParentAndIndexByPath(tree, path);
      if (parent && Array.isArray(parent.children)) {
        parent.children[index] = content;
      }
      // --------------------------------------------
      // 注释：PROPS 补丁
      // 效果：在目标节点上按键值对写入 props；值为 undefined 时表示删除该属性
      // --------------------------------------------
    } else if (type === "PROPS") {
      const { node } = getParentAndIndexByPath(tree, path);
      if (node && typeof node === "object") {
        node.props = node.props || {};
        for (const kv of props) {
          if (kv.value === undefined) delete node.props[kv.key];
          else node.props[kv.key] = kv.value;
        }
      }
      // --------------------------------------------
      // 注释：REPLACE 补丁
      // 效果：用 node 直接替换目标位置；若 path 为空则替换根
      // --------------------------------------------
    } else if (type === "REPLACE") {
      const { parent, index } = getParentAndIndexByPath(tree, path);
      if (parent === null) {
        // 替换根
        return node;
      }
      if (parent && Array.isArray(parent.children)) {
        parent.children[index] = cloneNode(node);
      }
      // --------------------------------------------
      // 注释：REMOVE 补丁
      // 效果：从父节点的 children 中移除该位置的子节点
      // --------------------------------------------
    } else if (type === "REMOVE") {
      const { parent, index } = getParentAndIndexByPath(tree, path);
      if (parent && Array.isArray(parent.children)) {
        parent.children.splice(index, 1);
      }
    }
  }

  return tree;
}

// --------------------------------------------
// --------------------------------------------
// 注释：演示——应用补丁并打印更新后的树
// 说明：
//  - 将 patches 应用于 oldTree 得到 updatedTree
//  - 打印结构以观察变更是否符合期望（与 newTree 对比）
// --------------------------------------------
const updatedTree = applyPatches(oldTree, patches);
console.log(JSON.stringify(updatedTree, null, 2));
