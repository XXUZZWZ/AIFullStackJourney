// zustand react 状态管理框架
import {
  create, // 创建store 存状态的和改变状态方法地方
} from "zustand";
//创建的 store 是一个 hook，你可以放任何东西到里面：基础变量，对象、函数，状态必须不可改变地更新，set 函数合并状态以实现状态更新。

export const useCounterStore = create((set) => ({
  count: 0,
  // 函数式更新，避免闭包陷阱
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
// 这是一个hook
