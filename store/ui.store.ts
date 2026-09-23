import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        isSidebarOpen: false,
        isDarkMode: false,
        toggleSidebar: () =>
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
        toggleDarkMode: () =>
          set((state) => ({ isDarkMode: !state.isDarkMode })),
        setDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),
      }),
      {
        name: 'journi-ui-storage',
      }
    )
  )
);
