import { client, cosineSimilarity } from "./llm.mjs";
import fs from "fs/promises";
// 向量 cos sin 函数 文本语义检索
// LIKE 文本检索

const inputFilePath = "./data/post-embedding.json";
const data = await fs.readFile(inputFilePath, "utf-8");
const posts = JSON.parse(data);

const response = await client.embeddings.create({
  model: "text-embedding-ada-002",
  input: `react ,tailwindcss`,
});

// console.log(response.data[0].embedding);

const { embedding } = response.data[0];

const results = posts
  .map((item) => ({
    ...item,
    similarity: cosineSimilarity(embedding, item.embedding),
  }))
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 3)
  .map((item, index) => `${index + 1}.${item.title},${item.category}`)
  .join("\n");

console.log(results);
