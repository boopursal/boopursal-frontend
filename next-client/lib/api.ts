import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://it.3findustrie.com/';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        // Côté client uniquement
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('jwt_access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor pour gérer les erreurs (ex: token expiré)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('jwt_access_token');
                // Redirection vers login si nécessaire
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
