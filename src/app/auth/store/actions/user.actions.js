import history from '@history';
import { setDefaultSettings, setInitialSettings } from 'app/store/actions/fuse';
import _ from '@lodash';
import store from 'app/store';
import * as Actions from 'app/store/actions';
import firebaseService from 'app/services/firebaseService';
import auth0Service from 'app/services/auth0Service';
import jwtService from 'app/services/jwtService';
import agent from 'agent';

export const SET_USER_DATA = '[USER] SET DATA';
export const GET_FOURNISSEUR_JETONS = '[USER] GET_FOURNISSEUR_JETONS';
export const REQUEST_FOURNISSEUR_JETONS = '[USER] REQUEST_FOURNISSEUR_JETONS';
export const REMOVE_USER_DATA = '[USER] REMOVE DATA';
export const USER_LOGGED_OUT = '[USER] LOGGED OUT';
export const REQUEST_FOURNISSEUR_ABONNEMENT = '[USER] REQUEST_FOURNISSEUR_ABONNEMENT';
export const GET_FOURNISSEUR_ABONNEMENT = '[USER] GET_FOURNISSEUR_ABONNEMENT';

/**
 * Set user data from Auth0 token data
 */
export function setUserDataAuth0(tokenData) {
    const user = {
        role: ['admin'],
        from: 'auth0',
        data: {
            displayName: tokenData.username,
            photoURL: tokenData.picture,
            email: tokenData.email,
            settings: (tokenData.user_metadata && tokenData.user_metadata.settings) ? tokenData.user_metadata.settings : {},
            shortcuts: (tokenData.user_metadata && tokenData.user_metadata.shortcuts) ? tokenData.user_metadata.shortcuts : []
        }
    };

    return setUserData(user);
}

/**
 * Set user data from Firebase data
 */
export function setUserDataFirebase(user, authUser) {
    if (user && user.data &&
        user.data.settings &&
        user.data.settings.theme &&
        user.data.settings.layout &&
        user.data.settings.layout.style) {
        // Set user data but do not update
        return setUserData(user);
    }
    else {
        // Create missing user settings
        return createUserSettingsFirebase(authUser);
    }
}

/**
 * Create User Settings with Firebase data
 */
export function createUserSettingsFirebase(authUser) {
    return (dispatch, getState) => {
        const guestUser = getState().auth.user;
        const fuseDefaultSettings = getState().fuse.settings.defaults;
        const currentUser = null;

        /**
         * Merge with current Settings
         */
        const user = _.merge({}, guestUser,
            {
                uid: authUser.uid,
                from: 'firebase',
                role: ["admin"],
                data: {
                    displayName: authUser.displayName,
                    email: authUser.email,
                    settings: { ...fuseDefaultSettings }
                }
            }
        );
        currentUser.updateProfile(user.data);

        updateUserData(user);
        return dispatch(setUserData(user));
    }
}


/**
 * Set User Data
 */
export function getTokenFournisseur() {
    const request = agent.get('/api/jetons/founrisseur');

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR_JETONS,
        })
        return request.then((response) =>
            dispatch({
                type: GET_FOURNISSEUR_JETONS,
                payload: response.data
            })
        );

    }

}

export function getAbonnementFournisseur(params) {
    const request = agent.get(`/api/fournisseurs/${params}/abonnements?itemsPerPage=1&exists[expired]=true&order[expired]=desc`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR_ABONNEMENT,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_FOURNISSEUR_ABONNEMENT,
                payload: response.data['hydra:member'][0]
            })
        }

        );
    }

}

/**
 * Set User Data
 */
export function setUserData(user) {
    return (dispatch) => {

        /*
        Set User Settings
         */
        dispatch(setDefaultSettings(user.data.settings));

        /*
        Set User Data
         */
        dispatch({
            type: SET_USER_DATA,
            payload: user
        })
    }
}

/**
 * Update User Settings
 */
export function updateUserSettings(settings) {
    return (dispatch, getState) => {
        const oldUser = getState().auth.user;
        const user = _.merge({}, oldUser, { data: { settings } });

        updateUserData(user);

        return dispatch(setUserData(user));
    }
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
    return (dispatch, getState) => {
        const user = getState().auth.user;
        const newUser = {
            ...user,
            data: {
                ...user.data,
                shortcuts
            }
        };

        updateUserData(newUser);

        return dispatch(setUserData(newUser));
    }
}

/**
 * Remove User Data
 */
export function removeUserData() {
    return {
        type: REMOVE_USER_DATA
    }
}

/**
 * Logout
 */
export function logoutUser() {

    return (dispatch, getState) => {

        const user = getState().auth.user;

        if (!user.role || user.role.length === 0)// is guest
        {
            return null;
        }

        history.push({
            pathname: '/login'
        });

        switch (user.from) {
            case 'firebase':
                {
                    firebaseService.signOut();
                    break;
                }
            case 'auth0':
                {
                    auth0Service.logout();
                    break;
                }
            default:
                {
                    jwtService.logout();
                }
        }

        dispatch(setInitialSettings());

        dispatch({
            type: USER_LOGGED_OUT
        })
    }
}

/**
 * Update User Data
 */
function updateUserData(user) {
    if (!user.role || user.role.length === 0)// is guest
    {
        return;
    }

    switch (user.from) {
        case 'firebase':
            {
                firebaseService.updateUserData(user)
                    .then(() => {
                        store.dispatch(Actions.showMessage({ message: "User data saved to firebase" }));
                    })
                    .catch(error => {
                        store.dispatch(Actions.showMessage({ message: error.message }));
                    });
                break;
            }
        case 'auth0':
            {
                auth0Service.updateUserData({
                    settings: user.data.settings,
                    shortcuts: user.data.shortcuts
                })
                    .then(() => {
                        store.dispatch(Actions.showMessage({ message: "User data saved to auth0" }));
                    })
                    .catch(error => {
                        store.dispatch(Actions.showMessage({ message: error.message }));
                    });
                break;
            }
        default:
            {
                jwtService.updateUserData(user)
                    .then(() => {
                        store.dispatch(Actions.showMessage({ message: "User data saved with api" }));
                    })
                    .catch(error => {
                        store.dispatch(Actions.showMessage({ message: error.message }));
                    });
                break;
            }
    }
}
