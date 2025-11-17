import { create } from 'zustand';

const useUIStore = create((set) => ({
  advEnabled: false,
  toggleAdvEnabled: () => set((state) => ({ advEnabled: !state.advEnabled }))
}));

export default useUIStore;