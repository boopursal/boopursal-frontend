import agent from 'agent';

export const GET_WIDGET7 = '[DASHBOARD ADMIN] GET WIDGET 7';
export const REQUEST_WIDGET7 = '[DASHBOARD ADMIN] REQUEST WIDGET 7';
export const CLEAN_UP_WIDGET7 = '[DASHBOARD ADMIN] CLEAN_UP_WIDGET7';

export function cleanUpWidget7() {
    return (dispatch) => dispatch({
        type: CLEAN_UP_WIDGET7,
    });
}

export function getWidgetJetons(currentRange) {
    const request = agent.get(`/api/widget7?year=${currentRange}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGET7,
        });
        return request.then((response) =>
            dispatch({
                type: GET_WIDGET7,
                payload: response.data
            })
        );
    }
}
export function getWidgetPack(currentRange) {
    const request = agent.get(`/api/widget3?year=${currentRange}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGET7,
        });
        return request.then((response) =>
            dispatch({
                type: GET_WIDGET7,
                payload: response.data
            })
        );
    }
}
