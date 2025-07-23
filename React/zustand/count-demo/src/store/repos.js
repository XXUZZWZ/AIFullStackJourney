// 怎么处理网络请求呢？

import { getRepo, getRepoList } from "../api/repos";
import { create } from "zustand";

export const useRepoStore = create((set) => ({
  repos: [],
  loading: false,
  error: null,
  fetchRepos: async () => {
    //业务逻辑
    set({ loading: true, error: null });
    try {
      const res = await getRepoList("XXUZZWZ");
      set({ repos: res.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
