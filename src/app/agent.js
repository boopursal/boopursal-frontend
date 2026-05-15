import axios from 'axios';

// En local → pointe vers le backend NestJS local
// En production → baseURL vide = les requêtes /api/* passent par le proxy Netlify (netlify.toml)
const URL_BACKEND = window.location.hostname === 'localhost' ? "http://localhost:3002" : "";

console.log('🚀 SYSTEME (App) : Forçage de l\'Agent API sur : ' + URL_BACKEND);

const instance = axios.create({
    baseURL: URL_BACKEND,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
