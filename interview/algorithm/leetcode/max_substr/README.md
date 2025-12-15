# 无重复字符的最长子串

## 题目信息

**LeetCode 3. Longest Substring Without Repeating Characters**

- **难度**：中等 (Medium)
- **标签**：哈希表、字符串、滑动窗口、双指针
- **来源**：[LeetCode](https://leetcode.com/problems/longest-substring-without-repeating-characters/)

---

## 题目描述

给定一个字符串 `s`，请你找出其中不含有重复字符的**最长子串**的长度。

### 示例

**示例 1：**
```
输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

**示例 2：**
```
输入: s = "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

**示例 3：**
```
输入: s = "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

### 提示

- `0 <= s.length <= 5 * 10^4`
- `s` 由英文字母、数字、符号和空格组成

---

## 解题思路

### 核心思想

这道题的核心是**滑动窗口**（Sliding Window）技巧：

1. 使用两个指针 `left` 和 `right` 维护一个窗口
2. 窗口内始终保持无重复字符
3. 不断移动右指针扩大窗口，遇到重复字符时移动左指针收缩窗口
4. 记录过程中窗口的最大长度

### 算法演进

```
暴力解法 O(n²) → 滑动窗口 + Set O(n) → 滑动窗口 + Map 优化 O(n)
```

---

## 解法对比

| 解法 | 时间复杂度 | 空间复杂度 | 实现文件 | 推荐度 |
|------|------------|------------|----------|--------|
| **方法一**：暴力解法 + Set | O(n²) | O(n) | [1.js](1.js) | ⭐⭐ |
| **方法二**：滑动窗口 + Map | O(n) | O(n) | [2.js](2.js) | ⭐⭐⭐⭐⭐ |

---

## 方法一：暴力解法 + Set

### 思路

从每个位置 `i` 开始，尝试向右扩展找到最长的无重复子串。

### 代码实现

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let i = 0;
  if (s.length < 2) return s.length;
  let res = 0;
  let st = new Set();

  while (i < s.length) {
    let curRes = 0;
    st.clear();

    // 从位置 i 开始向右扩展
    for (let j = i; j < s.length; j++) {
      if (!st.has(s[j])) {
        curRes++;
        st.add(s[j]);
      } else {
        break; // 遇到重复字符，停止扩展
      }
    }

    i++;
    res = Math.max(res, curRes);
  }

  return res;
};
```

### 执行过程示例

以 `s = "abcabcbb"` 为例：

```
i=0: "abc" → 长度 3
i=1: "bca" → 长度 3
i=2: "cab" → 长度 3
i=3: "abc" → 长度 3
i=4: "bc" → 长度 2
i=5: "cb" → 长度 2
i=6: "b" → 长度 1
i=7: "b" → 长度 1

最大长度: 3
```

### 复杂度分析

- **时间复杂度**：O(n²)
  - 外层循环 O(n)
  - 内层循环最坏 O(n)
- **空间复杂度**：O(min(n, m))
  - m 为字符集大小
  - Set 最多存储 m 个字符

### 优缺点

✅ **优点**：
- 思路直观，易于理解
- 使用 Set 正确检测重复

❌ **缺点**：
- 存在大量重复计算
- 时间复杂度较高

---

## 方法二：滑动窗口 + Map 优化 ⭐ 推荐

### 思路

使用滑动窗口维护一个无重复字符的区间 `[left, right]`：

1. 右指针 `right` 不断向右移动，扩大窗口
2. 使用 `Map` 记录每个字符最后出现的位置
3. 当遇到重复字符时，将左指针 `left` 直接跳到重复字符的下一个位置
4. 持续更新最大窗口长度

### 图解算法

以 `s = "abcabcbb"` 为例：

```
初始状态: left=0, right=0, maxLen=0
map = {}

步骤 1: right=0, char='a'
窗口: [a]
map = {a:0}, maxLen=1

步骤 2: right=1, char='b'
窗口: [ab]
map = {a:0, b:1}, maxLen=2

步骤 3: right=2, char='c'
窗口: [abc]
map = {a:0, b:1, c:2}, maxLen=3

步骤 4: right=3, char='a' (重复!)
发现 'a' 在 map[a]=0 位置
left 跳到 0+1=1
窗口: [bca]
map = {a:3, b:1, c:2}, maxLen=3

步骤 5: right=4, char='b' (重复!)
发现 'b' 在 map[b]=1 位置
left 跳到 1+1=2
窗口: [cab]
map = {a:3, b:4, c:2}, maxLen=3

步骤 6: right=5, char='c' (重复!)
发现 'c' 在 map[c]=2 位置
left 跳到 2+1=3
窗口: [abc]
map = {a:3, b:4, c:5}, maxLen=3

步骤 7: right=6, char='b' (重复!)
发现 'b' 在 map[b]=4 位置
left 跳到 4+1=5
窗口: [cb]
map = {a:3, b:6, c:5}, maxLen=3

步骤 8: right=7, char='b' (重复!)
发现 'b' 在 map[b]=6 位置
left 跳到 6+1=7
窗口: [b]
map = {a:3, b:7, c:5}, maxLen=3

结果: maxLen = 3
```

### 代码实现

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let mp = new Map();      // 记录字符最后出现的位置
  let left = 0;            // 窗口左边界
  let MaxLen = 0;          // 最大窗口长度

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    // 如果字符已存在且在当前窗口内
    if (mp.has(char) && mp.get(char) >= left) {
      // 将左边界移到重复字符的下一个位置
      left = mp.get(char) + 1;
    }

    // 更新字符位置
    mp.set(char, right);

    // 更新最大长度
    MaxLen = Math.max(MaxLen, right - left + 1);
  }

  return MaxLen;
};
```

### 关键点说明

1. **为什么要检查 `mp.get(char) >= left`？**
   - 确保重复字符在当前窗口内
   - 避免左指针回退

   ```javascript
   // 例如: s = "abba"
   // 当 right=3, char='a' 时
   // map[a]=0, left=2
   // 因为 0 < 2，所以 'a' 不在当前窗口 [bb] 内
   // 左指针不需要移动
   ```

2. **窗口长度计算**
   ```javascript
   windowLength = right - left + 1
   // left=2, right=5 时
   // 窗口包含索引: 2,3,4,5 → 长度为 4
   ```

3. **为什么每次都更新 Map？**
   - 始终保持字符的最新位置
   - 便于后续判断是否在窗口内

### 复杂度分析

- **时间复杂度**：O(n)
  - 每个字符最多被访问 1 次
  - Map 的查询和更新都是 O(1)

- **空间复杂度**：O(min(n, m))
  - n：字符串长度
  - m：字符集大小
  - Map 最多存储 min(n, m) 个键值对

### 优缺点

✅ **优点**：
- 时间复杂度最优 O(n)
- 代码简洁优雅
- 一次遍历即可完成
- 左指针跳跃式移动，避免重复计算

❌ **缺点**：
- 需要额外空间存储 Map
- 对初学者理解略有难度

---

## 算法可视化

### 滑动窗口动态过程

```
s = "pwwkew"

