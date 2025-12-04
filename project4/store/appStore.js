import { create } from "zustand";

const useStore = create((set) => ({
    advEnabled: false,
    selectedPhoto: null,
    currentText: "",
    setAdvEnabled: (value) => set(() => ({advEnabled: value})),
    setSelectedPhoto: (value) => set(() => ({selectedPhoto: value})),
    setCurrentText: (value) => set(() => ({currentText: value})),
    set: (f) => set(f),
}));

export default useStore;
