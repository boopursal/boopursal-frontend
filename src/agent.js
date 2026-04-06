import axios from 'axios';

// Utilisation de l'adresse de production STABLE du Backend
const URL_BACKEND = "https://boopursal-backend.vercel.app";

console.log('🚀 SYSTEME : Forçage de l\'Agent API sur : ' + URL_BACKEND);

const instance = axios.create({
    baseURL: URL_BACKEND,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
