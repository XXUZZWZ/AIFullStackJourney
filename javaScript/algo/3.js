/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  const mp = new Map();
  let max = 0;
  for (let i = 0; i < s.length; i++) {
    if (!mp.get(s[i])) {
      mp.set(s[i], i);

      // console.log(mp);
    } else {
      i = mp.get(s[i]);
      // console.log(i);
      mp.clear();
      // mp.set(s[i], i);
    }
    max = Math.max(mp.size, max);
  }

  return max;
};

console.log(lengthOfLongestSubstring("dvdf"));
