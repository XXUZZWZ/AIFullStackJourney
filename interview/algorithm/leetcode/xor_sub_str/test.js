/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
  if (s.length < p.length) return [];
  const res = [];
  const need = new Array(26).fill(0);
  let window = new Array(26).fill(0);
  let matchCount = 0;
  let kindOfP = 0;

  for (let i = 0; i < p.length; i++) {
    need[p.charCodeAt(i) - 97]++;
  }
  for (let i = 0; i < p.length; i++) {
    window[s.charCodeAt(i) - 97]++;
  }
  for (let x of need) {
    if (x != 0) kindOfP++;
  }
  for (let i = 0; i < need.length; i++) {
    if (window[i] === need[i] && need[i] !== 0) matchCount++;
  }
  if (matchCount === kindOfP) {
    res.push(0);
  }
  for (let i = p.length; i < s.length; i++) {
    const rightChar = s.charCodeAt(i) - 97;

    if (window[rightChar] === need[rightChar] && need[rightChar] > 0)
      matchCount--;
    window[rightChar]++;
    if (window[rightChar] === need[rightChar] && need[rightChar] > 0)
      matchCount++;
    const leftChar = s.charCodeAt(i - p.length) - 97;

    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) matchCount--;
    window[leftChar]--;
    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) matchCount++;

    if (matchCount === kindOfP) {
      res.push(i - p.length + 1);
    }
  }
  return res;
};

// 测试函数
function runTests() {
  const tests = [
    {
      s: "cbaebabacd",
      p: "abc",
      expected: [0, 6],
      description: "示例1: 基本测试"
    },
    {
      s: "abab",
      p: "ab",
      expected: [0, 1, 2],
      description: "示例2: 重叠的异位词"
    },
    {
      s: "baa",
      p: "aa",
      expected: [1],
      description: "测试3: 重复字符"
    },
    {
      s: "abacbabc",
      p: "abc",
      expected: [1, 2, 3, 5],
      description: "测试4: 多个异位词"
    }
  ];

  console.log("开始测试...\n");

  tests.forEach((test, index) => {
    const result = findAnagrams(test.s, test.p);
    const passed = JSON.stringify(result) === JSON.stringify(test.expected);

    console.log(`测试 ${index + 1}: ${test.description}`);
    console.log(`  输入: s="${test.s}", p="${test.p}"`);
    console.log(`  预期: [${test.expected.join(', ')}]`);
    console.log(`  实际: [${result.join(', ')}]`);
    console.log(`  结果: ${passed ? '✓ 通过' : '✗ 失败'}`);
    console.log();
  });
}

// 详细追踪函数
function debugTrace(s, p) {
  console.log(`\n=== 详细追踪: s="${s}", p="${p}" ===\n`);

  if (s.length < p.length) return [];
  const res = [];
  const need = new Array(26).fill(0);
  let window = new Array(26).fill(0);
  let matchCount = 0;
  let kindOfP = 0;

  for (let i = 0; i < p.length; i++) {
    need[p.charCodeAt(i) - 97]++;
  }
  for (let i = 0; i < p.length; i++) {
    window[s.charCodeAt(i) - 97]++;
  }
  for (let x of need) {
    if (x != 0) kindOfP++;
  }
  for (let i = 0; i < need.length; i++) {
    if (window[i] === need[i] && need[i] !== 0) matchCount++;
  }

  console.log(`初始窗口: "${s.substring(0, p.length)}"`);
  console.log(`kindOfP: ${kindOfP}, matchCount: ${matchCount}`);

  if (matchCount === kindOfP) {
    res.push(0);
    console.log(`✓ 索引 0 匹配\n`);
  } else {
    console.log(`✗ 索引 0 不匹配\n`);
  }

  for (let i = p.length; i < s.length; i++) {
    const windowStart = i - p.length + 1;
    const windowStr = s.substring(windowStart, i + 1);

    console.log(`--- 滑动到索引 ${windowStart}, 窗口: "${windowStr}" ---`);

    const rightChar = s.charCodeAt(i) - 97;
    const rightCharStr = s[i];
    const leftChar = s.charCodeAt(i - p.length) - 97;
    const leftCharStr = s[i - p.length];

    console.log(`  加入: '${rightCharStr}', 移除: '${leftCharStr}'`);
    console.log(`  操作前 matchCount: ${matchCount}`);

    // 加入右边字符
    if (window[rightChar] === need[rightChar] && need[rightChar] > 0) {
      matchCount--;
      console.log(`    加入'${rightCharStr}'前: window=${window[rightChar]}, need=${need[rightChar]}, matchCount-- → ${matchCount}`);
    }
    window[rightChar]++;
    if (window[rightChar] === need[rightChar] && need[rightChar] > 0) {
      matchCount++;
      console.log(`    加入'${rightCharStr}'后: window=${window[rightChar]}, need=${need[rightChar]}, matchCount++ → ${matchCount}`);
    }

    // 移除左边字符
    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) {
      matchCount--;
      console.log(`    移除'${leftCharStr}'前: window=${window[leftChar]}, need=${need[leftChar]}, matchCount-- → ${matchCount}`);
    }
    window[leftChar]--;
    if (window[leftChar] === need[leftChar] && need[leftChar] > 0) {
      matchCount++;
      console.log(`    移除'${leftCharStr}'后: window=${window[leftChar]}, need=${need[leftChar]}, matchCount++ → ${matchCount}`);
    }

    console.log(`  操作后 matchCount: ${matchCount}`);

    if (matchCount === kindOfP) {
      res.push(i - p.length + 1);
      console.log(`  ✓ 匹配！添加索引 ${i - p.length + 1}\n`);
    } else {
      console.log(`  ✗ 不匹配 (matchCount=${matchCount}, kindOfP=${kindOfP})\n`);
    }
  }

  console.log(`最终结果: [${res.join(', ')}]\n`);
  return res;
}

// 运行测试
runTests();

// 运行详细追踪（针对失败的测试用例）
console.log("\n" + "=".repeat(60));
debugTrace("cbaebabacd", "abc");
