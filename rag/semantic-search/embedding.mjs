// 负责post.json 模块化

// 支持fs 的fs 的 Promise 版本

import fs from "fs/promises";
import { client } from "./llm.mjs";

// readFileSync 同步
// readFile () 异步
// fs 推出了Promise 版本

const inputFilePath = "./data/post.json";
const outputFilePath = "./data/post-embedding.json";

const data = await fs.readFile(inputFilePath, "utf-8");

console.log(data);

// 把内容向量化

const posts = JSON.parse(data);

const postsWithEmbedding = [];

for (const { title, category } of posts) {
  const response = await client.embeddings.create({
    model: "text-embedding-ada-002",
    input: `标题：${title} 分类${category}`,
  });
  postsWithEmbedding.push({
    title,
    category,
    embedding: response.data[0].embedding,
  });
}

await fs.writeFile(outputFilePath, JSON.stringify(postsWithEmbedding, null, 2));
