// 解法一：哈希表法
function hasCycle1(head) {
    const visited = new Set();
    let current = head;

    while (current !== null) {
        if (visited.has(current)) {
            return true;
        }
        visited.add(current);
        current = current.next;
    }

    return false;
}

// 解法二：快慢指针法（Floyd判圈算法）
function hasCycle2(head) {
    if (!head || !head.next) {
        return false;
    }

    let slow = head;
    let fast = head.next;

    while (slow !== fast) {
        if (!fast || !fast.next) {
            return false;
        }
        slow = slow.next;
        fast = fast.next.next;
    }

    return true;
}

// 解法三：标记法
function hasCycle3(head) {
    while (head) {
        if (head.visited) {
            return true;
        }
        head.visited = true;
        head = head.next;
    }
    return false;
}

// 解法四：破坏链表法
function hasCycle4(head) {
    const MARKER = Symbol('marker');
    let current = head;

    while (current) {
        if (current.next === MARKER) {
            return true;
        }
        const temp = current.next;
        current.next = MARKER;
        current = temp;
    }

    return false;
}

// 解法五：递归标记法
function hasCycle5(head, visited = new Set()) {
    if (!head) {
        return false;
    }

    if (visited.has(head)) {
        return true;
    }

    visited.add(head);
    return hasCycle5(head.next, visited);
}

// 默认导出快慢指针法（最优解）
function hasCycle(head) {
    return hasCycle2(head);
}

// 导出所有解法供测试使用
module.exports = {
    hasCycle,
    hasCycle1, // 哈希表法
    hasCycle2, // 快慢指针法
    hasCycle3, // 标记法
    hasCycle4, // 破坏链表法
    hasCycle5  // 递归标记法
};
