
import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';
import agent from 'agent';
import axios from 'axios';
import _ from '@lodash';

export const REQUEST_PRODUIT = '[PRODUIT FOURNISSEUR APP] REQUEST PRODUIT';
export const GET_PRODUIT = '[PRODUIT FOURNISSEUR APP] GET PRODUIT';
export const REQUEST_SAVE = '[PRODUIT FOURNISSEUR APP] REQUEST SAVE';
export const REDIRECT_SUCCESS = '[PRODUIT FOURNISSEUR APP] REDIRECT SUCCESS';


export const SAVE_PRODUIT = '[PRODUIT FOURNISSEUR APP] SAVE PRODUIT';
export const SAVE_ERROR = '[PRODUIT FOURNISSEUR APP] SAVE ERROR';

export const REQUEST_SOUS_SECTEUR = '[PRODUIT FOURNISSEUR APP] REQUEST SOUS_SECTEUR';
export const GET_SOUS_SECTEUR = '[PRODUIT FOURNISSEUR APP] GET SOUS SECTEUR';

export const REQUEST_SECTEUR = '[PRODUIT FOURNISSEUR APP] REQUEST SECTEUR';
export const GET_SECTEUR = '[PRODUIT FOURNISSEUR APP] GET SECTEUR';

export const REQUEST_CATEGORIE = '[PRODUIT FOURNISSEUR APP] REQUEST CATEGORIE';
export const GET_CATEGORIE = '[PRODUIT FOURNISSEUR APP] GET CATEGORIE';


export const UPLOAD_ATTACHEMENT = '[PRODUIT FOURNISSEUR APP] UPLOAD ATTACHEMENT';
export const UPLOAD_REQUEST = '[PRODUIT FOURNISSEUR APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[PRODUIT FOURNISSEUR APP] UPLOAD ERROR';


export const UPLOAD_FICHE_ATTACHEMENT = '[PRODUIT FOURNISSEUR APP] UPLOAD_FICHE_ATTACHEMENT';
export const UPLOAD_FICHE_REQUEST = '[PRODUIT FOURNISSEUR APP] UPLOAD_FICHE_REQUEST';
export const UPLOAD_FICHE_ERROR = '[PRODUIT FOURNISSEUR APP] UPLOAD_FICHE_ERROR';


export const REQUEST_DELETE = '[PRODUIT FOURNISSEUR APP] REQUEST DELETE';
export const DELETE_SUCCESS = '[PRODUIT FOURNISSEUR APP] DELETE SUCCESS';
export const ERROR_DELETE = '[PRODUIT FOURNISSEUR APP] ERROR DELETE';


export const CLEAN_UP_PRODUCT = '[PRODUIT FOURNISSEUR APP] CLEAN_UP_PRODUCT';
export const CLEAN_ERROR = '[PRODUIT FOURNISSEUR APP] CLEAN_ERROR';
export const CLEAN_IMAGE = '[PRODUIT FOURNISSEUR APP] CLEAN_IMAGE';
export const CLEAN_DELETE_IMAGE = '[PRODUIT FOURNISSEUR APP] CLEAN_DELETE_IMAGE';

export const REQUEST_FOURNISSEUR = '[PRODUIT FOURNISSEUR APP] REQUEST_FOURNISSEUR';
export const GET_FOURNISSEUR = '[PRODUIT FOURNISSEUR APP] GET_FOURNISSEUR';

export const REQUEST_VIDEO = '[PRODUIT FOURNISSEUR APP] REQUEST_VIDEO';
export const GET_VIDEO = '[PRODUIT FOURNISSEUR APP] GET_VIDEO';

export const REQUEST_CHECK = '[PRODUIT FOURNISSEUR APP] REQUEST_CHECK';
export const GET_CHECK = '[PRODUIT FOURNISSEUR APP] GET_CHECK';



export function getActivitesAbonnementByFournisseur(params) {
    const request = agent.get(`/api/fournisseurs/${params}/abonnements?exists[expired]=true&order[expired]=desc`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_FOURNISSEUR,
                payload: response.data['hydra:member'][0]
            })
        }

        );
    }

}

export function getVideoYoutubeById(idVideo) {
    const request = axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${idVideo}&key=AIzaSyBvpeIK_1hzKDwawG1uRVmbHdE6n7tcRr4`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_VIDEO,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_VIDEO,
                payload: response.data ? (response.data.items.length > 0 ? 1 : 2) : 2
            })
        }

        );
    }

}

export function getSecteurs() {
    const request = agent.get('/api/secteurs?pagination=false&props[]=id&props[]=name');

    return (dispatch) => {
        dispatch({
            type: REQUEST_SECTEUR,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SECTEUR,
                payload: response.data
            })
        });

    }

}

export function getSousSecteurs(url) {
    const request = agent.get(`${url}/sous_secteurs?pagination=false&props[]=id&props[]=name`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SOUS_SECTEUR,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SOUS_SECTEUR,
                payload: response.data
            })
        });

    }

}
export function getCategories(url) {
    const request = agent.get(`${url}/categories?pagination=false&props[]=id&props[]=name`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CATEGORIE,
        });
        return request.then((response) => {
            dispatch({
                type: GET_CATEGORIE,
                payload: response.data
            })
        });

    }

}


export function checkIfActiviteUsedByCollegue(activite) {


    const request = agent.get(`api/check_activite_used?activite=${activite}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CHECK,
        });
        return request.then((response) => {
            dispatch({
                type: GET_CHECK,
                payload: response.data
            })
        });

    }

}

