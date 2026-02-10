import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  theme: 'light' | 'dark';
  colorTheme: 'orange' | 'blue' | 'green' | 'red';
  setTheme: (theme: 'light' | 'dark') => void;
  setColorTheme: (colorTheme: 'orange' | 'blue' | 'green' | 'red') => void;
  toggleTheme: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      colorTheme: 'orange',

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setColorTheme: (colorTheme) => {
        set({ colorTheme });
        document.documentElement.classList.remove('theme-orange', 'theme-blue', 'theme-green', 'theme-red');
        document.documentElement.classList.add(`theme-${colorTheme}`);
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'papermorph-user',
      partialize: (state) => ({ theme: state.theme, colorTheme: state.colorTheme }),
    }
  )
);
