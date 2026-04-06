import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';

export const REQUEST_SECTEUR = '[SECTEUR APP APP] REQUEST SECTEUR';
export const GET_SECTEUR = '[SECTEUR APP APP] GET SECTEUR';
export const SAVE_ERROR = '[SECTEUR APP APP] SAVE ERROR';
export const SAVE_SECTEUR = '[SECTEUR APP APP] UPDATE SECTEUR';
export const REQUEST_SAVE_SECTEUR = '[SECTEUR APP APP] REQUEST SAVE_SECTEUR';
export const UPLOAD_REQUEST = '[SECTEUR APP APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[SECTEUR APP APP] UPLOAD ERROR';
export const UPLOAD_ATTACHEMENT = '[SECTEUR APP APP] UPLOAD ATTACHEMENT';

export const CLEAN_UP = '[SECTEUR APP APP] CLEAN_UP';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}


export function getSecteur(id_secteur) {
    const request = agent.get(`/api/secteurs/${id_secteur}?props[]=name&props[]=id&props[]=image&props[]=del`);

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

export function updateSecteur(data,history) {

    if(data.image)
    data.image = data.image['@id'];

    return (dispatch, getState) => {

        const request = agent.put(data['@id'], data);
        dispatch({
            type: REQUEST_SAVE_SECTEUR,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: SAVE_SECTEUR,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                })),
                history.push('/parametres/secteurs')
            ])
        ).catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                    payload: FuseUtils.parseApiErrors(error)
                });
            });
    };

}

export function saveSecteur(data,history) {
 
    if(data.image)
    data.image = data.image['@id'];

    const request = agent.post('/api/secteurs', data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE_SECTEUR,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Secteur sauvegardé' }));
            dispatch({
                type: SAVE_SECTEUR,
                payload: response.data
            })
            history.push('/parametres/secteurs');


        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}

export function uploadAttachement(file) {

    return (dispatch, getState) => {

        const formData = new FormData();
        formData.append("file", file);

        const request = agent.post('/api/image_secteur', formData, {
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
                    message: 'Image uploaded!', anchorOrigin: {
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

export function newSecteur() {
    const data = {
        name: '',
        image: null,
    };

    return {
        type: GET_SECTEUR,
        payload: data
    }
}