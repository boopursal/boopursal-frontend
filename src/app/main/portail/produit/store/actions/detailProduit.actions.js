import agent from "agent";
import { showMessage } from 'app/store/actions/fuse';
import { FuseUtils } from '@fuse';

export const CLEAN_UP = '[DETAIL PRODUIT APP] CLEAN_UP';
export const REQUEST_PRODUIT = '[DETAIL PRODUIT APP] REQUEST_PRODUIT';
export const REQUEST_PRODUITS_SIMILAIRES = '[DETAIL PRODUIT APP] REQUEST_PRODUITS_SIMILAIRES';
export const GET_PRODUIT = '[DETAIL PRODUIT APP] GET_PRODUIT';
export const GET_PRODUITS_SIMILAIRES = '[DETAIL PRODUIT APP] GET_PRODUITS_SIMILAIRES';
export const OPEN_NEW_DEMANDE_DEVIS_DIALOG = '[DETAIL PRODUIT APP] OPEN NEW DEMANDE_DEVIS DIALOG';
export const CLOSE_NEW_DEMANDE_DEVIS_DIALOG = '[DETAIL PRODUIT APP] CLOSE NEW DEMANDE_DEVIS DIALOG';

export const REQUEST_SAVE = '[DETAIL PRODUIT APP] REQUEST SAVE';
export const SAVE_DEMANDE_DEVIS = '[DETAIL PRODUIT APP] SAVE DEMANDE_DEVIS';
export const SAVE_ERROR = '[DETAIL PRODUIT APP] SAVE ERROR';
export const SAVE_ERROR_GET = '[DETAIL PRODUIT APP] SAVE ERROR GET';
export const REQUEST_UPDATE_PRODUIT = '[DETAIL PRODUIT APP] REQUEST_UPDATE_PRODUIT';
export const GET_UPDATE_PRODUIT = '[DETAIL PRODUIT APP] GET_UPDATE_PRODUIT';

export const CLEAN_ERROR = '[DETAIL PRODUIT APP] CLEAN_ERROR';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}
export function cleanError() {

    return (dispatch) => dispatch({
        type: CLEAN_ERROR,
    });
}

export function getProduit(id) {
    const request = agent.get(`/api/produits/${id}?isValid=true`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_PRODUIT,
        });
        dispatch({
            type: REQUEST_PRODUITS_SIMILAIRES,
        });
        return request.then((response) => {

            dispatch({
                type: GET_PRODUIT,
                payload: response.data
            })
            if (response.data) {
                const request2 = agent.get(`/api/produits?isValid=true&categorie=${response.data.categorie['@id']}`);
                return request2.then((response) =>
                    dispatch({
                        type: GET_PRODUITS_SIMILAIRES,
                        payload: response.data['hydra:member']
                    })
                );
            }

        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR_GET,
            })
        });
    }

}

export function updateVuPhoneProduit(id) {
    const request = agent.put(`/api/produits/${id}/phone_vu`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_UPDATE_PRODUIT,
        });
        return request.then((response) => {

            dispatch({
                type: GET_UPDATE_PRODUIT,
                payload: response.data
            })


        }



        );
    }

}


export function openNewDemandeDevisDialog(id) {
    return {
        type: OPEN_NEW_DEMANDE_DEVIS_DIALOG,
        id
    }
}

export function closeNewDemandeDevisDialog() {
    return {
        type: CLOSE_NEW_DEMANDE_DEVIS_DIALOG
    }
}

export function addDemandeDevis(data, produit) {

    if (data.quantity) {
        data.quantity = parseInt(data.quantity)
    }
    data.produit = produit;
    const request = agent.post(`/api/demande_devis`, data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({
                message: 'Message bien envoyé', anchorOrigin: {
                    vertical: 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'
            }));
            dispatch({
                type: SAVE_DEMANDE_DEVIS,
            });
            return dispatch(closeNewDemandeDevisDialog())
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}

export function getFile(fiche) {
    const request = agent({
        url: `/fiche_technique/${fiche.id}`,
        method: 'GET',
        responseType: 'blob', // important
    }
    );

    return (dispatch) => {

        return request.then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fiche.url); //or any other extension
            document.body.appendChild(link);
            link.click();
        }
        );
    }

}

