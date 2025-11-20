import { create } from 'zustand';

const useSessionStore = create((set) => ({
  loggedIn: false,
  username: null, 
  firstName: '',
  setSession: (user) => {
    set({ loggedIn: true, username: user.username, firstName: user.firstName });
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearSession: () => {
    set({ loggedIn: false, username: null, firstName: "" });
    localStorage.removeItem('user');
  }, 
  initSession: () => {
    const savedUser = localStorage.getItem('user');
    if(savedUser){
      set({ loggedIn: true, ...JSON.parse(savedUser)});
    }
  }
}));

export default useSessionStore;