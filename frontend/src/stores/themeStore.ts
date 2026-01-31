import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });
                updateDocumentTheme(newTheme);
            },
            setTheme: (theme) => {
                set({ theme });
                updateDocumentTheme(theme);
            },
        }),
        {
            name: 'coding-council-theme',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    updateDocumentTheme(state.theme);
                }
            },
        }
    )
);

function updateDocumentTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
}

// Initialize theme on load
export function initializeTheme() {
    const stored = localStorage.getItem('coding-council-theme');
    if (stored) {
        const parsed = JSON.parse(stored);
        updateDocumentTheme(parsed.state?.theme || 'dark');
    } else {
        // Apply system preference, defaulting to dark if no preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        updateDocumentTheme(prefersDark ? 'dark' : 'light');
    }
}
