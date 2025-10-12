function sortColor(nums) {
  let left = 0;
  let right = nums.length - 1;
  let mid = 0;
  while (mid <= right) {
    if (nums[mid] === 0) {
      [nums[mid], nums[left]] = [nums[left], nums[mid]];
      mid++;
      left++;
    } else if (nums[mid] === 1) {
      mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[right]] = [nums[right], nums[mid]];
      mid++;
      right--;
    }
  }
  return nums;
}

console.log(sortColor([2, 0, 2, 1, 1, 0]));
