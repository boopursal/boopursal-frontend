import agent from "agent";
import moment from 'moment';

export const REQUEST_DEMANDES = '[DEMANDES FOURNISSEUR APP] REQUEST DEMANDES';
export const SET_PARAMETRES_DATA = '[DEMANDES FOURNISSEUR APP] SET PARAMETRES DATA';


export const GET_DEMANDES = '[DEMANDES FOURNISSEUR APP] GET DEMANDES';
export const ERRORS = '[DEMANDES FOURNISSEUR APP] ERRORS';
export const ERROR_404 = '[DEMANDES FOURNISSEUR APP] ERROR_404';
export const SET_DEMANDES_SEARCH_TEXT = '[DEMANDES FOURNISSEUR APP] SET DEMANDES SEARCH TEXT';

export function getDemandes(parametres, id_frs) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.forEach(function (item, i) {
            if (item.value) {
                if (item.id === 'created' || item.id === 'dateExpiration') {
                    search += '&' + item.id + '[after]=' + item.value
                } else if (item.id === 'statut') {
                    if (item.value === '1') {
                        search += `&statut=1&dateExpiration[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '3') {
                        search += `&statut=3}`;
                    }
                    else if (item.value === '4') {
                        search += `&dateExpiration[strictly_before]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                }
                else if (item.id === 'historiques') {
                    if (item.value === '1') {
                        search += `&historiques.fournisseur.id=${id_frs}`;
                    }
                    else if (item.value === '2') {
                        search += `&historiques.fournisseur=${id_frs}`;
                    }

                }
                else {
                    search += '&' + item.id + '=' + item.value
                }
            }
        });
    }
    const request = agent.get(`/api/demande_achats/fournisseur?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_DEMANDES,
        });
        return request.then((response) =>
            dispatch({
                type: GET_DEMANDES,
                payload: response.data
            })
        ).catch((error) => {
            if (error.response.status === 404) {
                dispatch({
                    type: ERROR_404,
                });
            }
            dispatch({
                type: ERRORS,
            });
        });
    }

}


export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}

export function setDemandesSearchText(event) {
    return {
        type: SET_DEMANDES_SEARCH_TEXT,
        searchText: event.target.value
    }
}



