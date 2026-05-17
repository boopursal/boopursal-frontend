import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';

export const REQUEST_FAQ = '[FAQ APP APP] REQUEST FAQ';
export const REQUEST_CATEGORIES = '[FAQ APP APP] REQUEST CATEGORIES';
export const GET_FAQ = '[FAQ APP APP] GET FAQ';
export const GET_CATEGORIES = '[FAQ APP APP] GET CATEGORIES';
export const SAVE_ERROR = '[FAQ APP APP] SAVE ERROR';
export const SAVE_FAQ = '[FAQ APP APP] UPDATE FAQ';
export const REQUEST_SAVE_FAQ = '[FAQ APP APP] REQUEST SAVE_FAQ';
export const CLEAN_UP = '[FAQ APP APP] CLEAN_UP';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getFaq(id_faq) {
    const request = agent.get(`/api/faqs/${id_faq}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FAQ,
        });
        return request.then((response) => {

            dispatch({
                type: GET_FAQ,
                payload: response.data
            })
        });

    }

}

export function getCategoriess() {
    const request = agent.get('/api/faq_categories?props[]=id&props[]=name&props[]=icon');

    return (dispatch) => {
        dispatch({
            type: REQUEST_CATEGORIES,
        });
        return request.then((response) => {

            dispatch({
                type: GET_CATEGORIES,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function updateFaq(data, history) {
    if (data.categorie)
        data.categorie = data.categorie.value;
    return (dispatch, getState) => {

        const request = agent.put(data['@id'], data);
        dispatch({
            type: REQUEST_SAVE_FAQ,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: SAVE_FAQ,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                })),
                history.push('/admin/faqs')
            ])
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    };

}

export function saveFaq(data, history) {

    if (data.categorie)
        data.categorie = data.categorie.value;
    const request = agent.post('/api/faqs', data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE_FAQ,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Faq sauvegardé' }));
            dispatch({
                type: SAVE_FAQ,
                payload: response.data
            })
            history.push('/admin/faqs');


        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}


export function newFaq() {
    const data = {
        question: '',
        reponse: '',
    };

    return {
        type: GET_FAQ,
        payload: data
    }
}
