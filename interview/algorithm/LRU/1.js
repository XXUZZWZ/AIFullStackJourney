class ListNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    // 双向链表
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // hash表， O(1)查找节点
    this.head = new ListNode(null, null);
    this.tail = new ListNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  get(key) {
    if (!this.map.has(key)) {
      return -1;
    }
    const node = this.map.get(key);
    this.moveToHead(node);
    return node.value;
  }
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  addToTail(node) {
    const last = this.tail.prev;
    last.next = node;
    node.prev = last;
    node.next = this.tail;
    this.tail.prev = node;
  }
  moveToTail(node) {
    this.removeNode(node);
    this.addToTail(node);
  }
  put(key, value) {
    // capacity
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.moveToTail(node);
    } else {
      const newNode = new ListNode(key, value);
      this.map.set(key, newNode);
      this.addToTail(newNode);
    }
    if (this.map.size > this.capacity) {
      const oldest = this.head.next;
      this.removeNode(oldest);
      this.map.delete(oldest.key);
    }
  }
}
