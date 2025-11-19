import { create } from 'zustand';

const useSessionStore = create((set) => ({
  loggedIn: false,
  username: '', 
  firstName: '', 
  lastName: '',
  setSession: (session) => set({ loggedIn: session.loggedIn, username: session.username, firstName: session.firstName, lastName: session.lastName }), 
  clearSession: () => set({ loggedIn: false, user: null })
}));

export default useSessionStore;