/**
 * 版本比较算法测试用例
 */

// 引入版本比较函数
const { compareVersion, VersionComparator } = require("./version-compare.js");

/**
 * 测试函数
 */
function runTests() {
  console.log("🚀 开始版本比较算法测试...\n");

  const tests = [
    // 基本版本比较
    {
      name: "基本版本比较",
      tests: [
        { v1: "1.0.0", v2: "1.0.1", expected: -1, desc: "1.0.0 < 1.0.1" },
        { v1: "1.0.1", v2: "1.0.0", expected: 1, desc: "1.0.1 > 1.0.0" },
        { v1: "1.0.0", v2: "1.0.0", expected: 0, desc: "1.0.0 = 1.0.0" },
        { v1: "0.1.2", v2: "0.1.3", expected: -1, desc: "0.1.2 < 0.1.3" },
        { v1: "2.0.0", v2: "1.9.9", expected: 1, desc: "2.0.0 > 1.9.9" },
      ],
    },

    // 不同长度的版本号
    {
      name: "不同长度版本号比较",
      tests: [
        { v1: "1.0", v2: "1.0.0", expected: 0, desc: "1.0 = 1.0.0" },
        { v1: "1.0.0", v2: "1.0", expected: 0, desc: "1.0.0 = 1.0" },
        { v1: "1.0.0.1", v2: "1.0.0", expected: 1, desc: "1.0.0.1 > 1.0.0" },
        { v1: "1.0.0", v2: "1.0.0.1", expected: -1, desc: "1.0.0 < 1.0.0.1" },
      ],
    },

    // 预发布版本
    {
      name: "预发布版本比较",
      tests: [
        {
          v1: "1.0.0",
          v2: "1.0.0-alpha",
          expected: 1,
          desc: "正式版 > 预发布版",
        },
        {
          v1: "1.0.0-alpha",
          v2: "1.0.0",
          expected: -1,
          desc: "预发布版 < 正式版",
        },
        {
          v1: "1.0.0-alpha",
          v2: "1.0.0-beta",
          expected: -1,
          desc: "alpha < beta",
        },
        {
          v1: "1.0.0-beta.1",
          v2: "1.0.0-beta.2",
          expected: -1,
          desc: "beta.1 < beta.2",
        },
        {
          v1: "1.0.0-alpha.1",
          v2: "1.0.0-alpha.10",
          expected: -1,
          desc: "alpha.1 < alpha.10",
        },
      ],
    },

    // 边界情况
    {
      name: "边界情况测试",
      tests: [
        { v1: "0.0.0", v2: "0.0.1", expected: -1, desc: "0.0.0 < 0.0.1" },
        {
          v1: "999.999.999",
          v2: "1000.0.0",
          expected: -1,
          desc: "999.999.999 < 1000.0.0",
        },
      ],
    },
  ];

  let totalTests = 0;
  let passedTests = 0;

  tests.forEach((testSuite) => {
    console.log(`📋 ${testSuite.name}:`);

    testSuite.tests.forEach((test) => {
      totalTests++;
      try {
        const result = compareVersion(test.v1, test.v2);
        const passed = result === test.expected;

        if (passed) {
          console.log(`  ✅ ${test.desc}`);
          passedTests++;
        } else {
          console.log(
            `  ❌ ${test.desc} - 期望: ${test.expected}, 实际: ${result}`
          );
        }
      } catch (error) {
        console.log(`  ❌ ${test.desc} - 错误: ${error.message}`);
      }
    });
    console.log("");
  });

  // 测试 VersionComparator 工具类
  console.log("🔧 VersionComparator 工具类测试:");

  const comparatorTests = [
    {
      name: "isGreaterThan",
      test: () => VersionComparator.isGreaterThan("1.0.1", "1.0.0"),
      expected: true,
    },
    {
      name: "isLessThan",
      test: () => VersionComparator.isLessThan("1.0.0", "1.0.1"),
      expected: true,
    },
    {
      name: "isEqual",
      test: () => VersionComparator.isEqual("1.0.0", "1.0.0"),
      expected: true,
    },
    {
      name: "sort",
      test: () => {
        const versions = ["1.0.0", "2.0.0", "1.5.0", "1.0.1"];
        const sorted = VersionComparator.sort(versions);
        return (
          JSON.stringify(sorted) ===
          JSON.stringify(["1.0.0", "1.0.1", "1.5.0", "2.0.0"])
        );
      },
      expected: true,
    },
    {
      name: "getMax",
      test: () => {
        const versions = ["1.0.0", "2.0.0", "1.5.0", "1.0.1"];
        return VersionComparator.getMax(versions) === "2.0.0";
      },
      expected: true,
    },
    {
      name: "getMin",
      test: () => {
        const versions = ["1.0.0", "2.0.0", "1.5.0", "1.0.1"];
        return VersionComparator.getMin(versions) === "1.0.0";
      },
      expected: true,
    },
  ];

  comparatorTests.forEach((test) => {
    totalTests++;
    try {
      const result = test.test();
      const passed = result === test.expected;

      if (passed) {
        console.log(`  ✅ ${test.name}`);
        passedTests++;
      } else {
        console.log(
          `  ❌ ${test.name} - 期望: ${test.expected}, 实际: ${result}`
        );
      }
    } catch (error) {
      console.log(`  ❌ ${test.name} - 错误: ${error.message}`);
    }
  });

  console.log("\n📊 测试结果:");
  console.log(`总测试数: ${totalTests}`);
  console.log(`通过测试: ${passedTests}`);
  console.log(`失败测试: ${totalTests - passedTests}`);
  console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log("\n🎉 所有测试通过！版本比较算法工作正常。");
  } else {
    console.log("\n⚠️  部分测试失败，请检查算法实现。");
  }
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
