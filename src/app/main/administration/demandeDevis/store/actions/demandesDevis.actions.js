import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";
import * as Actions from '@fuse/components/FuseNavigation/store/actions';
import { getdemandeDevis } from '../../../../portail/index/store/actions';

export const REQUEST_DEMANDES = '[DEMANDES APP] REQUEST DEMANDES';
export const REMOVE_DEMANDE = '[DEMANDES APP] REMOVE DEMANDES';
export const STATUT_DEMANDE = '[DEMANDES APP] STATUT DEMANDES';
export const SET_PARAMETRES_DATA = '[DEMANDES APP] SET PARAMETRES DATA';


export const CLEAN_UP = '[DEMANDES APP] CLEAN_UP';
export const GET_DEMANDES = '[DEMANDES APP] GET DEMANDES';
export const SET_DEMANDES_SEARCH_TEXT = '[DEMANDES APP] SET DEMANDES SEARCH TEXT';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getDemandesNoTraites(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) : (search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/demande_devis?page=${parametres.page}&del=0&statut=false${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

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

export function getDemandesTraites(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) : (search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/demande_devis?page=${parametres.page}&del=0&statut=1${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

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
export function getDemandesDeleted(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) : (search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/demande_devis?page=${parametres.page}&del=1${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

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

export function removeDemande(demande, parametres, del = true) {

    let Updatedemande = { del }
    return (dispatch, getState) => {


        const request = agent.put(`/api/demande_devis/${demande.id}`, Updatedemande);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_DEMANDE
                }),
                dispatch(Actions.getCountForBadge('demandes-devis')),
                del === false ?
                    dispatch(showMessage({
                        message: 'Demande bien recupérée!', anchorOrigin: {
                            vertical: 'top',//top bottom
                            horizontal: 'right'//left center right
                        },
                        variant: 'success'
                    })) :
                    dispatch(showMessage({
                        message: 'Demande bien supprimée!', anchorOrigin: {
                            vertical: 'top',//top bottom
                            horizontal: 'right'//left center right
                        },
                        variant: 'success'
                    }))

            ]).then(() => del === false ? dispatch(getDemandesDeleted(parametres)) : dispatch(getDemandesNoTraites(parametres)))
        );
    };
}



export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}

export function setSearchText(event) {
    return {
        type: SET_DEMANDES_SEARCH_TEXT,
        searchText: event.target.value
    }
}



