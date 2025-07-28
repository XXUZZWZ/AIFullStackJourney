// search 全局状态管理
import { create } from "zustand";
import { getSuggestList, getHotList } from "@/api/search";

const useSearchStore = create((set, get) => {
  // get 读操作，读取到状态
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  return {
    searchHistory,
    suggestList: [], //suggest?keyword = "xxx"  返回 list
    hotList: [], // 热搜列表
    setSuggestList: async (keyword) => {
      const res = await getSuggestList(keyword);
      console.log(res);
      set({
        suggestList: res.data,
      });
    },
    setHotList: async () => {
      const res = await getHotList();
      console.log(res);
      set({
        hotList: res.data,
      });
    },
  };
});

export default useSearchStore;
