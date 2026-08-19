import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";

export const REQUEST_ACHETEURS = '[ACHETEURS ADMIN APP] REQUEST ACHETEURS';
export const SET_PARAMETRES_DATA = '[ACHETEURS ADMIN APP] SET PARAMETRES DATA';
export const GET_ACHETEURS = '[ACHETEURS ADMIN APP] GET ACHETEURS';
export const DELETE_ACHETEUR = '[ACHETEURS ADMIN APP] DELETE ACHETEUR';
export const OPEN_NEW_ACHETEURS_DIALOG = '[ACHETEURS ADMIN APP] OPEN NEW ACHETEURS DIALOG';
export const SET_ACHETEURS_SEARCH_TEXT = '[ACHETEURS ADMIN APP] SET ACHETEURS SEARCH TEXT';


export function openNewAcheteursDialog() {
    return {
        type: OPEN_NEW_ACHETEURS_DIALOG
    }
}
export function getAcheteurs(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) :(search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/acheteurs?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ACHETEURS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_ACHETEURS,
                payload: response.data
            })
        );
    }

}
export function activeAccount(acheteur, active, parametres) {

    let Updateacheteur = { isactif: active }
    return (dispatch) => {
        dispatch({
            type: REQUEST_ACHETEURS,
        });
        const request = agent.put(acheteur['@id'], Updateacheteur);
        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Statut modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getAcheteurs(parametres)))
        );
    };
}

export function deleteAcheteur(id, parametres) {
    return (dispatch) => {
        const request = agent.delete(`/api/acheteurs/${id}`);
        return request.then(() =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Acheteur supprimé avec succès!',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getAcheteurs(parametres)))
        ).catch(() => {
            dispatch(showMessage({
                message: 'Erreur lors de la suppression',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'error'
            }));
        });
    };
}

export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        // On crée une copie pour que Redux détecte bien le changement
        parametres: {
            ...parametres,
            filter: { ...parametres.filter },
            search: [...(parametres.search || [])]
        }
    }
}

export function setSearchText(event) {
    return {
        type: SET_ACHETEURS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



