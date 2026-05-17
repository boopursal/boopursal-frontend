import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';

export const REQUEST_CONDITION = '[CONDITION APP APP] REQUEST CONDITION';
export const REQUEST_CATEGORIES = '[CONDITION APP APP] REQUEST CATEGORIES';
export const GET_CONDITION = '[CONDITION APP APP] GET CONDITION';
export const GET_CATEGORIES = '[CONDITION APP APP] GET CATEGORIES';
export const SAVE_ERROR = '[CONDITION APP APP] SAVE ERROR';
export const SAVE_CONDITION = '[CONDITION APP APP] UPDATE CONDITION';
export const REQUEST_SAVE_CONDITION = '[CONDITION APP APP] REQUEST SAVE_CONDITION';
export const CLEAN_UP = '[CONDITION APP APP] CLEAN_UP';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getCondition(id_condition) {
    const request = agent.get(`/api/condition_generales/${id_condition}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CONDITION,
        });
        return request.then((response) => {

            dispatch({
                type: GET_CONDITION,
                payload: response.data
            })
        });

    }

}


export function updateCondition(data, history) {

    return (dispatch, getState) => {

        const request = agent.put(data['@id'], data);
        dispatch({
            type: REQUEST_SAVE_CONDITION,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: SAVE_CONDITION,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                })),
                history.push('/admin/conditions')
            ])
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    };

}

export function saveCondition(data, history) {


    const request = agent.post('/api/condition_generales', data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE_CONDITION,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Condition sauvegardé' }));
            dispatch({
                type: SAVE_CONDITION,
                payload: response.data
            })
            history.push('/admin/conditions');


        }
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}


export function newCondition() {
    const data = {
        titre: '',
        contenu: '',
    };

    return {
        type: GET_CONDITION,
        payload: data
    }
}
