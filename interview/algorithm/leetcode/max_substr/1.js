/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let i = 0,
    j = 1;
  if (s.length < 2) return s.length;
  let res = 0;
  let st = new Set();
  while (i < s.length) {
    let curRes = 0;
    st.clear();
    for (let j = i; j < s.length; j++) {
      if (!st.has(s[j])) {
        curRes++;
        st.add(s[j]);
      } else {
        break;
      }
    }
    i++;
    res = Math.max(res, curRes);
  }
  return res;
};

module.exports = lengthOfLongestSubstring;
