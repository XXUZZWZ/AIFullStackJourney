const lengthOfLongestSubstring = require("./2");

describe("lengthOfLongestSubstring", () => {
  describe("基础测试用例", () => {
    test("空字符串应该返回0", () => {
      expect(lengthOfLongestSubstring("")).toBe(0);
    });

    test("单个字符应该返回1", () => {
      expect(lengthOfLongestSubstring("a")).toBe(1);
    });

    test("两个不同字符应该返回2", () => {
      expect(lengthOfLongestSubstring("ab")).toBe(2);
    });

    test("两个相同字符应该返回1", () => {
      expect(lengthOfLongestSubstring("aa")).toBe(1);
    });
  });

  describe("LeetCode官方示例", () => {
    test('示例1: "abcabcbb" 应该返回3', () => {
      expect(lengthOfLongestSubstring("abcabcbb")).toBe(3);
      // 最长无重复子串是 "abc"
    });

    test('示例2: "bbbbb" 应该返回1', () => {
      expect(lengthOfLongestSubstring("bbbbb")).toBe(1);
      // 最长无重复子串是 "b"
    });

    test('示例3: "pwwkew" 应该返回3', () => {
      expect(lengthOfLongestSubstring("pwwkew")).toBe(3);
      // 最长无重复子串是 "wke"
    });
  });

  describe("边界情况", () => {
    test("所有字符都不同", () => {
      expect(lengthOfLongestSubstring("abcdef")).toBe(6);
    });

    test("包含空格的字符串", () => {
      expect(lengthOfLongestSubstring("a b c")).toBe(3);
      // "a b" 或 " b c" 都是长度3的无重复子串
    });

    test("特殊字符", () => {
      expect(lengthOfLongestSubstring("!@#$%")).toBe(5);
    });

    test("重复字符在中间", () => {
      expect(lengthOfLongestSubstring("abba")).toBe(2);
      // "ab" 或 "ba"
    });

    test("较长的字符串", () => {
      expect(lengthOfLongestSubstring("dvdf")).toBe(3);
      // "vdf"
    });

    test("数字字符串", () => {
      expect(lengthOfLongestSubstring("0123456789")).toBe(10);
    });
  });

  describe("额外测试用例", () => {
    test("字符串末尾有重复", () => {
      expect(lengthOfLongestSubstring("abcdd")).toBe(4);
      // "abcd"
    });

    test("混合大小写", () => {
      expect(lengthOfLongestSubstring("aAbBcC")).toBe(6);
      // 大小写视为不同字符
    });
  });
});
