import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";
import * as Actions from '@fuse/components/FuseNavigation/store/actions';

export const REQUEST_CHILDS = '[CHILD FOURNISSEUR ADMIN APP] REQUEST CHILDS';
export const GET_CHILDS = '[CHILD FOURNISSEUR ADMIN APP] GET CHILD';
export const REQUEST_EDIT = '[CHILD FOURNISSEUR ADMIN APP] REQUEST EDIT';
export const EDITED_FRS = '[CHILD FOURNISSEUR ADMIN APP] EDITED FRS';
export const SET_SEARCH_TEXT = '[CHILD FOURNISSEUR ADMIN APP] SET SEARCH TEXT';

export function setSearchText(event) {
    return {
        type: SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function getChilds(id) {
    const request = agent.get(`/api/fournisseur_provisoires?type=0`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CHILDS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_CHILDS,
                payload: response.data
            })
        );
    }

}
export function removeTentative(tentative, user) {

    return (dispatch) => {
        dispatch({
            type: REQUEST_EDIT,
        });
        const request = agent.delete(`/api/fournisseur_provisoires/${tentative.id}`);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: EDITED_FRS
                }),
                dispatch(showMessage({
                    message: 'Bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
                .then(() => dispatch(getChilds(user.id)))
                .then(() => dispatch(Actions.getCountForBadge('fournisseurs-provisoire')))
                .then(() => dispatch(Actions.getCountForBadge('fournisseurs-collaps')))
        );
    };
}








