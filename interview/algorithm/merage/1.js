function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  // 按第一项排序
  // Array.prototype.sort() 默认是快排 但是会根据浏览器实现不同，时间复杂度不同

  intervals.sort((a, b) => a[0] - b[0]); // 时间复杂度：O(n*log n)
  const merged = [intervals[0]];
  for (let i = 0; i < intervals.length; i++) {
    const currentInterval = intervals[i];
    const lastMeragedInterval = merged[merged.length - 1];
    if (currentInterval[0] <= lastMeragedInterval[1]) {
      lastMeragedInterval[1] = Math.max(
        lastMeragedInterval[1],
        currentInterval[1]
      );
    } else {
      merged.push(currentInterval);
    }
  }
  return merged;
}
