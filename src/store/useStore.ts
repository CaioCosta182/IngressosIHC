import { create } from 'zustand';
export const useStore = create((set: any) => ({
  user: null,
  meusIngressos: [],
  login: (name: string) => set({ user: { name, loggedIn: true } }),
  logout: () => set({ user: null }),
  adicionarIngresso: (ingresso: any) => 
    set((state: any) => ({ meusIngressos: [...state.meusIngressos, ingresso] })),
}));
