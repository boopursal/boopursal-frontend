import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import {showMessage} from 'app/store/actions/fuse';


export const SUCCESS_RESET_PASS = '[RESET PASSWORD APP] SUCCESS_RESET';
export const REQUEST_RESET_PASS = '[RESET PASSWORD APP] REQUEST_RESET';
export const ERROR_RESET_PASS = '[RESET PASSWORD APP] ERROR_RESET';

export function resetPassword(data,token, history) {
    let postData={
        password: data.password,
        token : token
    }
    return (dispatch) => {
        dispatch({
            type: REQUEST_RESET_PASS
        });
        const request = agent.post(`/api/reset-password`, postData);
        return request.then((response) => {
            dispatch({
                type: SUCCESS_RESET_PASS,
            });
            dispatch(showMessage({message: 'Votre mot de passe à été changé avec succès',anchorOrigin: {
                vertical  : 'top',//top bottom
                horizontal: 'right'//left center right
            },
            variant: 'success'}))
            history.push('/login')
        }).catch(error => {
            return dispatch({
                type: ERROR_RESET_PASS,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}
