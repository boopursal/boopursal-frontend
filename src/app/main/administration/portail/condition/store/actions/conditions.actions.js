import agent from "agent";
import { showMessage } from 'app/store/actions/fuse';

export const REQUEST_CONDITIONS = '[CONDITIONS APP ADMIN] REQUEST CONDITIONS';
export const GET_CONDITIONS = '[CONDITIONS APP ADMIN] GET CONDITIONS';
export const SET_CONDITIONS_SEARCH_TEXT = '[CONDITIONS APP ADMIN] SET CONDITIONS SEARCH TEXT';

export function setSearchText(event)
{
    return {
        type      : SET_CONDITIONS_SEARCH_TEXT,
        searchText: event.target.value
    }
}
export function getConditions() {
    const request = agent.get(`/api/condition_generales`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CONDITIONS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_CONDITIONS,
                payload: response.data
            })
        );
    }

}

export function setConditionsSearchText(event) {
    return {
        type: SET_CONDITIONS_SEARCH_TEXT,
        searchText: event.target.value
    }
}


export function removeCondition(condition) {

    return (dispatch) => {
        const request = agent.delete(condition['@id']);
        dispatch({
            type: REQUEST_CONDITIONS,
        });
        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getConditions()))
        );
    };
}
