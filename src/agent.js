import axios from 'axios';

// Utilisation de la variable d'environnement configurée sur Vercel/Netlify
const URL_BACKEND = window.location.hostname === 'localhost' 
    ? "http://localhost:3002" 
    : (process.env.REACT_APP_API_URL || "https://boopursal-backend.vercel.app");

console.log('🚀 SYSTEME : Forçage de l\'Agent API sur : ' + URL_BACKEND);

const instance = axios.create({
    baseURL: URL_BACKEND,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
