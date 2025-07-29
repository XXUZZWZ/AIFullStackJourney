import { create } from "zustand";
import { getDetail } from "../api/datail";

const useDetailStore = create((set, get) => ({
  detail: {
    title: "",
    desc: "",
    images: [],
    price: "",
  },
  loading: false,
  setDetail: async () => {
    set({ loading: true });
    const res = await getDetail();
    set({ detail: res.data, loading: false });
  },
}));

export default useDetailStore;
