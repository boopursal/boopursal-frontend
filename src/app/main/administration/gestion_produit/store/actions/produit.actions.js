
import { FuseUtils } from '@fuse';
import { showMessage } from 'app/store/actions/fuse';
import axios from 'axios';
import agent from 'agent';
import _ from '@lodash';
import * as Actions from '@fuse/components/FuseNavigation/store/actions';

export const REQUEST_PRODUIT = '[PRODUIT APP] REQUEST PRODUIT';
export const GET_PRODUIT = '[PRODUIT APP] GET PRODUIT';
export const REQUEST_SAVE = '[PRODUIT APP] REQUEST SAVE';
export const REDIRECT_SUCCESS = '[PRODUIT APP] REDIRECT SUCCESS';


export const SAVE_PRODUIT = '[PRODUIT APP] SAVE PRODUIT';
export const SAVE_ERROR = '[PRODUIT APP] SAVE ERROR';

export const REQUEST_SOUS_SECTEUR = '[PRODUIT APP] REQUEST SOUS_SECTEUR';
export const GET_SOUS_SECTEUR = '[PRODUIT APP] GET SOUS SECTEUR';

export const REQUEST_SECTEUR = '[PRODUIT APP] REQUEST SECTEUR';
export const GET_SECTEUR = '[PRODUIT APP] GET SECTEUR';


export const REQUEST_ADD_SECTEUR = '[PRODUIT APP] REQUEST ADD SECTEUR';
export const SAVE_ADD_SECTEUR = '[PRODUIT APP] SAVE_ADD_SECTEUR';
export const SAVE_ERROR_ADD_SECTEUR = '[PRODUIT APP] SAVE_ERROR_ADD_SECTEUR';
export const CLEAN_UP_SECTEUR = '[ACHETEURS ADMIN APP] CLEAN_UP_SECTEUR'

export const REQUEST_ADD_SOUS_SECTEUR = '[PRODUIT APP] REQUEST ADD SOUS SECTEUR';
export const SAVE_ADD_SOUS_SECTEUR = '[PRODUIT APP] SAVE ADD SOUS SECTEUR';
export const SAVE_ERROR_ADD_SOUS_SECTEUR = '[PRODUIT APP] SAVE ERROR ADD SOUS SECTEUR';
export const CLEAN_UP_SOUS_SECTEUR = '[ACHETEURS ADMIN APP] CLEAN UP SOUS SECTEUR'

export const REQUEST_ADD_CATEGORIE = '[PRODUIT APP] REQUEST ADD CATEGORIE';
export const SAVE_ADD_CATEGORIE = '[PRODUIT APP] SAVE ADD CATEGORIE';
export const SAVE_ERROR_ADD_CATEGORIE = '[PRODUIT APP] SAVE ERROR ADD CATEGORIE';
export const CLEAN_UP_CATEGORIE = '[ACHETEURS ADMIN APP] CLEAN UP CATEGORIE'

export const REQUEST_CATEGORIE = '[PRODUIT APP] REQUEST CATEGORIE';
export const GET_CATEGORIE = '[PRODUIT APP] GET CATEGORIE';

export const UPLOAD_ATTACHEMENT = '[PRODUIT APP] UPLOAD ATTACHEMENT';
export const UPLOAD_REQUEST = '[PRODUIT APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[PRODUIT APP] UPLOAD ERROR';


export const UPLOAD_FICHE_ATTACHEMENT = '[PRODUIT APP] UPLOAD_FICHE_ATTACHEMENT';
export const UPLOAD_FICHE_REQUEST = '[PRODUIT APP] UPLOAD_FICHE_REQUEST';
export const UPLOAD_FICHE_ERROR = '[PRODUIT APP] UPLOAD_FICHE_ERROR';


export const REQUEST_DELETE = '[PRODUIT APP] REQUEST DELETE';
export const DELETE_SUCCESS = '[PRODUIT APP] DELETE SUCCESS';
export const ERROR_DELETE = '[PRODUIT APP] ERROR DELETE';


export const CLEAN_ERROR = '[PRODUIT APP] CLEAN_ERROR';
export const CLEAN_IMAGE = '[PRODUIT APP] CLEAN_IMAGE';
export const CLEAN_DELETE_IMAGE = '[PRODUIT APP] CLEAN_DELETE_IMAGE';

