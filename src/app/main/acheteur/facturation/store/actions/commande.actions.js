
import agent from 'agent';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';
import { FuseUtils } from '@fuse';


export const REQUEST_COMMANDE = '[COMMANDE AB FRS APP] REQUEST COMMANDE';
export const GET_COMMANDE = '[COMMANDE AB FRS APP] GET COMMANDE';

export const REQUEST_SUGGESTION = '[COMMANDE AB FRS APP] REQUEST_SUGGESTION';
export const REQUEST_SOUS_SECTEURS = '[COMMANDE AB FRS APP] REQUEST_SOUS_SECTEURS';
export const GET_SOUS_SECTEURS = '[COMMANDE AB FRS APP] GET SOUS_SECTEURS';

export const REQUEST_SECTEURS = '[COMMANDE AB FRS APP] REQUEST SECTEURS';
export const GET_SECTEURS = '[COMMANDE AB FRS APP] GET SECTEURS';

export const REQUEST_FOURNISSEUR = '[COMMANDE AB FRS APP] REQUEST FOURNISSEUR';
export const GET_FOURNISSEUR = '[COMMANDE AB FRS APP] GET FOURNISSEUR';

export const REQUEST_OFFRES = '[COMMANDE AB FRS APP] REQUEST OFFRES';
export const GET_OFFRES = '[COMMANDE AB FRS APP] GET OFFRES';

export const REQUEST_DUREE = '[COMMANDE AB FRS APP] REQUEST_DUREE';
export const GET_DUREE = '[COMMANDE AB FRS APP] GET_DUREE';

export const REQUEST_SAVE = '[COMMANDE AB FRS APP] REQUEST SAVE';
export const SAVE_COMMANDE = '[COMMANDE AB FRS APP] SAVE COMMANDE';
export const SAVE_SUGGESTION = '[COMMANDE AB FRS APP] SAVE_SUGGESTION';
export const SAVE_ERROR = '[COMMANDE AB FRS APP] SAVE ERROR';

export const REQUEST_PAIEMENT = '[COMMANDE AB FRS APP] REQUEST_PAIEMENT';
export const GET_PAIEMENT = '[COMMANDE AB FRS APP] GET_PAIEMENT';

export const CLEAN_UP = '[COMMANDE AB FRS APP] CLEAN_UP';

export const OPEN_NEW_COMMANDE_DIALOG = '[COMMANDE AB FRS APP] OPEN NEW COMMANDE DIALOG';
export const CLOSE_NEW_COMMANDE_DIALOG = '[COMMANDE AB FRS APP] CLOSE NEW COMMANDE DIALOG';
export const OPEN_EDIT_COMMANDE_DIALOG = '[COMMANDE AB FRS APP] OPEN EDIT COMMANDE DIALOG';
export const CLOSE_EDIT_COMMANDE_DIALOG = '[COMMANDE AB FRS APP] CLOSE EDIT COMMANDE DIALOG';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function openNewCommandeDialog(offre) {
    return {
        type: OPEN_NEW_COMMANDE_DIALOG,
        data: { offre }
    }
}

export function closeNewCommandeDialog() {
    return {
        type: CLOSE_NEW_COMMANDE_DIALOG
    }
}

export function openEditCommandeDialog(data) {
    return {
        type: OPEN_EDIT_COMMANDE_DIALOG,
        data
    }
}

export function closeEditCommandeDialog() {
    return {
        type: CLOSE_EDIT_COMMANDE_DIALOG
    }
}

export function RenewAbonnementCommande(data) {

    var postData = {
        ...data,
        offre: data.offre['@id'],
        sousSecteurs: _.map(data.sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: data.mode,
        duree: data.duree['@id'],
        currency: data.currency,
        suggestions: data.suggestions
    }
    const request = agent.post('/api/demande_abonnements', postData);


    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {
            return dispatch({
                type: SAVE_COMMANDE,
                payload: response.data
            })
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value + ' ';
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    }

}

export function updateCommande(data) {

    var putData = {
        ...data,
        offre: data.offre['@id'],
        sousSecteurs: _.map(data.sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: data.mode,
        duree: data.duree['@id'],
        currency: data.currency,
        suggestions: data.suggestions
    }
    const request = agent.put(data['@id'], putData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {
            return dispatch({
                type: SAVE_COMMANDE,
                payload: response.data
            })
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value + ' ';
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    }

}

export function saveCommande(data) {

    var postData = {
        offre: data.offre['@id'],
        sousSecteurs: _.map(data.sousSecteurs, function (value, key) {
            return value.value;
        }),
        mode: data.mode,
        duree: data.duree['@id'],
        currency: data.currency,
        suggestions: data.suggestions
    }
    const request = agent.post('/api/demande_abonnements', postData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {
            return dispatch({
                type: SAVE_COMMANDE,
                payload: response.data
            })
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value + ' ';
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    }

}

export function AddSuggestionSecteur(secteur, sousSecteur, id_user) {
    let data = {};
    if (sousSecteur && secteur) {
        data.sousSecteur = sousSecteur;
        data.secteur = secteur;
        data.pageSuggestion = "Demande Offre d'abonnement fournisseur";
        data.user = `/api/fournisseurs/${id_user}`
    }

    else {
        return;
    }
    return (dispatch, getState) => {

        const request = agent.post(`/api/suggestion_secteurs`, data);
        dispatch({
            type: REQUEST_SUGGESTION,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: SAVE_SUGGESTION
                }),
                dispatch(showMessage({
                    message: 'Votre suggestion a bien été enregistrée, un mail vous sera envoyé dès la validation de votre suggestion, nous vous remercions pour votre confiance!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        );
    };

}

export function getFournisseurSousSecteurs(params) {
    const request = agent.get(`/api/fournisseurs/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_FOURNISSEUR,
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
        dispatch({
            type: REQUEST_PAIEMENT,
        });
        return request.then((response) => {
            dispatch({
                type: GET_PAIEMENT,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getDurees() {
    const request = agent.get(`/api/durees`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_DUREE,
        });
        return request.then((response) => {
            dispatch({
                type: GET_DUREE,
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

export function getCommande(id) {
    const request = agent.get(`/api/fournisseurs/${id}/demande_abonnements?itemsPerPage=1&statut=false&order[created]=desc`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_COMMANDE,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_COMMANDE,
                payload: response.data['hydra:member'][0]
            })
        }

        );
    }

}

export function newCommande() {
    const data = {
        offre: null,
        sousSecteurs: []
    };

    return {
        type: GET_COMMANDE,
        payload: data
    }
}






