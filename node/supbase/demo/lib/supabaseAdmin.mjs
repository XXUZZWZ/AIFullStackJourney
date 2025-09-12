import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 加载环境变量
config();

// 使用服务角色密钥的客户端（绕过 RLS）
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // 使用服务角色密钥
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
