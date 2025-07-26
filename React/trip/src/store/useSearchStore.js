import { create } from "zustand";

const useSearchStore = create((set) => ({
  searchText: "",
  setSearchText: (text) => set(() => ({ searchText: text })),
}));

export default useSearchStore;
