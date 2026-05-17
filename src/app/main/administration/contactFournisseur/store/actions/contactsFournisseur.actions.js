import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";
import * as Actions from '@fuse/components/FuseNavigation/store/actions';

export const REQUEST_CONTACTS = '[CONTACTS FOURNISSEUR APP] REQUEST CONTACTS';
export const REMOVE_CONTACT = '[CONTACTS FOURNISSEUR APP] REMOVE CONTACTS';
export const STATUT_CONTACT = '[CONTACTS FOURNISSEUR APP] STATUT CONTACTS';
export const SET_PARAMETRES_DATA = '[CONTACTS FOURNISSEUR APP] SET PARAMETRES DATA';


export const GET_CONTACTS = '[CONTACTS FOURNISSEUR APP] GET CONTACTS';
export const SET_CONTACTS_SEARCH_TEXT = '[CONTACTS FOURNISSEUR APP] SET CONTACTS SEARCH TEXT';

export function getMessages(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) : (search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/contact_fournisseurs?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CONTACTS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_CONTACTS,
                payload: response.data
            })
        );
    }

}
export function removeMessage(demande, parametres) {

    let Updatedemande = { del: true }
    return (dispatch, getState) => {


        const request = agent.put(`/api/contact_fournisseurs/${demande.id}`, Updatedemande);

        dispatch({
            type: REQUEST_CONTACTS,
        });
        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_CONTACT
                }),
                dispatch(Actions.getCountForBadge('message-fournisseur')),
                dispatch(showMessage({
                    message: 'Message bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getMessages(parametres)))
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
        type: SET_CONTACTS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



