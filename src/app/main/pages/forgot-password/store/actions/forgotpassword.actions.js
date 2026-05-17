import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';


export const SUCCESS_RESET = '[FORGOT PASSWORD APP] SUCCESS_RESET';
export const REQUEST_RESET = '[FORGOT PASSWORD APP] REQUEST_RESET';
export const ERROR_RESET = '[FORGOT PASSWORD APP] ERROR_RESET';

export function forgotPassword(data, history) {
    return (dispatch) => {
        dispatch({
            type: REQUEST_RESET
        });
        const request = agent.post(`/api/request-forgot`, data);
        return request.then((response) => {
            dispatch({
                type: SUCCESS_RESET,
            });
            history.push('/email-reset')
        }).catch(error => {
            return dispatch({
                type: ERROR_RESET,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    }

}
