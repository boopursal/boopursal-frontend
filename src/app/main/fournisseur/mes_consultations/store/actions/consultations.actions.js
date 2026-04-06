import agent from "agent";
import moment from 'moment';

export const REQUEST_CONSULTATIONS = '[CONSULTATIONS FOURNISSEUR APP] REQUEST CONSULTATIONS';
export const SET_PARAMETRES_DATA = '[CONSULTATIONS FOURNISSEUR APP] SET PARAMETRES DATA';


export const GET_CONSULTATIONS = '[USERS APP] GET CONSULTATIONS';
export const SET_CONSULTATIONS_SEARCH_TEXT = '[USERS APP] SET CONSULTATIONS SEARCH TEXT';

export function getConsultations(parametres, id) {
    //var description = parametres.description ? `=${parametres.description}` : '';
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.forEach(function (item) {
            if (item.value) {
                if (item.id === 'created' || item.id === 'dateExpiration') {
                    search += '&' + item.id + '[after]=' + item.value
                } else if (item.id === 'demande.statut') {
                    if (item.value === '1') {
                        search += `&demande.statut=1&demande.dateExpiration[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '3') {
                        search += `&demande.dateExpiration[strictly_before]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                }
                else {
                    search += '&' + item.id + '=' + item.value
                }
            }
        });
    }
    const request = agent.get(`/api/detail_visites?page=${parametres.page}${search}&fournisseur=${id}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CONSULTATIONS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_CONSULTATIONS,
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

export function setConsultationsSearchText(event) {
    return {
        type: SET_CONSULTATIONS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



