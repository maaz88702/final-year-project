import { create } from "zustand";

const useStore = create((set) => ({
  // state
  count: 0,
  user: null,

  // actions
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useStore;
