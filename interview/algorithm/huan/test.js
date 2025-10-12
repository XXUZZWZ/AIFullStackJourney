// 测试用例 for 环形链表检测算法

// 导入 hasCycle 函数
const { hasCycle } = require('./2.js');

// 创建链表节点的辅助函数
function ListNode(val) {
  this.val = val;
  this.next = null;
}

// 测试用例 1: 无环链表
function testNoCycle() {
  console.log("测试用例 1: 无环链表");

  // 创建链表: 1 -> 2 -> 3 -> 4 -> 5
  const node1 = new ListNode(1);
  const node2 = new ListNode(2);
  const node3 = new ListNode(3);
  const node4 = new ListNode(4);
  const node5 = new ListNode(5);

  node1.next = node2;
  node2.next = node3;
  node3.next = node4;
  node4.next = node5;

  const result = hasCycle(node1);
  console.log(`预期: false, 实际: ${result}, 测试: ${result === false ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 2: 有环链表 (尾节点指向头节点)
function testCycleAtHead() {
  console.log("测试用例 2: 有环链表 (尾节点指向头节点)");

  // 创建链表: 1 -> 2 -> 3 -> 4 -> 5 -> 1 (环)
  const node1 = new ListNode(1);
  const node2 = new ListNode(2);
  const node3 = new ListNode(3);
  const node4 = new ListNode(4);
  const node5 = new ListNode(5);

  node1.next = node2;
  node2.next = node3;
  node3.next = node4;
  node4.next = node5;
  node5.next = node1; // 形成环

  const result = hasCycle(node1);
  console.log(`预期: true, 实际: ${result}, 测试: ${result === true ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 3: 有环链表 (中间节点形成环)
function testCycleInMiddle() {
  console.log("测试用例 3: 有环链表 (中间节点形成环)");

  // 创建链表: 1 -> 2 -> 3 -> 4 -> 5 -> 3 (环)
  const node1 = new ListNode(1);
  const node2 = new ListNode(2);
  const node3 = new ListNode(3);
  const node4 = new ListNode(4);
  const node5 = new ListNode(5);

  node1.next = node2;
  node2.next = node3;
  node3.next = node4;
  node4.next = node5;
  node5.next = node3; // 指向中间的节点3形成环

  const result = hasCycle(node1);
  console.log(`预期: true, 实际: ${result}, 测试: ${result === true ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 4: 单节点无环
function testSingleNodeNoCycle() {
  console.log("测试用例 4: 单节点无环");

  const node1 = new ListNode(1);

  const result = hasCycle(node1);
  console.log(`预期: false, 实际: ${result}, 测试: ${result === false ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 5: 单节点有环
function testSingleNodeCycle() {
  console.log("测试用例 5: 单节点有环");

  const node1 = new ListNode(1);
  node1.next = node1; // 指向自己形成环

  const result = hasCycle(node1);
  console.log(`预期: true, 实际: ${result}, 测试: ${result === true ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 6: 空链表
function testEmptyList() {
  console.log("测试用例 6: 空链表");

  const result = hasCycle(null);
  console.log(`预期: false, 实际: ${result}, 测试: ${result === false ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 7: 两个节点无环
function testTwoNodesNoCycle() {
  console.log("测试用例 7: 两个节点无环");

  const node1 = new ListNode(1);
  const node2 = new ListNode(2);
  node1.next = node2;

  const result = hasCycle(node1);
  console.log(`预期: false, 实际: ${result}, 测试: ${result === false ? '通过' : '失败'}`);
  console.log("---");
}

// 测试用例 8: 两个节点有环
function testTwoNodesCycle() {
  console.log("测试用例 8: 两个节点有环");

  const node1 = new ListNode(1);
  const node2 = new ListNode(2);
  node1.next = node2;
  node2.next = node1; // 互相指向形成环

  const result = hasCycle(node1);
  console.log(`预期: true, 实际: ${result}, 测试: ${result === true ? '通过' : '失败'}`);
  console.log("---");
}

// 运行所有测试用例
function runAllTests() {
  console.log("开始运行环形链表检测算法测试用例\n");

  testNoCycle();
  testCycleAtHead();
  testCycleInMiddle();
  testSingleNodeNoCycle();
  testSingleNodeCycle();
  testEmptyList();
  testTwoNodesNoCycle();
  testTwoNodesCycle();

  console.log("所有测试用例执行完成");
}

// 执行测试
runAllTests();