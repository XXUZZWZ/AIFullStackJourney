/**
 * 版本号比较算法
 * 支持语义化版本号比较 (如 1.2.3, 0.1.2, 2.0.0-beta.1)
 */

/**
 * 比较两个版本号的大小
 * @param {string} version1 - 第一个版本号
 * @param {string} version2 - 第二个版本号
 * @returns {number} 返回值：-1(version1 < version2), 0(相等), 1(version1 > version2)
 */
function compareVersion(version1, version2) {
  // 处理空值或无效输入
  if (!version1 || !version2) {
    throw new Error("版本号不能为空");
  }

  // 分割版本号，支持预发布版本标识符
  const v1Parts = parseVersion(version1);
  const v2Parts = parseVersion(version2);

  // 比较主版本号、次版本号、修订号
  for (
    let i = 0;
    i < Math.max(v1Parts.numbers.length, v2Parts.numbers.length);
    i++
  ) {
    const v1Num = v1Parts.numbers[i] || 0;
    const v2Num = v2Parts.numbers[i] || 0;

    if (v1Num > v2Num) return 1;
    if (v1Num < v2Num) return -1;
  }

  // 如果数字部分相同，比较预发布标识符
  return comparePreRelease(v1Parts.preRelease, v2Parts.preRelease);
}

/**
 * 解析版本号字符串
 * @param {string} version - 版本号字符串
 * @returns {object} 解析后的版本信息
 */
function parseVersion(version) {
  // 移除前后空格
  version = version.trim();

  // 分离预发布标识符
  const preReleaseMatch = version.match(/^(.+?)(?:-([a-zA-Z0-9.-]+))?$/);
  const mainVersion = preReleaseMatch[1];
  const preRelease = preReleaseMatch[2] || "";

  // 分割数字部分
  const numbers = mainVersion.split(".").map((num) => {
    const parsed = parseInt(num, 10);
    if (isNaN(parsed)) {
      throw new Error(`无效的版本号格式: ${version}`);
    }
    return parsed;
  });

  return {
    numbers,
    preRelease: preRelease.split(".").filter(Boolean),
  };
}

/**
 * 比较预发布标识符
 * @param {Array} pre1 - 第一个版本的预发布标识符
 * @param {Array} pre2 - 第二个版本的预发布标识符
 * @returns {number} 比较结果
 */
function comparePreRelease(pre1, pre2) {
  // 如果都没有预发布标识符，版本相等
  if (pre1.length === 0 && pre2.length === 0) {
    return 0;
  }

  // 有预发布标识符的版本优先级更低
  if (pre1.length === 0) return 1; // version1 是正式版，version2 是预发布版
  if (pre2.length === 0) return -1; // version1 是预发布版，version2 是正式版

  // 比较预发布标识符的各个部分
  for (let i = 0; i < Math.max(pre1.length, pre2.length); i++) {
    const part1 = pre1[i] || "";
    const part2 = pre2[i] || "";

    const result = comparePreReleasePart(part1, part2);
    if (result !== 0) return result;
  }

  return 0;
}

/**
 * 比较预发布标识符的单个部分
 * @param {string} part1 - 第一个部分
 * @param {string} part2 - 第二个部分
 * @returns {number} 比较结果
 */
function comparePreReleasePart(part1, part2) {
  const isNum1 = /^\d+$/.test(part1);
  const isNum2 = /^\d+$/.test(part2);

  // 数字标识符优先级高于字符串标识符
  if (isNum1 && !isNum2) return -1;
  if (!isNum1 && isNum2) return 1;

  if (isNum1 && isNum2) {
    // 都是数字，按数值比较
    const num1 = parseInt(part1, 10);
    const num2 = parseInt(part2, 10);
    return num1 - num2;
  } else {
    // 都是字符串，按字典序比较
    return part1.localeCompare(part2);
  }
}

/**
 * 版本比较工具类
 */
class VersionComparator {
  /**
   * 检查 version1 是否大于 version2
   */
  static isGreaterThan(version1, version2) {
    return compareVersion(version1, version2) > 0;
  }

  /**
   * 检查 version1 是否小于 version2
   */
  static isLessThan(version1, version2) {
    return compareVersion(version1, version2) < 0;
  }

  /**
   * 检查 version1 是否等于 version2
   */
  static isEqual(version1, version2) {
    return compareVersion(version1, version2) === 0;
  }

  /**
   * 检查 version1 是否大于等于 version2
   */
  static isGreaterThanOrEqual(version1, version2) {
    return compareVersion(version1, version2) >= 0;
  }

  /**
   * 检查 version1 是否小于等于 version2
   */
  static isLessThanOrEqual(version1, version2) {
    return compareVersion(version1, version2) <= 0;
  }

  /**
   * 对版本号数组进行排序
   */
  static sort(versions) {
    return versions.slice().sort(compareVersion);
  }

  /**
   * 找到版本数组中的最大版本
   */
  static getMax(versions) {
    if (versions.length === 0) return null;
    return versions.reduce((max, current) =>
      compareVersion(current, max) > 0 ? current : max
    );
  }

  /**
   * 找到版本数组中的最小版本
   */
  static getMin(versions) {
    if (versions.length === 0) return null;
    return versions.reduce((min, current) =>
      compareVersion(current, min) < 0 ? current : min
    );
  }
}

// 导出函数和类
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    compareVersion,
    VersionComparator,
  };
}

// 浏览器环境下的全局暴露
if (typeof window !== "undefined") {
  window.compareVersion = compareVersion;
  window.VersionComparator = VersionComparator;
}
