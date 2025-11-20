import { create } from 'zustand';

const useSessionStore = create((set) => ({
  loggedIn: false,
  username: null, 
  firstName: '',
  setSession: (user) => set({ loggedIn: true, username: user.username, firstName: user.firstName }),
  clearSession: () => set({ loggedIn: false, username: null })
}));

export default useSessionStore;