Step 1: [p]wwkew        left=0, right=0, len=1
Step 2: [pw]wkew        left=0, right=1, len=2
Step 3: p[w]wkew        left=1, right=2, len=1 (遇到重复w)
Step 4: p[wk]ew         left=1, right=3, len=3
Step 5: pw[ke]w         left=2, right=4, len=3
Step 6: pww[kew]        left=3, right=5, len=3

最大长度: 3 (子串 "wke" 或 "kew")
```

---

## 测试用例

完整的测试用例见 [1.test.js](1.test.js)

### 基础测试

```javascript
lengthOfLongestSubstring("")         // 0
lengthOfLongestSubstring("a")        // 1
lengthOfLongestSubstring("ab")       // 2
lengthOfLongestSubstring("aa")       // 1
```

### LeetCode 官方用例

```javascript
lengthOfLongestSubstring("abcabcbb") // 3
lengthOfLongestSubstring("bbbbb")    // 1
lengthOfLongestSubstring("pwwkew")   // 3
```

### 边界用例

```javascript
lengthOfLongestSubstring("abcdef")   // 6 (全部不重复)
lengthOfLongestSubstring("dvdf")     // 3 (vdf)
lengthOfLongestSubstring(" ")        // 1 (空格也算字符)
lengthOfLongestSubstring("au")       // 2
```

### 运行测试

```bash
npm test
```

---

## 知识点总结

### 1. 滑动窗口模板

```javascript
function slidingWindow(s) {
  let left = 0;
  let result = 0;
  let window = new Map(); // 或 Set

  for (let right = 0; right < s.length; right++) {
    // 扩大窗口
    window.add(s[right]);

    // 收缩窗口（当不满足条件时）
    while (/* 窗口不合法 */) {
      window.remove(s[left]);
      left++;
    }

    // 更新结果
    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

### 2. 双指针技巧

- **快慢指针**：两个指针移动速度不同
- **左右指针**：一个从左、一个从右向中间移动
- **滑动窗口**：两个指针同向移动，维护一个区间

### 3. 哈希表应用

- **Set**：只关心元素是否存在
- **Map**：需要存储额外信息（如位置、频率）

### 4. 时间复杂度优化思路

```
暴力 O(n³) → 双层循环 O(n²) → 滑动窗口 O(n)
```

关键：**避免重复计算**，利用之前的结果

---

## 相关题目

### 滑动窗口系列

1. [LeetCode 76. 最小覆盖子串](https://leetcode.com/problems/minimum-window-substring/) - 困难
2. [LeetCode 159. 至多包含两个不同字符的最长子串](https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/) - 中等
3. [LeetCode 340. 至多包含 K 个不同字符的最长子串](https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/) - 中等
4. [LeetCode 424. 替换后的最长重复字符](https://leetcode.com/problems/longest-repeating-character-replacement/) - 中等
5. [LeetCode 567. 字符串的排列](https://leetcode.com/problems/permutation-in-string/) - 中等

### 字符串 + 哈希表

6. [LeetCode 438. 找到字符串中所有字母异位词](https://leetcode.com/problems/find-all-anagrams-in-a-string/) - 中等
7. [LeetCode 30. 串联所有单词的子串](https://leetcode.com/problems/substring-with-concatenation-of-all-words/) - 困难

---

## 总结

### 最优解法选择

对于本题，**推荐使用方法二（滑动窗口 + Map）**：

✅ 时间复杂度最优：O(n)
✅ 代码简洁优雅
✅ 面试高频考点
✅ 适用于类似问题

### 学习建议

1. **理解滑动窗口本质**：维护一个动态区间
2. **掌握模板代码**：可应用于多种题目
3. **注意边界条件**：空字符串、单字符等
4. **多写多练**：熟能生巧

### 进阶思考

**问题：如果要求返回最长子串本身（而不是长度），如何修改代码？**

<details>
<summary>点击查看答案</summary>

```javascript
var longestSubstring = function(s) {
  let mp = new Map();
  let left = 0;
  let maxLen = 0;
  let start = 0; // 记录最长子串的起始位置

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (mp.has(char) && mp.get(char) >= left) {
      left = mp.get(char) + 1;
    }

    mp.set(char, right);

    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      start = left; // 更新起始位置
    }
  }

  return s.substring(start, start + maxLen); // 返回子串
};
```
</details>

---

## 参考资料

- [LeetCode 官方题解](https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/)
- [滑动窗口算法详解](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-48c1d/wo-xie-le--f7a92/)
- 《代码随想录》滑动窗口专题

---

## 文件说明

- [1.js](1.js) - 方法一：暴力解法实现
- [2.js](2.js) - 方法二：滑动窗口优化实现（推荐）
- [1.test.js](1.test.js) - 完整测试用例
- [README.md](README.md) - 本题解文档

---

**最后更新时间**：2025-10-18
**作者**：Claude & HP
