import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";
import moment from 'moment';

export const REQUEST_DEMANDES = '[DEMANDES APP] REQUEST DEMANDES';
export const REMOVE_DEMANDE = '[DEMANDES APP] REMOVE DEMANDES';
export const STATUT_DEMANDE = '[DEMANDES APP] STATUT DEMANDES';
export const SET_PARAMETRES_DATA = '[DEMANDES APP] SET PARAMETRES DATA';

export const CLEAN_UP = '[DEMANDES APP] CLEAN_UP';
export const GET_DEMANDES = '[USERS APP] GET DEMANDES';
export const SET_DEMANDES_SEARCH_TEXT = '[USERS APP] SET DEMANDES SEARCH TEXT';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}


export function getDemandes(id_acheteur, parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.forEach(function (item, i) {
            if (item.value) {
                if (item.id === 'created' || item.id === 'dateExpiration') {
                    search += '&' + item.id + '[after]=' + item.value
                } else if (item.id === 'statut') {
                    if (item.value === '0') {
                        search += `&statut=0&dateExpiration[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '1') {
                        search += `&statut=1&dateExpiration[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '2') {
                        search += `&statut=2&dateExpiration[strictly_after]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                    else if (item.value === '3') {
                        search += `&statut=3`;
                    }
                    else if (item.value === '4') {
                        search += `&dateExpiration[strictly_before]=${moment().format('YYYY-MM-DDTHH:mm:ss')}`;
                    }
                }
                else {
                    search += '&' + item.id + '=' + item.value
                }
            }
        });
    }
    const request = agent.get(`/api/acheteurs/${id_acheteur}/demandes?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_DEMANDES,
        });
        return request.then((response) =>
            dispatch({
                type: GET_DEMANDES,
                payload: response.data
            })
        );
    }

}
export function removeDemande(demande, parametres, id) {

    let Updatedemande = { del: true, reference: demande.reference + '_deleted-' + demande.id }
    return (dispatch, getState) => {


        const request = agent.put(`/api/demande_achats/${demande.id}`, Updatedemande);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_DEMANDE
                }),
                dispatch(showMessage({
                    message: 'Demande bien supprimée!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getDemandes(id, parametres)))
        );
    };
}

export function PublishDemande(demande, active, parametres, id) {

    let Updatedemande = { isPublic: active }
    return (dispatch) => {


        const request = agent.put(`/api/demande_achats/${demande.id}`, Updatedemande);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: STATUT_DEMANDE
                }),
                dispatch(showMessage({
                    message: active ? 'Votre demande est publiée aux publics' : 'Votre demande est privée', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getDemandes(id, parametres)))
        );
    };
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



