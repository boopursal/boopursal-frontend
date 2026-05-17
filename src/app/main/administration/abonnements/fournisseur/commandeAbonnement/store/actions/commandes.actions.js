import agent from "agent";

export const REQUEST_COMMANDESAB = '[COMMANDES APP] REQUEST COMMANDESAB';
export const SET_PARAMETRES_DATA = '[COMMANDES APP] SET PARAMETRES DATA';


export const GET_COMMANDESAB = '[COMMANDES APP] GET COMMANDESAB';
export const SET_COMMANDES_SEARCH_TEXT = '[COMMANDES APP] SET COMMANDES SEARCH TEXT';
export const CLEAN_UP = '[COMMANDES APP] CLEAN_UP';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getCommandesAb(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) : (search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/demande_abonnements?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_COMMANDESAB,
        });
        return request.then((response) =>
            dispatch({
                type: GET_COMMANDESAB,
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

export function setSearchText(event) {
    return {
        type: SET_COMMANDES_SEARCH_TEXT,
        searchText: event.target.value
    }
}



