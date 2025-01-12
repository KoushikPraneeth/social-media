import { create } from 'zustand';

    const useStore = create((set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      soundEnabled: true,
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
    }));

    export default useStore;
