import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';

import jwtService from 'app/services/jwtService';
import { setUserData } from "app/auth/store/actions";

export const GET_PAYS = '[STEP APP] GET PAYS';
export const GET_VILLES = '[STEP APP] GET VILLES';
export const REQUEST_PAYS = '[STEP APP] REQUEST PAYS';
export const REQUEST_VILLES = '[STEP APP] REQUEST VILLES';
export const REQUEST_UPDATE_FOURNISSEUR = '[STEP APP] REQUEST UPDATE FOURNISSEUR';
export const UPDATE_FOURNISSEUR = '[STEP APP] UPDATE FOURNISSEUR';
export const SAVE_ERROR = '[STEP APP] SAVE ERROR';
export const GET_CURRENCY = '[STEP APP]GET_CURRENCY';

export function getPays() {
    const request = agent.get('/api/pays?pagination=false');

    return (dispatch) => {
        dispatch({
            type: REQUEST_PAYS,
        });
        return request.then((response) => {

            dispatch({
                type: GET_PAYS,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getCurrency() {
    const request = agent.get('/api/currencies');

    return (dispatch) => {

        return request.then((response) => {

            dispatch({
                type: GET_CURRENCY,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getVilles(pays_id) {
    // Si pays_id est une IRI (/api/pays/144), on extrait l'ID numérique
    let id = pays_id;
    if (typeof pays_id === 'string' && pays_id.includes('/')) {
        const parts = pays_id.split('/');
        id = parts[parts.length - 1];
    }

    const request = agent.get(`/api/pays/${id}/villes?pagination=false`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_VILLES,
        });
        return request.then((response) => {
            const data = response.data['hydra:member'] || [];
            dispatch({
                type: GET_VILLES,
                payload: data
            })
        }).catch(err => {
             dispatch({
                type: GET_VILLES,
                payload: []
            })
        });

    }

}


export function setStep2(data, fournisseur_id, history) {

    if(data.pays)
    data.pays = data.pays.value;
    if(data.ville)
    data.ville = data.ville.value;

    data.redirect = '/register/fournisseur2';
    data.step = 2;

    if(data.currency)
    data.currency = data.currency.value;
    return (dispatch, getState) => {

        const request = agent.put(`/api/fournisseurs/${fournisseur_id}`, data);
        dispatch({
            type: REQUEST_UPDATE_FOURNISSEUR,
        });
        return request.then((response) => {
            dispatch({
                type: UPDATE_FOURNISSEUR,
            });
        })
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                    payload: FuseUtils.parseApiErrors(error)
                });
            });
    };

}