export const REQUEST_VIDEO = '[PRODUIT APP] REQUEST_VIDEO';
export const GET_VIDEO = '[PRODUIT APP] GET_VIDEO';


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
export function addSecteur(name, produit_id) {

    let data = {
        name,
    }

    const request = agent.post(`/api/secteurs`, data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ADD_SECTEUR,
        });

        return request.then((response) => {
            dispatch(getSecteurs());
            let data = {
                secteur: response.data['@id'],
                autreSecteur: null
            }
            const request2 = agent.put(`/api/produits/${produit_id}`, data);
            return request2.then((response) => {

                dispatch({
                    type: SAVE_ADD_SECTEUR,
                    payload: response.data

                });
            });
        }).catch((error) => {
            dispatch({
                type: SAVE_ERROR_ADD_SECTEUR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }));
        });;

    }

}
export function cleanUpAddedSecteur() {

    return (dispatch) => dispatch({
        type: CLEAN_UP_SECTEUR,
    });
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
export function addSousSecteur(name, secteur, produit_id) {

    let data = {
        name,
        secteur
    }

    const request = agent.post(`/api/sous_secteurs`, data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ADD_SOUS_SECTEUR,
        });

        return request.then((response) => {
            dispatch(getSousSecteurs(secteur));
            let data = {
                sousSecteurs: response.data['@id'],
                autreActivite: null
            }
            const request2 = agent.put(`/api/produits/${produit_id}`, data);
            return request2.then((response) => {

                dispatch({
                    type: SAVE_ADD_SOUS_SECTEUR,
                    payload: response.data

                });
            });
        }).catch((error) => {
            dispatch({
                type: SAVE_ERROR_ADD_SOUS_SECTEUR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }));
        });;

    }

}
export function cleanUpAddedSousSecteur() {

    return (dispatch) => dispatch({
        type: CLEAN_UP_SOUS_SECTEUR,
    });
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
export function addCategorie(name, sousSecteur, produit_id) {

    let data = {
        name,
        sousSecteurs: [sousSecteur]
    }

    const request = agent.post(`/api/categories`, data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ADD_CATEGORIE,
        });

        return request.then((response) => {
            dispatch(getCategories(sousSecteur));
            let data = {
                categorie: response.data['@id'],
                autreProduit: null
            }
            const request2 = agent.put(`/api/produits/${produit_id}`, data);
            return request2.then((response) => {

                dispatch({
                    type: SAVE_ADD_CATEGORIE,
                    payload: response.data

                });
            });
        }).catch((error) => {
            dispatch({
                type: SAVE_ERROR_ADD_CATEGORIE,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }));
        });;

    }

}
export function cleanUpAddedCategorie() {

    return (dispatch) => dispatch({
        type: CLEAN_UP_CATEGORIE,
    });
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

export function saveProduit(data, secteur, sousSecteur, categorie) {
    if (data.pu) {
        data.pu = parseFloat(data.pu);
    }
    data.sousSecteurs = sousSecteur.value;
    data.secteur = secteur.value;

    if (categorie) {
        data.categorie = categorie.value;
    }
    else {
        data.categorie = sousSecteur.value
    }
    data.images = _.map(data.images, function (value, key) {
        return value['@id'];
    });

    if (data.ficheTechnique) {
        data.ficheTechnique = data.ficheTechnique["@id"];
    }

    if (data.featuredImageId) {
        data.featuredImageId = data.featuredImageId["@id"];
    }

    const request = agent.post('/api/produits', data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Produit enregistré' }));

            return dispatch({
                type: SAVE_PRODUIT,
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

export function putProduit(data, url, secteur, sousSecteur, categorie) {

    if (data.pu) {
        data.pu = parseFloat(data.pu);
    }
    data.sousSecteurs = sousSecteur.value;
    data.secteur = secteur.value;

    if (categorie) {
        data.categorie = categorie.value;
    }
    else {
        data.categorie = sousSecteur.value
    }
    data.images = _.map(data.images, function (value, key) {
        return value['@id'];
    });

    if (data.ficheTechnique) {
        data.ficheTechnique = data.ficheTechnique["@id"];
    }

    if (data.featuredImageId) {
        data.featuredImageId = data.featuredImageId["@id"];
    }
    const request = agent.put(`/api/produits/${url}`, data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Produit Modifié' }));
            dispatch(Actions.getCountForBadge('validation_produits'));
            return dispatch({
                type: SAVE_PRODUIT,
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
