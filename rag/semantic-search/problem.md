# 语义搜索项目巩固练习题

## 一、选择题（每题 2 分，共 20 分）

### 1. text-embedding-ada-002 模型的输出向量维度是多少？

A. 768 维  
B. 1024 维  
C. 1536 维  
D. 2048 维

### 2. 余弦相似度的取值范围是？

A. [0, 1]  
B. [-1, 1]  
C. [0, ∞]  
D. [-∞, ∞]

### 3. 在项目中，哪个文件负责批量数据向量化处理？

A. main.mjs  
B. llm.mjs  
C. embedding.mjs  
D. package.json

### 4. 余弦相似度为 0.0 表示什么含义？

A. 完全相似  
B. 完全不相似  
C. 无关联性  
D. 数据错误

### 5. 项目使用哪种模块系统？

A. CommonJS  
B. AMD  
C. ES Modules  
D. UMD

### 6. 在搜索结果排序中，使用了哪种排序方式？

A. 升序排序  
B. 降序排序  
C. 随机排序  
D. 不排序

### 7. 点积计算的作用是什么？

A. 计算向量长度  
B. 计算向量夹角  
C. 反映向量投影程度  
D. 归一化向量

### 8. 项目中使用什么方式读取文件？

A. fs.readFileSync  
B. fs.readFile  
C. fs/promises  
D. stream

### 9. 语义搜索相比传统关键字搜索的优势是？

A. 速度更快  
B. 理解语义含义  
C. 成本更低  
D. 实现更简单

### 10. 在实际应用中，为什么要进行离线向量化？

A. 提高搜索精度  
B. 减少实时计算开销  
C. 增加数据安全性  
D. 简化代码逻辑

## 二、判断题（每题 2 分，共 20 分）

### 1. 余弦相似度只关注向量的方向，不关注向量的大小。（）

### 2. text-embedding-ada-002 只支持英文文本处理。（）

### 3. 在项目中，每次搜索都需要重新向量化所有文档。（）

### 4. 向量长度的计算使用的是欧几里得距离公式。（）

### 5. 余弦相似度为 -1.0 表示两个向量完全相反。（）

### 6. 项目使用同步方式处理文件读写操作。（）

### 7. 在搜索结果中，similarity 值越大表示相似度越高。（）

### 8. 点积的结果可能为负数。（）

### 9. 语义搜索可以理解同义词和相关概念。（）

### 10. 向量化处理只能用于文本数据。（）

## 三、简答题（每题 10 分，共 30 分）

### 1. 请解释余弦相似度算法的计算步骤，并说明每一步的作用。

### 2. 分析项目中 embedding.mjs 和 main.mjs 的功能差异，说明为什么要分离这两个模块？

### 3. 在实际项目中，如何优化大规模数据的语义搜索性能？请提出至少 3 种优化策略。

## 四、编程实践题（每题 15 分，共 30 分）

### 1. 向量相似度计算实现

请实现一个函数，计算两个向量的余弦相似度，要求：

- 处理边界情况（零向量）
- 添加输入验证
- 提供详细注释

```javascript
/**
 * 计算两个向量的余弦相似度
 * @param {number[]} vector1 - 第一个向量
 * @param {number[]} vector2 - 第二个向量
 * @returns {number} 余弦相似度值 [-1, 1]
 */
function calculateCosineSimilarity(vector1, vector2) {
  // 请在此处实现
}

// 测试用例
const v1 = [1, 2, 3];
const v2 = [4, 5, 6];
console.log(calculateCosineSimilarity(v1, v2));
```

### 2. 搜索系统扩展

基于现有项目，实现一个支持多关键词搜索的函数，要求：

- 支持 AND 和 OR 逻辑
- 返回带有匹配度说明的结果
- 处理空查询情况

```javascript
/**
 * 多关键词语义搜索
 * @param {string[]} keywords - 搜索关键词数组
 * @param {string} logic - 逻辑关系 'AND' 或 'OR'
 * @param {Object[]} documents - 文档数据
 * @returns {Object[]} 搜索结果
 */
async function multiKeywordSearch(keywords, logic, documents) {
  // 请在此处实现
}
```

---

## 参考答案

### 一、选择题答案

1. C（1536 维）
2. B（[-1, 1]）
3. C（embedding.mjs）
4. C（无关联性）
5. C（ES Modules）
6. B（降序排序）
7. C（反映向量投影程度）
8. C（fs/promises）
9. B（理解语义含义）
10. B（减少实时计算开销）

### 二、判断题答案

1. ✓（正确）
2. ✗（支持多语言）
3. ✗（使用预计算的向量）
4. ✓（正确）
5. ✓（正确）
6. ✗（使用异步方式）
7. ✓（正确）
8. ✓（正确）
9. ✓（正确）
10. ✗（也可用于图像、音频等）

### 三、简答题参考答案

#### 1. 余弦相似度计算步骤

