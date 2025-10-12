### JS 删除 DOM 节点（remove）学习笔记

**核心目标**

- 了解删除列表项的几种写法及浏览器兼容性
- 掌握事件委托在动态列表中的优势与用法
- 熟悉 `Element.remove()`、`Node.removeChild()`、`Element.closest()`、`classList.contains()`

---

### 场景与示例

HTML 结构（简化）：

```html
<ul id="list">
  <li>A <button class="del">删除</button></li>
  <li>B <button class="del">删除</button></li>
  <!-- 可能后续还会动态新增 li -->
</ul>
```

委托到父级（推荐，适合动态节点）：

```js
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.classList.contains("del")) {
    const li = e.target.closest("li");
    if (li) li.remove(); // 现代浏览器
  }
});
```

逐个绑定到每个按钮（不推荐）：

```js
// 对每个 .del 分别 addEventListener，节点增删时还要重新绑定，开销大
document.querySelectorAll(".del").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    // li.remove(); // 现代方案
    li.parentNode && li.parentNode.removeChild(li); // 兼容旧浏览器
  });
});
```

---

### 为什么使用事件委托

- **性能**：父节点上只注册一次监听，无需对每个子项绑定事件。
- **动态性**：后续通过 JS 新增的 `li`/`button.del` 也能被同一个监听处理。
- **维护性**：逻辑集中在一个地方，避免重复代码。

实现要点：

- 用 `e.target` 判断是否为需要处理的元素（或其子元素）。
- 用 `classList.contains('del')` 做精确匹配，避免选择器误伤。
- 用 `closest('li')` 向上找到最近的 `li` 容器，避免 DOM 结构变化导致选择错误。

---

### API 速记

- `Element.remove()`：直接把当前元素从其父节点移除；现代浏览器支持好。
- `Node.removeChild(child)`：从父节点上移除 `child`，兼容性最佳；需要先拿到父节点。
- `Element.closest(selector)`：向上寻找最近匹配的祖先元素（含自身）。
- `classList.contains(cls)`：判断元素是否包含某个类名。

兼容性写法（保守）：

```js
const li = e.target.closest("li");
if (li) {
  if (li.remove) {
    li.remove();
  } else if (li.parentNode) {
    li.parentNode.removeChild(li);
  }
}
```

---

### 常见坑位

- **忘记使用委托**：对每个子元素反复绑定事件，导致性能浪费和维护困难。
- **错误使用 `parentNode`**：若点击的是 `button` 内部的图标等，`e.target.parentNode` 可能不是 `li`。
- **空父节点**：调用 `removeChild` 时必须确保存在 `parentNode`。
- **事件冒泡被阻断**：若中间层代码 `stopPropagation()`，委托可能收不到点击。

---

### 小结

- 动态列表删除优先使用：父级事件委托 + `closest('li')` + `remove()`。
- 兼容旧环境：降级到 `parentNode.removeChild(node)`。
- 委托使代码更简洁、健壮且易扩展。
