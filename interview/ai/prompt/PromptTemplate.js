class PromptTemplate {
  constructor(template) {
    this.template = template;
  }
  /**
   * 将模板字符串中的占位符使用传入变量进行替换。
   *
   * 占位符格式为 {key}，会被 variables 中同名键的值替换（全局替换）。
   *
   * @param {Object.<string, string|number|boolean>} variables - 键值对形式的变量集合。
   *   - key: 对应模板中的占位符名（不带花括号）
   *   - value: 用于替换占位符的值，会被转为字符串参与拼接
   * @returns {string} 替换完成后的最终字符串。
   * @throws {TypeError} 当 variables 不是对象时抛出。
   * @sideEffects 无：不会修改实例的 this.template，也不会修改传入的 variables。
   */
  format(variables) {
    // 容错：确保传入为对象
    if (variables == null || typeof variables !== "object") {
      throw new TypeError("variables 必须是对象");
    }

    let result = this.template; // 不修改原模板，使用局部 result 保持纯函数特性
    for (const [key, value] of Object.entries(variables)) {
      // 使用全局正则，将所有 {key} 替换为对应的值
      // 注意：如果 key 含有正则特殊字符，这里未进行转义处理
      result = result.replace(new RegExp(`{${key}}`, "g"), String(value));
    }
    return result;
  }
}

const tourismTemplate = new PromptTemplate(`
  你是一位专业的旅游顾问。
  青帮用户规划在{city}的{days}天旅游。
  要求：突出{preference},并给出每天的详细的安排

  `);

const userInput = {
  city: "西安",
  days: "3",
  preference: "历史文化",
};
const finalPrompt = tourismTemplate.format(userInput);

console.log(finalPrompt);
