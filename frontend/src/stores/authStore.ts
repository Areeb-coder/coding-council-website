import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api';

interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: !!localStorage.getItem('accessToken'),

            updateUser: (userData: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...userData } });
                }
            },

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const { data } = await authApi.login(email, password);

                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);

                    set({
                        user: data.user,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: async () => {
                try {
                    await authApi.logout();
                } catch {
                    // Ignore logout errors
                } finally {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                    });
                }
            },

            checkAuth: async () => {
                const { accessToken } = get();
                if (!accessToken) {
                    set({ isAuthenticated: false, user: null, isLoading: false });
                    return;
                }

                set({ isLoading: true });
                try {
                    const { data } = await authApi.me();
                    if (data.user && (data.user.role === 'admin' || data.user.role === 'super_admin')) {
                        set({ user: data.user, isAuthenticated: true, isLoading: false });
                    } else {
                        set({ user: null, isAuthenticated: false, isLoading: false });
                    }
                } catch {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
            },
        }),
        {
            name: 'coding-council-auth',
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);
