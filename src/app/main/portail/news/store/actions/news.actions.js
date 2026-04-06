import agent from "agent";
import _ from '@lodash';

export const CLEAN_UP = '[NEWS PORTAIL APP] CLEAN_UP';
export const REQUEST_NEWS = '[NEWS PORTAIL APP] REQUEST_NEWS';
export const GET_NEWS = '[NEWS PORTAIL APP] GET_NEWS';
export const SET_PARAMETRES_DATA = '[NEWS PORTAIL APP] SET PARAMETRES DATA';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getActualites(parametres) {
    let order = _.split(parametres.filter.id, '-');
    var q = parametres.titre ? `&q=${parametres.titre}` : '';
    const request = agent.get(`/api/actualites?page=${parametres.page}&itemsPerPage=${parametres.itemsPerPage}&isActive=true${q}&order[${order[0]}]=${order[1]}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_NEWS,
        });

        return request.then((response) => {

            dispatch({
                type: GET_NEWS,
                payload: response.data
            })

        }

        );
    }

}

export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}