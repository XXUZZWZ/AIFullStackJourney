import { create } from "zustand";
import { doLogin } from "../api/user";
// 创建 store
export const useUserStore = create((set) => ({
  user: null, // 用户信息
  isLoading: false, // 是否登录
  Login: async ({ username = "", password = "" }) => {
    const res = await doLogin({ username, password });
    // console.log("data",res);
    const { token, data: user } = res.data;
    // data:user 语法的意思是？重新命名
    console.log("user", user, "token", token);
    localStorage.setItem("token", token);
    set({
      user,
      isLogin: true,
    });
  },
  Logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isLogin: false,
    });
  },
}));
