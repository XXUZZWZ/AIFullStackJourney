//自定义hook
// hook + component renderer
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
export function useTheme() {
  return useContext(ThemeContext);
  // 返回当前主题
}
