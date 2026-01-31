import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    localStorage.setItem('accessToken', data.accessToken);
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    return api(originalRequest);
                }
            } catch {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/admin/login';
            }
        }

        return Promise.reject(error);
    }
);

// API methods
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    refresh: (refreshToken: string) =>
        api.post('/auth/refresh', { refreshToken }),
    updateProfile: (data: { name?: string; email?: string }) =>
        api.put('/auth/profile', data),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put('/auth/password', data),
};

export const eventsApi = {
    getAll: (params?: { page?: number; limit?: number; status?: string; category?: string; featured?: boolean }) =>
        api.get('/events', { params }),
    getById: (id: string) => api.get(`/events/${id}`),
    create: (data: Record<string, unknown>) => api.post('/events', data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/events/${id}`, data),
    delete: (id: string) => api.delete(`/events/${id}`),
};

export const teamApi = {
    getAll: (params?: { all?: boolean }) => api.get('/team', { params }),
    getById: (id: string) => api.get(`/team/${id}`),
    create: (data: Record<string, unknown>) => api.post('/team', data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/team/${id}`, data),
    delete: (id: string) => api.delete(`/team/${id}`),
    reorder: (order: { id: string; order: number }[]) => api.post('/team/reorder', { order }),
};

export const registrationsApi = {
    register: (data: Record<string, unknown>) => api.post('/registrations', data),
    getByEvent: (eventId: string, params?: { page?: number; limit?: number; status?: string }) =>
        api.get(`/registrations/event/${eventId}`, { params }),
    updateStatus: (id: string, status: string) =>
        api.patch(`/registrations/${id}/status`, { status }),
    delete: (id: string) => api.delete(`/registrations/${id}`),
    getStats: (eventId: string) => api.get(`/registrations/stats/${eventId}`),
};

export const contactApi = {
    submit: (data: { name: string; email: string; subject: string; message: string; phone?: string }) =>
        api.post('/contact', data),
    getAll: (params?: { page?: number; limit?: number; status?: string }) =>
        api.get('/contact', { params }),
    updateStatus: (id: string, status: string) =>
        api.patch(`/contact/${id}/status`, { status }),
    delete: (id: string) => api.delete(`/contact/${id}`),
};

export const reviewsApi = {
    getAll: () => api.get('/reviews'),
    getAdmin: (params?: { page?: number; limit?: number; status?: string; featured?: boolean }) =>
        api.get('/reviews/admin', { params }),
    getById: (id: string) => api.get(`/reviews/${id}`),
    create: (data: Record<string, unknown>) => api.post('/reviews', data),
    update: (id: string, data: Record<string, unknown>) => api.put(`/reviews/${id}`, data),
    delete: (id: string) => api.delete(`/reviews/${id}`),
    approve: (id: string, isApproved: boolean) => api.put(`/reviews/${id}/approve`, { isApproved }),
    feature: (id: string, isFeatured: boolean) => api.put(`/reviews/${id}/feature`, { isFeatured }),
};

export const settingsApi = {
    get: () => api.get('/settings'),
    getServerTime: () => api.get('/settings/time'),
    update: (data: Record<string, unknown>) => api.put('/settings', data),
    updateSocialLinks: (socialLinks: Record<string, string>) =>
        api.put('/settings/social-links', { socialLinks }),
    updateStats: (communityStats: Record<string, number>) =>
        api.put('/settings/stats', { communityStats }),
    updateAnnouncement: (announcementBanner: Record<string, unknown>) =>
        api.put('/settings/announcement', { announcementBanner }),
};

export default api;

