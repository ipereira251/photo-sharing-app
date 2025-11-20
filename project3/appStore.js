import { create } from "zustand";

let useStore = create((set) => ({
    advEnabled: false,
    setAdvEnabled: (value) => set(() => ({advEnabled: value})),
    set: (f) => set(f),
}));

export default useStore;
