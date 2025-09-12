import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// 加载环境变量
config();

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
