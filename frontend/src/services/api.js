import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
};

// Equipment API
export const equipmentAPI = {
    getAll: (params) => api.get('/equipment', { params }),
    getById: (id) => api.get(`/equipment/${id}`),
    getCategories: () => api.get('/equipment/categories'),
    getMyListings: () => api.get('/equipment/owner/my-listings'),
    create: (data) => api.post('/equipment', data),
    update: (id, data) => api.put(`/equipment/${id}`, data),
    delete: (id) => api.delete(`/equipment/${id}`),
};

// Booking API
export const bookingAPI = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
    getOwnerBookings: (params) => api.get('/bookings/owner-bookings', { params }),
    getById: (id) => api.get(`/bookings/${id}`),
    updateStatus: (id, data) => api.put(`/bookings/${id}/status`, data),
    updatePaymentStatus: (id, data) => api.put(`/bookings/${id}/payment-status`, data),
    checkAvailability: (equipmentId, params) =>
        api.get(`/bookings/check-availability/${equipmentId}`, { params }),
};

export default api;
