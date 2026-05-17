import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";

export const REQUEST_ACTUALITES = '[ACTUALITES APP] REQUEST ACTUALITES';
export const REMOVE_ACTUALITE = '[ACTUALITES APP] REMOVE ACTUALITES';
export const STATUT_ACTUALITE = '[ACTUALITES APP] STATUT ACTUALITES';
export const SET_PARAMETRES_DATA = '[ACTUALITES APP] SET PARAMETRES DATA';

export const CLEAN_UP = '[ACTUALITES APP] CLEAN_UP';
export const GET_ACTUALITES = '[USERS APP] GET ACTUALITES';
export const SET_ACTUALITES_SEARCH_TEXT = '[USERS APP] SET ACTUALITES SEARCH TEXT';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}


export function getActualites(parametres) {
    var description = parametres.description ? `=${parametres.description}` : '';
    const request = agent.get(`/api/actualites?page=${parametres.page}&description${description}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ACTUALITES,
        });
        return request.then((response) =>
            dispatch({
                type: GET_ACTUALITES,
                payload: response.data
            })
        );
    }

}
export function removeActualite(actualite, parametres) {

    return (dispatch) => {
        const request = agent.delete(`/api/actualites/${actualite.id}`);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_ACTUALITE
                }),
                dispatch(showMessage({
                    message: 'Actualite bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getActualites(parametres)))
        );
    };
}

export function PublishActualite(actualite, active, parametres) {

    let Updateactualite = { isActive: active }
    return (dispatch, getState) => {


        const request = agent.put(`/api/actualites/${actualite.id}`, Updateactualite);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: STATUT_ACTUALITE
                }),
                dispatch(showMessage({
                    message: active ? 'Cette actualité est publiée aux publics' : 'Cette actualité est privée', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getActualites(parametres)))
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
        type: SET_ACTUALITES_SEARCH_TEXT,
        searchText: event.target.value
    }
}



