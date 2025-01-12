import { create } from 'zustand';

    const useStore = create((set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }));

    export default useStore;
