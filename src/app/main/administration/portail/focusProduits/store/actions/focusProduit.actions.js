
import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';
import agent from 'agent';

export const REQUEST_PRODUIT_SELECTED = '[PRODUIT_SELECTED APP] REQUEST PRODUIT_SELECTED';
export const GET_PRODUIT_SELECTED = '[PRODUIT_SELECTED APP] GET PRODUIT_SELECTED';

export const REQUEST_FOURNISSEUR_SELECTED = '[PRODUIT_SELECTED APP] REQUEST_FOURNISSEUR_SELECTED';
export const GET_FOURNISSEUR_SELECTED = '[PRODUIT_SELECTED APP] GET_FOURNISSEUR_SELECTED';

export const REQUEST_CATEGORIE_SELECTED = '[PRODUIT_SELECTED APP] REQUEST CATEGORIE_SELECTED';
export const GET_CATEGORIE_SELECTED = '[PRODUIT_SELECTED APP] GET CATEGORIE_SELECTED';

export const REQUEST_PRODUCTS_F = '[PRODUIT_SELECTED APP] REQUEST_PRODUCTS_F';
export const GET_PRODUCTS_F = '[PRODUIT_SELECTED APP] GET_PRODUCTS_F';

export const REQUEST_SAVE = '[PRODUIT_SELECTED APP] REQUEST SAVE';
export const REDIRECT_SUCCESS = '[PRODUIT_SELECTED APP] REDIRECT SUCCESS';

export const SAVE_PRODUIT_SELECTED = '[PRODUIT_SELECTED APP] SAVE PRODUIT_SELECTED';
export const SAVE_ERROR = '[PRODUIT_SELECTED APP] SAVE ERROR';





export function getFocusProduit(params) {

    const request = agent.get(`/api/select_produits/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_PRODUIT_SELECTED,
        });
        return request.then((response) => {
            dispatch({
                type: GET_PRODUIT_SELECTED,
                payload: response.data
            })
        }

        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error),

            })
        });
    }

}

export function getFournisseurHasProducts() {

    const request = agent.get(`/api/fournisseurselected`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR_SELECTED,
        });
        return request.then((response) => {
            dispatch({
                type: GET_FOURNISSEUR_SELECTED,
                payload: response.data['hydra:member'] !== undefined ? response.data['hydra:member'] : response.data
            })
        }

        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error),

            })
        });
    }

}


export function GetAllCategorieByFournisseur(id_fournisseur) {

    const request = agent.get(`/api/fournisseurcategories?id=${id_fournisseur}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CATEGORIE_SELECTED,
        });
        return request.then((response) => {
            dispatch({
                type: GET_CATEGORIE_SELECTED,
                payload: response.data['hydra:member'] !== undefined ? response.data['hydra:member'] : response.data
            })
        }

        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error),

            })
        });
    }

}

export function GetProductsByCategorieByFournisseur(id_fournisseur, id_categorie) {

    let urlStr = `/api/produits?fournisseur=${id_fournisseur}&is_valid=true&del=false`;
    if (id_categorie) {
        urlStr += `&categorie=${id_categorie}`;
    }
    const request = agent.get(urlStr);

    return (dispatch) => {
        dispatch({
            type: REQUEST_PRODUCTS_F,
        });
        return request.then((response) => {
            dispatch({
                type: GET_PRODUCTS_F,
                payload: response.data['hydra:member']
            })
        }

        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error),

            })
        });
    }

}


export function putFocusProduit(produit, url) {


    const request = agent.put(url, { 'produit': produit });

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Succès' }));
            return dispatch({
                type: SAVE_PRODUIT_SELECTED,
                payload: response.data
            })
        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }
}
export function toggleFocusProduit(produitId) {
    const request = agent.put(`/api/toggle_focus/${produitId}`);

    return (dispatch) => {
        dispatch({ type: REQUEST_SAVE });
        return request.then((response) => {
            if (response.data.error) {
                dispatch(showMessage({ message: 'Erreur: Impossible de modifier le slot.' }));
            } else {
                dispatch(showMessage({ message: response.data.action === 'added' ? '✅ Produit mis en vedette' : '❌ Produit retiré' }));
            }
            dispatch({
                type: SAVE_PRODUIT_SELECTED,
                payload: response.data
            });
            return response;
        }).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
            return error;
        });
    }
}
