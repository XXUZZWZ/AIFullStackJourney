import { supabaseAdmin } from "./lib/supabaseAdmin.mjs";

console.log("使用管理员客户端插入数据到 todos 表...");

const { error, data } = await supabaseAdmin.from("todos").insert({
  title: "Hello World (Admin)",
  is_complete: false,
});

if (error) {
  console.error("插入失败:", error);
} else {
  console.log("插入成功:", data);
}

// 查询所有数据
console.log("\n查询所有 todos:");
const { data: todos, error: queryError } = await supabaseAdmin
  .from("todos")
  .select("*");

if (queryError) {
  console.error("查询失败:", queryError);
} else {
  console.log("查询结果:", todos);
}
