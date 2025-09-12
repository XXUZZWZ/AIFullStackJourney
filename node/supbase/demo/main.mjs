import { supabase } from "./lib/supabaseClinet.mjs";

console.log("尝试插入数据到 todos 表...");

const { error, data } = await supabase.from("todos").insert({
  title: "Hello World",
  is_complete: false,
});

if (error) {
  console.error("插入失败:", error);
  console.log("\n可能的解决方案:");
  console.log("1. 检查 Supabase 项目中的 RLS 策略");
  console.log("2. 使用服务角色密钥 (service_role key) 而不是匿名密钥");
  console.log("3. 在 Supabase 控制台中为 todos 表配置适当的 RLS 策略");
} else {
  console.log("插入成功:", data);
}
