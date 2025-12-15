/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let mp = new Map();
  let left = 0;
  let MaxLen = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (mp.has(char) && mp.get(char) >= left) {
      left = mp.get(char) + 1;
    }
    mp.set(char, right);
    MaxLen = Math.max(MaxLen, right - left +1);
  }
  return MaxLen;
};

module.exports = lengthOfLongestSubstring;
