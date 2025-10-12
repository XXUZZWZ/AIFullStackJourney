class DequeTwoStacks {
  constructor() {
    this.left = []; // 代表左端
    this.right = []; // 代表右端
  }
  pushFront(x) {
    this.left.push(x);
  }
  pushBack(x) {
    this.right.push(x);
  }

  popFront() {
    if (!this.left.length) this.rebalanceToLeft();
    return this.left.pop();
  }
  popBack() {
    if (!this.right.length) this.rebalanceToRight();
    return this.right.pop();
  }
  rebalanceToLeft() {
    // 把 right 一半（或全部）倒到 left，保持均衡
    const half = Math.ceil(this.right.length / 2);
    const tmp = [];
    for (let i = 0; i < half; i++) tmp.push(this.right.pop());
    while (tmp.length) this.left.push(tmp.pop());
  }
  rebalanceToRight() {
    const half = Math.ceil(this.left.length / 2);
    const tmp = [];
    for (let i = 0; i < half; i++) tmp.push(this.left.pop());
    while (tmp.length) this.right.push(tmp.pop());
  }
}
