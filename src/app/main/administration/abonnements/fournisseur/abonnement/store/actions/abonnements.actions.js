import agent from "agent";
import moment from 'moment';

export const REQUEST_ABONNEMENTS = '[ABONNEMENTS APP] REQUEST ABONNEMENTS';
export const SET_PARAMETRES_DATA = '[ABONNEMENTS APP] SET PARAMETRES DATA';


export const GET_ABONNEMENTS = '[ABONNEMENTS APP] GET ABONNEMENTS';
export const SET_ABONNEMENTS_SEARCH_TEXT = '[ABONNEMENTS APP] SET ABONNEMENTS SEARCH TEXT';
export const CLEAN_UP = '[ABONNEMENTS APP] CLEAN_UP';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getAbonnements(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.forEach(function (item, i) {
            if (item.value) {
                if (item.id === 'created' || item.id === 'expired') {
                    search += '&' + item.id + '[after]=' + item.value
                } else if (item.id === 'statut') {
                    if (item.value === '0') {
                        search += `&statut=false&expired[exists]=false`;
                    }
                    else if (item.value === '1') {
                        search += `&statut=true&expired[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '2') {
                        search += `&statut=false&expired[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '3') {
                        search += `&expired[strictly_before]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                }
                else {
                    search += '&' + item.id + '=' + item.value
                }
            }
        });
    }
    const request = agent.get(`/api/abonnements?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ABONNEMENTS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_ABONNEMENTS,
                payload: response.data
            })
        );
    }

}


export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}

export function setAbonnementsSearchText(event) {
    return {
        type: SET_ABONNEMENTS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



