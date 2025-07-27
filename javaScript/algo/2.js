/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
  if (!nums) return [];
  const result = [[nums[0]]];
  for (let i = 1; i < nums.length; i++) {
    n = nums[i];
    _update(n);
  }
  function _update(n) {
   
    for (let i = result.length - 1; i >= 0; i--) {
      const line = result[i];
      const end = line.at(-1);
      // console.log(n, end);
      if (n > end) {
        result[i+1] = [...line, n];
        // console.log(result);
        return;
      }
    
    }  
    result[0] = [n];
  }
  return result.at(-1).length;
};
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));