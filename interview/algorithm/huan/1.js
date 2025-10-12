function hasCycle(head) {
  while (head) {
    if (head.flag) {
      return true;
    }
    head.flag = true;
    head = head.next;
  }
  return false;
}

// 导出函数供测试使用
module.exports = { hasCycle };
