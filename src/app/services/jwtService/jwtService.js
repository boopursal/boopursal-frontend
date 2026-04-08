import axios from 'axios';
import jwtDecode from 'jwt-decode';
import FuseUtils from '@fuse/FuseUtils';
import agent from 'agent';

class jwtService extends FuseUtils.EventEmitter {

    init() {
        this.setInterceptors();
        this.handleAuthentication();
    }

    setInterceptors = () => {
        agent.interceptors.response.use(response => {
            return response;
        }, err => {
            return new Promise((resolve, reject) => {
                if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
                    // if you ever get an unauthorized response, logout the user
                    this.emit('onAutoLogout', 'Session expirée');
                    this.setSession(null);
                }
                throw err;
            });
        });
    };

    handleAuthentication = () => {

        let access_token = this.getAccessToken();


        if (!access_token) {
            return;
        }

        if (this.isAuthTokenValid(access_token)) {
            this.setSession(access_token);
            this.emit('onAutoLogin', true);
        }
        else {
            this.setSession(null);
            this.emit('onAutoLogout', 'Session expirée');
        }
    };

    createUser = (data) => {
        return new Promise((resolve, reject) => {
            agent.post('/api/auth/register', data)
                .then(response => {
                    if (response.data.user) {
                        this.setSession(response.data.access_token);
                        resolve(response.data.user);
                    }
                    else {
                        reject(response.data.error);
                    }
                });
        });
    };

    signInWithEmailAndPassword = (email, password) => {
        return new Promise((resolve, reject) => {
            agent.post('api/login_check', {
                email,
                password
            }).then(response => {

                if (response.data.user) {
                    //console.log(response.data.token)
                    this.setSession(response.data.token);
                    resolve(response.data.user);
                }
                else {
                    reject(response.data.error);
                }

            }).catch((e) => {
                const error = {
                    message: e.response.data.message
                };
                reject(error);
            });
        });
    };

    signInWithToken = () => {
        return new Promise((resolve, reject) => {
            agent.get('api/currentUser')
                .then(response => {
                    if (response.data.user) {
                        this.setSession(response.data.token);
                        resolve(response.data.user);
                    }
                    else {
                        reject(response.data.error);
                    }
                }).catch((e) => {
                    const error = {
                        message: e.response.data.message
                    };
                    reject(error);
                });
        });
    };
    signInWithConfirmToken = (confirmationToken) => {
        let data = {
            confirmationToken
        }
        return new Promise((resolve, reject) => {
            agent.post('api/users/confirm', data)
                .then(response => {

                    if (response.data.user) {
                        this.setSession(response.data.token);
                        resolve(response.data.user);
                    }
                    else {
                        reject(response.data.error);
                    }
                }).catch((e) => {
                    const error = FuseUtils.parseApiErrors(e);
                    reject(error);
                });;
        });
    };

    updateUserData = (user) => {
        return agent.post('/api/auth/user/update', {
            user: user
        });
    };

    setSession = access_token => {
        if (access_token) {
            localStorage.setItem('jwt_access_token', access_token);
            agent.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

        }
        else {
            localStorage.removeItem('jwt_access_token');
            delete agent.defaults.headers.common['Authorization'];
        }
    };

    logout = () => {
        this.setSession(null);
    };

    isAuthTokenValid = access_token => {
        if (!access_token) {
            return false;
        }
        const decoded = jwtDecode(access_token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
            console.warn('Session expirée');
            return false;
        }
        else {
            return true;
        }
    };

    getAccessToken = () => {
        return window.localStorage.getItem('jwt_access_token');
    };
}

const instance = new jwtService();

export default instance;
