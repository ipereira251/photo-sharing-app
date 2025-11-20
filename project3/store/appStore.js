import { create } from "zustand";

const useStore = create((set) => ({
    advEnabled: false,
    setAdvEnabled: (value) => set(() => ({advEnabled: value})),
    set: (f) => set(f),
}));

export default useStore;
