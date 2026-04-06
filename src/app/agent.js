import axios from 'axios';

const instance = axios.create({
    baseURL: 'localhost:3333', // URL de votre backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
