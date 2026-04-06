import axios from 'axios';
import { URL_SITE } from './app/@fuse/Constants';

console.log('🚀 SYSTEME : Chargement de l\'Agent API sur : ' + URL_SITE);

const instance = axios.create({
    baseURL: URL_SITE,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
