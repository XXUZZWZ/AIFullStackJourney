## 设计一个支持以下两种操作的数据结构 void addWord (word)

- bool search(word) search (word) 可以搜索为文字和正则表达字符串 字符串种·只包含字母
- 题目 题意概述
  设计一个数据结构，支持：
  addWord(word): 插入一个由小写字母组成的单词
  search(word): 搜索单词，word 可包含字母和通配符.，其中.可匹配任意一个字母
  这就是经典的“添加与搜索单词 - 数据结构设计”（类似 LeetCode 211）

- 面试常考 HashMap 就叫字典
- 索引式思维 根据 word.lenth 优化查询
  - 将相同的长度的 word 放到同一个数组里面
  - includes
  - new RegExp + some
