// 用泛型一样去声明链表
// 数据结构 ADT
//支持泛型的节点 可以接收 value 类型的继承
class ListNode<T> {       
  value: T;
  next: ListNode<T> | null;
  constructor(value:T,next:ListNode<T> | null){
    this.value = value;
    this.next = next;
  }
}

class LinkedList<T>{
  head:ListNode<T> | null = null;
  append(value:T):void{
    const newListNode = new ListNode<T>(value,null)
    if(!this.head){
      this.head = newListNode;
    }else{
      let current = this.head;
      while(current.next){
        current = current.next;
      }
      current.next = newListNode;
    }
  }
}

const numberList = new LinkedList<number>();

numberList.append(1);

interface User{
  id:number;
  name:string;
}

const userList = new LinkedList<User>();

userList.append({
  id:1,
  name:'张三'
})