"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 用泛型一样去声明链表
// 数据结构 ADT
//支持泛型的节点 可以接收 value 类型的继承
class ListNode {
    value;
    next;
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}
class LinkedList {
    head = null;
    append(value) {
        const newListNode = new ListNode(value, null);
        if (!this.head) {
            this.head = newListNode;
        }
        else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newListNode;
        }
    }
}
const numberList = new LinkedList();
numberList.append(1);
const userList = new LinkedList();
userList.append({
    id: 1,
    name: '张三'
});
//# sourceMappingURL=2.js.map