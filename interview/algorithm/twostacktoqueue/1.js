class Queue {
  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }
  push(value) {
    this.stack1.push(value);
  }
  pop() {
    if (!this.stack2.length) {
      while (this.stack1.length) {
        this.stack2.push(this.stack1.pop());
      }
    }
    return this.stack2.pop();
  }
}
