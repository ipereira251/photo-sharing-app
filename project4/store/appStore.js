import { create } from "zustand";

const useStore = create((set) => ({
    advEnabled: false,
    selectedPhoto: null,
    currentText: "",
    likedById: {},
    likeCountbyId: {},

    setAdvEnabled: (value) => set(() => ({advEnabled: value})),
    setSelectedPhoto: (value) => set(() => ({selectedPhoto: value})),
    setCurrentText: (value) => set(() => ({currentText: value})),

    setLiked: (photoId, bool_value) => set((state) => ({
        likedById: {
            ...state.likedById,
            [photoId]: bool_value,
        },
        })),

    setLikeCount: (photoId, num_value) => set((state) => ({
        likeCountbyId: {
            ...state.likeCountbyId,
            [photoId]: num_value,
        },
        })),

    set: (f) => set(f),
}));

export default useStore;
