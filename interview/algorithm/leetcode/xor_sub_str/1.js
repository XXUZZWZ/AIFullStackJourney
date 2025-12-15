/*
题目
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

 

示例 1:

输入: s = "cbaebabacd", p = "abc"
输出: [0,6]
解释:
起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 示例 2:

输入: s = "abab", p = "ab"
输出: [0,1,2]
解释:
起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
 

提示:

1 <= s.length, p.length <= 3 * 104
s 和 p 仅包含小写字母
*/

/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  if (s.length < p.length) return [];
  const res = [];
  const need = new Array(26).fill(0);
  let window = new Array(26).fill(0);
  let matchCount = 0;
  let kindOfP = 0;

  for (let i = 0; i < p.length; i++) {
    need[p.charCodeAt(i) - 97]++;
  }
  for (let i = 0; i < p.length; i++) {
    window[s.charCodeAt(i) - 97]++;
  }
  for (let x of need) {
    if (x != 0) kindOfP++;
  }
  for (let i = 0; i < need.length; i++) {
    if (window[i] === need[i] && need[i] !== 0) matchCount++;
  }
  if (matchCount === kindOfP) {
    res.push(0);
  }
  for (let i = p.length; i < s.length; i++) {
    const rightChar = s.charCodeAt(i) - 97;

    if (window[rightChar] === need[rightChar] && need[rightChar] > 0)
      matchCount--;
    window[rightChar]++;
    if (window[rightChar] === need[rightChar] && need[rightChar] > 0)
      matchCount++;
    const leftChar = s.charCodeAt(i - p.length) - 97;

    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) matchCount--;
    window[leftChar]--;
    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) matchCount++;

    if (matchCount === kindOfP) {
      res.push(i - p.length + 1);
    }
  }
  return res;
};