export function getProduit(params) {
    const request = agent.get(`/api/produits/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_PRODUIT,
        });
        return request.then((response) => {
            dispatch({
                type: GET_PRODUIT,
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

export function saveProduit(data, secteur, sousSecteur, categorie, abonnee) {

    const postData = {
        ...data,
        pu: data.pu ? parseFloat(data.pu) : 0,
        secteur: secteur && secteur.value,
        sousSecteurs: sousSecteur && sousSecteur.value,
        categorie: categorie && categorie.value,
        images: data.images && _.map(data.images, function (value, key) {
            return value['@id'];
        }),
        ficheTechnique: data.ficheTechnique && data.ficheTechnique["@id"],
        featuredImageId: data.featuredImageId && data.featuredImageId["@id"],
        free: !abonnee && true
    }

    const request = agent.post('/api/produits', postData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Produit / Service bien enregistré' }));

            return dispatch({
                type: SAVE_PRODUIT,
                payload: response.data
            })
        }
        ).catch((error) => {
            const errPayload = FuseUtils.parseApiErrors(error); console.error('ERREUR SERVEUR !!!', errPayload.Erreur || errPayload); dispatch({ type: SAVE_ERROR, payload: errPayload }); dispatch(showMessage({ message: errPayload.Erreur || 'Erreur inconnue', variant: 'error', autoHideDuration: 10000 }));
        });
    }

}

export function putProduit(data, url, secteur, sousSecteur, categorie) {

    const putData = {
        ...data,
        pu: data.pu ? parseFloat(data.pu) : 0,
        secteur: secteur && secteur.value,
        sousSecteurs: sousSecteur && sousSecteur.value,
        categorie: categorie && categorie.value,
        images: data.images && _.map(data.images, function (value, key) {
            return value['@id'];
        }),
        ficheTechnique: data.ficheTechnique && data.ficheTechnique["@id"],
        featuredImageId: data.featuredImageId && data.featuredImageId["@id"],
    }

    const request = agent.put(`/api/produits/${url}`, putData);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Produit / Service bien modifié' }));

            return dispatch({
                type: SAVE_PRODUIT,
                payload: response.data
            })
        }
        ).catch((error) => {
            const errPayload = FuseUtils.parseApiErrors(error); console.error('ERREUR SERVEUR !!!', errPayload.Erreur || errPayload); dispatch({ type: SAVE_ERROR, payload: errPayload }); dispatch(showMessage({ message: errPayload.Erreur || 'Erreur inconnue', variant: 'error', autoHideDuration: 10000 }));
        });
    }

}

export function deleteMedia(media) {
    const request = agent.delete(media['@id']);

    return (dispatch) => {
        dispatch({
            type: REQUEST_DELETE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Document supprimé' }));

            return dispatch({
                type: DELETE_SUCCESS,
                id: media
            })
        }
        ).catch((error) => {
            dispatch({
                type: ERROR_DELETE,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}





export function uploadImage(file) {

    return (dispatch, getState) => {

        const formData = new FormData();
        formData.append("file", file);

        const request = agent.post('/api/image_produits', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: UPLOAD_REQUEST
        });
        return request.then((response) =>

            Promise.all([
                (response),
                dispatch({
                    type: UPLOAD_ATTACHEMENT,
                    payload: response.data

                }),
                dispatch(showMessage({
                    message: 'Document téléchargé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).catch((error) => {
            dispatch({
                type: UPLOAD_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        }

        );
    };
}


export function uploadFiche(file) {

    return (dispatch, getState) => {

        const formData = new FormData();
        formData.append("file", file);

        const request = agent.post('/api/fiches', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: UPLOAD_FICHE_REQUEST
        });
        return request.then((response) =>

            Promise.all([
                (response),
                dispatch({
                    type: UPLOAD_FICHE_ATTACHEMENT,
                    payload: response.data

                }),
                dispatch(showMessage({
                    message: 'Document téléchargé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).catch((error) => {
            dispatch({
                type: UPLOAD_FICHE_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        }

        );
    };
}


export function newProduit() {
    const data = {
        reference: '',
        description: '',
        secteur: null,
        sousSecteurs: null,
        categorie: null,
        pu: 0,
        created: null,
        images: [],
        ficheTechnique: null,
    };

    return {
        type: GET_PRODUIT,
        payload: data
    }
}


export function cleanError() {

    return (dispatch) => dispatch({
        type: CLEAN_ERROR,
    });
}

export function cleanUpProduct() {

    return (dispatch) => dispatch({
        type: CLEAN_UP_PRODUCT,
    });
}
export function cleanImage() {

    return (dispatch) => dispatch({
        type: CLEAN_IMAGE,
    });
}

export function cleanDeleteImage() {

    return (dispatch) => dispatch({
        type: CLEAN_DELETE_IMAGE,
    });
}



