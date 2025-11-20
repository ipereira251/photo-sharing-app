import { create } from "zustand";

export default useStore = create((set) => ({
    advEnabled: false,
    setAdvEnabled: (value) => set(() => ({advEnabled: value})),
}));
