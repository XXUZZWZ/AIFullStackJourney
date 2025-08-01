import { create } from "zustand";

import { getImages } from "../api/home";

const useImageStore = create((set, get) => ({
  images: [],
  page: 1,
  loading: false,
  fetchMore: async () => {
    // 如果还在请求中,就不再发起请求
    if (get().loading) return;
    set({ loading: true }); // 请求中
    const res = await getImages(get().page);
    const newImages = res.data;
    console.log(res);
    // 拿到前一个状态
    set((state) => ({
      images: [...state.images, ...newImages],
      page: state.page + 1,
      loading: false,
    }));
  },
}));

export default useImageStore;
