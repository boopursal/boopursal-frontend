import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";

export const REQUEST_FOURNISSEURS = '[FOURNISSEURS ADMIN APP] REQUEST FOURNISSEURS';
export const SET_PARAMETRES_DATA = '[FOURNISSEURS ADMIN APP] SET PARAMETRES DATA';
export const GET_FOURNISSEURS = '[FOURNISSEURS ADMIN APP] GET FOURNISSEURS';
export const SET_FOURNISSEURS_SEARCH_TEXT = '[FOURNISSEURS ADMIN APP] SET FOURNISSEURS SEARCH TEXT';

export function getFournisseurs(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ?
                    (search += '&' + item.id + '[after]=' + item.value)
                    :
                    item.id === 'step' ?
                        (search += item.value === '-1' ?
                            `&${item.id}=1&isactif=false` :
                            search += item.value === '1' ? `&${item.id}=${item.value}&isactif=true` : `&${item.id}=${item.value}`)
                        :
                        (search += `&${item.id}=${item.value}`))
        ));
    }
    const request = agent.get(`/api/fournisseurs?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEURS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_FOURNISSEURS,
                payload: response.data
            })
        );
    }

}
export function activeAccount(fournisseur, active, parametres) {

    let Updatefournisseur = { isactif: active }
    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEURS,
        });
        const request = agent.put(fournisseur['@id'], Updatefournisseur);
        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Statut modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getFournisseurs(parametres)))
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
        type: SET_FOURNISSEURS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



