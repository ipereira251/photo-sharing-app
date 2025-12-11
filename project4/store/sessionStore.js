import { create } from 'zustand';

const useSessionStore = create((set) => ({
  loggedIn: false,
  username: null, 
  firstName: '',
  userId: null,
  setSession: (user) => {
    set({ loggedIn: true, username: user.username, firstName: user.firstName, userId: user.userId });
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearSession: () => {
    set({ loggedIn: false, username: null, firstName: "", userId: null });
    localStorage.removeItem('user');
    window.location.reload();
  }, 
  initSession: () => {
    const savedUser = localStorage.getItem('user');
    if(savedUser){
      set({ loggedIn: true, ...JSON.parse(savedUser)});
    }
  }
}));

export default useSessionStore;