import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";

export const REQUEST_PRODUITS = '[PRODUITS APP] REQUEST PRODUITS';
export const REMOVE_PRODUIT = '[PRODUITS APP] REMOVE PRODUITS';
export const STATUT_PRODUIT = '[PRODUITS APP] STATUT PRODUITS';
export const SET_PARAMETRES_DATA = '[PRODUITS APP] SET PARAMETRES DATA';
export const CLEAN_UP = '[PRODUITS APP] CLEAN_UP';


export const GET_PRODUITS = '[PRODUITS APP] GET PRODUITS';
export const SET_PRODUITS_SEARCH_TEXT = '[PRODUITS APP] SET PRODUITS SEARCH TEXT';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getProduits(parametres)
{
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) :(search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/produits?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) =>{
        dispatch({
            type   : REQUEST_PRODUITS,
        });
       return request.then((response) =>
            dispatch({
                type   : GET_PRODUITS,
                payload: response.data
            })
        );
    }
       
}
export function removeProduit(produit,parametres)
{
    
    let Updateproduit = {del :true}
    return (dispatch, getState) => {

        
        const request = agent.put(`/api/produits/${produit.id}`,Updateproduit);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_PRODUIT
                }),
                dispatch(showMessage({message: 'Produit bien supprimé!',anchorOrigin: {
                    vertical  : 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'}))
            ]).then(() => dispatch(getProduits(parametres)))
        );
    };
}



export function setParametresData(parametres)
{
    return {
        type      : SET_PARAMETRES_DATA,
        parametres
    }
}

export function setSearchText(event)
{
    return {
        type      : SET_PRODUITS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