**步骤一：计算点积**

- 公式：A·B = Σ(ai × bi)
- 作用：计算两向量在相同方向上的投影乘积总和

**步骤二：计算向量模长**

- 公式：|A| = √(Σ(ai²))
- 作用：获取向量的长度，用于归一化

**步骤三：计算余弦值**

- 公式：cos(θ) = (A·B) / (|A|×|B|)
- 作用：归一化结果，消除向量大小影响，只关注方向

#### 2. embedding.mjs 与 main.mjs 功能差异

**embedding.mjs（数据预处理）：**

- 批量读取原始数据
- 调用 API 进行向量化
- 生成带嵌入向量的数据文件
- 一次性离线处理

**main.mjs（实时搜索）：**

- 处理用户查询
- 计算查询向量与文档向量相似度
- 排序并返回结果
- 实时响应用户请求

**分离原因：**

- 职责分离：预处理与搜索逻辑解耦
- 性能优化：避免重复向量化计算
- 可维护性：独立模块便于测试和修改

#### 3. 大规模语义搜索性能优化策略

**策略一：向量索引优化**

- 使用专业向量数据库（Pinecone、Weaviate）
- 实现 HNSW 或 IVF 索引算法
- 支持近似最近邻搜索

**策略二：计算优化**

- 并行化相似度计算
- 使用 GPU 加速向量运算
- 实现增量搜索和缓存机制

**策略三：数据分层**

- 热点数据优先索引
- 按类别或时间分片存储
- 实现多级缓存策略

### 四、编程实践题参考答案

#### 1. 向量相似度计算实现

```javascript
/**
 * 计算两个向量的余弦相似度
 * @param {number[]} vector1 - 第一个向量
 * @param {number[]} vector2 - 第二个向量
 * @returns {number} 余弦相似度值 [-1, 1]
 */
function calculateCosineSimilarity(vector1, vector2) {
  // 输入验证
  if (!Array.isArray(vector1) || !Array.isArray(vector2)) {
    throw new Error("输入必须为数组");
  }

  if (vector1.length !== vector2.length) {
    throw new Error("向量维度必须相同");
  }

  if (vector1.length === 0) {
    throw new Error("向量不能为空");
  }

  // 计算点积
  let dotProduct = 0;
  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];
  }

  // 计算向量模长
  let magnitude1 = 0;
  let magnitude2 = 0;
  for (let i = 0; i < vector1.length; i++) {
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  // 处理零向量情况
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  // 计算余弦相似度
  return dotProduct / (magnitude1 * magnitude2);
}

// 测试用例
const v1 = [1, 2, 3];
const v2 = [4, 5, 6];
console.log(calculateCosineSimilarity(v1, v2)); // 约 0.974
```

#### 2. 多关键词搜索系统

```javascript
import { client } from "./llm.mjs";

/**
 * 多关键词语义搜索
 * @param {string[]} keywords - 搜索关键词数组
 * @param {string} logic - 逻辑关系 'AND' 或 'OR'
 * @param {Object[]} documents - 文档数据
 * @returns {Object[]} 搜索结果
 */
async function multiKeywordSearch(keywords, logic = "OR", documents) {
  // 输入验证
  if (!keywords || keywords.length === 0) {
    return [];
  }

  // 为每个关键词生成向量
  const keywordEmbeddings = [];
  for (const keyword of keywords) {
    const response = await client.embeddings.create({
      model: "text-embedding-ada-002",
      input: keyword,
    });
    keywordEmbeddings.push(response.data[0].embedding);
  }

  // 计算每个文档与关键词的相似度
  const results = documents.map((doc) => {
    const similarities = keywordEmbeddings.map((keywordEmb) =>
      calculateCosineSimilarity(keywordEmb, doc.embedding)
    );

    let finalScore;
    let matchInfo;

    if (logic === "AND") {
      // AND 逻辑：取最小相似度
      finalScore = Math.min(...similarities);
      matchInfo = `匹配所有关键词，最低相似度: ${finalScore.toFixed(3)}`;
    } else {
      // OR 逻辑：取最大相似度
      finalScore = Math.max(...similarities);
      const maxIndex = similarities.indexOf(finalScore);
      matchInfo = `最匹配关键词: "${
        keywords[maxIndex]
      }"，相似度: ${finalScore.toFixed(3)}`;
    }

    return {
      ...doc,
      similarity: finalScore,
      matchInfo,
      keywordSimilarities: similarities,
    };
  });

  // 按相似度排序并返回
  return results
    .filter((item) => item.similarity > 0.1) // 过滤低相似度结果
    .sort((a, b) => b.similarity - a.similarity);
}

// 使用示例
// const results = await multiKeywordSearch(
//     ['React', 'TypeScript'],
//     'AND',
//     documents
// );
```

**评分标准：**

- 代码正确性（50%）
- 错误处理（20%）
- 代码注释（15%）
- 算法效率（15%）
