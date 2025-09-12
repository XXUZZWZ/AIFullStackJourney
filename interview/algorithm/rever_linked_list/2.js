function reverseListRecursive(head) {
  // 递归结束条件
  if (!head || !head.next) {
    return head;
  }
  // 递归调用 交给下一个
  const newHead = reverseListRecursive(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

/*
回溯与指针翻转（出栈阶段）
从 reverse(3) 返回到 reverse(2)
此时：head=2, head.next=3, newHead=3
执行：head.next.next = head → 3.next = 2
执行：head.next = null → 2.next = null
返回：newHead(=3)
链表局部变为：3 → 2 → null

从 reverse(2) 返回到 reverse(1)
此时：head=1, head.next=2, newHead=3
执行：head.next.next = head → 2.next = 1
执行：head.next = null → 1.next = null
返回：newHead(=3)
链表整体变为：3 → 2 → 1 → null
最终返回头结点：3
*/
