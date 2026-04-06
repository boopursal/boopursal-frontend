import axios from 'axios';
import { URL_SITE } from '../@fuse/Constants';

const instance = axios.create({
    baseURL: URL_SITE, // URL dynamique du backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
