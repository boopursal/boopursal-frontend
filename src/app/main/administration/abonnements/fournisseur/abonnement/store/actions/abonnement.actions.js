
import agent from 'agent';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';

export const REQUEST_ABONNEMENT = '[ABONNEMENT APP] REQUEST ABONNEMENT';
export const GET_ABONNEMENT = '[ABONNEMENT APP] GET ABONNEMENT';

export const REQUEST_SOUS_SECTEURS = '[ABONNEMENT APP] REQUEST_SOUS_SECTEURS';
export const GET_SOUS_SECTEURS = '[ABONNEMENT APP] GET SOUS_SECTEURS';

export const REQUEST_SECTEURS = '[ABONNEMENT APP] REQUEST SECTEURS';
export const GET_SECTEURS = '[ABONNEMENT APP] GET SECTEURS';

export const REQUEST_OFFRES = '[ABONNEMENT APP] REQUEST OFFRES';
export const GET_OFFRES = '[ABONNEMENT APP] GET OFFRES';

export const REQUEST_SAVE = '[ABONNEMENT APP] REQUEST SAVE';
export const SAVE_ABONNEMENT = '[ABONNEMENT APP] SAVE ABONNEMENT';
export const SAVE_ERROR = '[ABONNEMENT APP] SAVE ERROR';
export const GET_PAIEMENT = '[ABONNEMENT APP] GET_PAIEMENT';
export const CLEAN_UP = '[ABONNEMENT APP] CLEAN_UP';
export const CLEAN_UP_FRS = '[ABONNEMENT APP] CLEAN_UP_FRS';
export const GET_DUREE = '[ABONNEMENT APP] GET_DUREE';

export const REQUEST_FOURNISSEURS = '[ABONNEMENT APP] REQUEST_FOURNISSEURS';
export const GET_FOURNISSEURS = '[ABONNEMENT APP] GET_FOURNISSEURS';
export const REQUEST_FOURNISSEUR = '[ABONNEMENT APP] REQUEST_FOURNISSEUR';
export const GET_FOURNISSEUR = '[ABONNEMENT APP] GET_FOURNISSEUR';



export function cleanUp2() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function cleanUpFrs() {

    return (dispatch) => dispatch({
        type: CLEAN_UP_FRS,
    });
}



export function getDurees() {
    const request = agent.get(`/api/durees`);

    return (dispatch) => {

        return request.then((response) => {
            dispatch({
                type: GET_DUREE,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getFournisseurs() {
    const request = agent.get(`/api/fournisseurs?pagination=false&del=false&isactif=true&props[]=id&props[]=societe`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEURS,
        });
        return request.then((response) => {
            dispatch({
                type: GET_FOURNISSEURS,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getFournisseur(url) {
    const request = agent.get(url);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR,
        });
        return request.then((response) => {
            dispatch({
                type: GET_FOURNISSEUR,
                payload: response.data
            })
        });
    }

}

export function saveAbonnement(data, sousSecteurs, offre, mode, duree, remise, paiement) {


    var postData = {
        offre: offre['@id'],
        sousSecteurs: _.map(sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: mode,
        duree: duree['@id'],
        fournisseur: data.fournisseur.value,
        commentaire: data.commentaire,
        statut: paiement,
        remise: remise ? parseFloat(remise) : 0
    }
    const request = agent.post('/api/abonnements', postData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Abonnement sauvegarder' }));

            return dispatch({
                type: SAVE_ABONNEMENT,
                payload: response.data
            })
        }
        );
    }

}

export function updateAbonnement(data, sousSecteurs, offre, mode, duree, remise, paiement) {


    var putData = {
        ...data,
        offre: offre['@id'],
        sousSecteurs: _.map(sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: mode,
        duree: duree['@id'],
        commentaire: data.commentaire,
        statut: paiement,
        remise: remise ? parseFloat(remise) : 0
    }

    const request = agent.put(data['@id'], putData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Abonnement modifiée avec succès' }));
            //   dispatch(Actions.getCountForBadge('commandes-abonnements'));
            //  dispatch(Actions.getCountForBadge('abonnement-fournisseur'));
            return dispatch({
                type: SAVE_ABONNEMENT,
                payload: response.data
            })
        }
        );
    }

}

export function saveRenouvellement(data, sousSecteurs, offre, mode, duree, remise, paiement, type) {


    var postData = {

        offre: offre['@id'],
        sousSecteurs: _.map(sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: mode,
        duree: duree['@id'],
        fournisseur: data.fournisseur.value,
        statut: paiement,
        commentaire: data.commentaire,
        remise: remise ? parseFloat(remise) : 0,
        type: type === '1' ? true : false
    }
    const request = agent.post('/api/abonnements', postData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Abonnement sauvegarder' }));

            return dispatch({
                type: SAVE_ABONNEMENT,
                payload: response.data
            })
        }
        );
    }

}

export function getSousSecteurs(uri) {
    const request = agent.get(`${uri}/sous_secteurs?pagination=false&props[]=id&props[]=name`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SOUS_SECTEURS,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SOUS_SECTEURS,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getSecteurs() {
    const request = agent.get('/api/secteurs?pagination=false&props[]=id&props[]=name&order[name]=asc');

    return (dispatch) => {
        dispatch({
            type: REQUEST_SECTEURS,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SECTEURS,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getPaiements() {
    const request = agent.get(`/api/paiements`);

    return (dispatch) => {

        return request.then((response) => {
            dispatch({
                type: GET_PAIEMENT,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getOffres() {
    const request = agent.get(`/api/offres`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_OFFRES,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_OFFRES,
                payload: response.data['hydra:member']
            })
        }

        );
    }

}

export function getAbonnement(params) {
    const request = agent.get(`/api/abonnements/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ABONNEMENT,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_ABONNEMENT,
                payload: response.data
            })
        }

        );
    }

}




export function newAbonnement() {
    const data = {
        offre: null,
        commentaire: '',
        sousSecteurs: []
    };

    return {
        type: GET_ABONNEMENT,
        payload: data
    }
}