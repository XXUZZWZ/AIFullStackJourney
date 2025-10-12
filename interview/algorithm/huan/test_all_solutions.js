// 测试所有环形链表检测算法

// 导入所有解法
const {
    hasCycle,
    hasCycle1,
    hasCycle2,
    hasCycle3,
    hasCycle4,
    hasCycle5
} = require('./2.js');

// 创建链表节点的辅助函数
function ListNode(val) {
    this.val = val;
    this.next = null;
}

// 测试用例
const testCases = [
    {
        name: "无环链表",
        createList: () => {
            const node1 = new ListNode(1);
            const node2 = new ListNode(2);
            const node3 = new ListNode(3);
            const node4 = new ListNode(4);
            const node5 = new ListNode(5);
            node1.next = node2;
            node2.next = node3;
            node3.next = node4;
            node4.next = node5;
            return node1;
        },
        expected: false
    },
    {
        name: "有环链表（尾节点指向头节点）",
        createList: () => {
            const node1 = new ListNode(1);
            const node2 = new ListNode(2);
            const node3 = new ListNode(3);
            const node4 = new ListNode(4);
            const node5 = new ListNode(5);
            node1.next = node2;
            node2.next = node3;
            node3.next = node4;
            node4.next = node5;
            node5.next = node1;
            return node1;
        },
        expected: true
    },
    {
        name: "有环链表（中间节点形成环）",
        createList: () => {
            const node1 = new ListNode(1);
            const node2 = new ListNode(2);
            const node3 = new ListNode(3);
            const node4 = new ListNode(4);
            const node5 = new ListNode(5);
            node1.next = node2;
            node2.next = node3;
            node3.next = node4;
            node4.next = node5;
            node5.next = node3;
            return node1;
        },
        expected: true
    },
    {
        name: "单节点无环",
        createList: () => new ListNode(1),
        expected: false
    },
    {
        name: "单节点有环",
        createList: () => {
            const node1 = new ListNode(1);
            node1.next = node1;
            return node1;
        },
        expected: true
    },
    {
        name: "空链表",
        createList: () => null,
        expected: false
    },
    {
        name: "两个节点无环",
        createList: () => {
            const node1 = new ListNode(1);
            const node2 = new ListNode(2);
            node1.next = node2;
            return node1;
        },
        expected: false
    },
    {
        name: "两个节点有环",
        createList: () => {
            const node1 = new ListNode(1);
            const node2 = new ListNode(2);
            node1.next = node2;
            node2.next = node1;
            return node1;
        },
        expected: true
    }
];

// 解法列表
const solutions = [
    { name: "哈希表法", fn: hasCycle1 },
    { name: "快慢指针法", fn: hasCycle2 },
    { name: "标记法", fn: hasCycle3 },
    { name: "破坏链表法", fn: hasCycle4 },
    { name: "递归标记法", fn: hasCycle5 }
];

// 运行测试
function runTests() {
    console.log("开始测试所有环形链表检测算法\n");

    let totalTests = 0;
    let passedTests = 0;

    for (const solution of solutions) {
        console.log(`=== ${solution.name} ===`);
        let solutionPassed = 0;

        for (const testCase of testCases) {
            // 为每个测试用例创建新的链表（避免解法间相互影响）
            const head = testCase.createList();
            const result = solution.fn(head);
            const passed = result === testCase.expected;

            console.log(`  ${testCase.name}: 预期 ${testCase.expected}, 实际 ${result}, ${passed ? '✓ 通过' : '✗ 失败'}`);

            if (passed) {
                solutionPassed++;
                passedTests++;
            }
            totalTests++;
        }

        console.log(`  通过率: ${solutionPassed}/${testCases.length}\n`);
    }

    console.log(`=== 总体统计 ===`);
    console.log(`总测试用例: ${totalTests}`);
    console.log(`通过测试用例: ${passedTests}`);
    console.log(`总体通过率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
}

// 性能测试
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 创建大型测试用例
    const largeList = new ListNode(1);
    let current = largeList;
    for (let i = 2; i <= 10000; i++) {
        current.next = new ListNode(i);
        current = current.next;
    }
    // 创建环
    current.next = largeList;

    for (const solution of solutions) {
        const start = process.hrtime.bigint();
        const result = solution.fn(largeList);
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000; // 转换为毫秒

        console.log(`${solution.name}: ${duration.toFixed(3)}ms, 结果: ${result}`);
    }
}

// 执行测试
runTests();
performanceTest();