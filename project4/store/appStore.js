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
    
    toggleLike: (photoId) =>
        set((state) => ({
        likedById: {
            ...state.likedById,
            [photoId]: !state.likedById[photoId],
        },
        })),

    setLiked: (photoId, value) =>
        set((state) => ({
        likedById: {
            ...state.likedById,
            [photoId]: value,
        },
        })),

    setLikeCount: (photoId, value) =>
        set((state) => ({
        likeCountbyId: {
            ...state.likeCountbyId,
            [photoId]: value,
        },
        })),

    set: (f) => set(f),
}));

export default useStore;
