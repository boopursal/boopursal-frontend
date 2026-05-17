import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';

export const GET_SECTEURS = '[SECTEURS APP] GET SECTEURS';
export const GET_PARENTS = '[SECTEURS APP] GET_PARENTS';
export const GET_SOUS_SECTEURS = '[SOUS_SECTEURS APP] GET SOUS_SECTEURS';
export const SET_PARAMETRES_DATA = '[SOUS_SECTEURS APP] SET PARAMETRES DATA';
export const REQUEST_SOUS_SECTEURS = '[SOUS_SECTEURS APP] REQUEST SOUS_SECTEURS';
export const TOGGLE_IN_SELECTED_SOUS_SECTEURS = '[SOUS_SECTEURS APP] TOGGLE IN SELECTED SOUS_SECTEURS';
export const SELECT_ALL_SOUS_SECTEURS = '[SOUS_SECTEURS APP] SELECT ALL SOUS_SECTEURS';
export const DESELECT_ALL_SOUS_SECTEURS = '[SOUS_SECTEURS APP] DESELECT ALL SOUS_SECTEURS';
export const OPEN_NEW_SOUS_SECTEURS_DIALOG = '[SOUS_SECTEURS APP] OPEN NEW SOUS_SECTEURS DIALOG';
export const CLOSE_NEW_SOUS_SECTEURS_DIALOG = '[SOUS_SECTEURS APP] CLOSE NEW SOUS_SECTEURS DIALOG';
export const OPEN_EDIT_SOUS_SECTEURS_DIALOG = '[SOUS_SECTEURS APP] OPEN EDIT SOUS_SECTEURS DIALOG';
export const CLOSE_EDIT_SOUS_SECTEURS_DIALOG = '[SOUS_SECTEURS APP] CLOSE EDIT SOUS_SECTEURS DIALOG';
export const ADD_SOUS_SECTEUR = '[SOUS_SECTEURS APP] ADD SOUS_SECTEUR';
export const SAVE_ERROR = '[SOUS_SECTEURS APP] SAVE ERROR';
export const UPDATE_SOUS_SECTEUR = '[SOUS_SECTEURS APP] UPDATE SOUS_SECTEUR';
export const REMOVE_SOUS_SECTEUR = '[SOUS_SECTEURS APP] REMOVE SOUS_SECTEUR';
export const SET_SEARCH_TEXT = '[SOUS_SECTEURS APP] SET SEARCH TEXT';

export function setSearchText(event) {
    return {
        type: SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function getSecteurs() {
    const request = agent.get('/api/secteurs?pagination=false&props[]=id&props[]=name');

    return (dispatch) =>
        request.then((response) => {

            dispatch({
                type: GET_SECTEURS,
                payload: response.data['hydra:member']
            })
        });
}

export function getParents(url) {
    const request = agent.get(`${url}/sous_secteurs?pagination=false&props[]=id&props[]=name`);

    return (dispatch) =>
        request.then((response) => {

            dispatch({
                type: GET_PARENTS,
                payload: response.data['hydra:member']
            })
        });
}


export function getSousSecteurs(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map(function (item, i) {
            search += '&' + item.id + '=' + item.value
        });
    }
    const request = agent.get(`/api/sous_secteurs?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}&props[]=id&props[]=name&props[]=secteur&props[]=parent&props[]=fournisseurs`);


    return (dispatch) => {
        dispatch({
            type: REQUEST_SOUS_SECTEURS,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SOUS_SECTEURS,
                payload: response.data
            })
        });
    }

}


export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}

export function openNewSousSecteursDialog() {
    return {
        type: OPEN_NEW_SOUS_SECTEURS_DIALOG
    }
}

export function closeNewSousSecteursDialog() {
    return {
        type: CLOSE_NEW_SOUS_SECTEURS_DIALOG
    }
}

export function openEditSousSecteursDialog(data) {
    return {
        type: OPEN_EDIT_SOUS_SECTEURS_DIALOG,
        data
    }
}

export function closeEditSousSecteursDialog() {
    return {
        type: CLOSE_EDIT_SOUS_SECTEURS_DIALOG
    }
}

export function addSousSecteur(newSousSecteur, parametres) {
    newSousSecteur.secteur = newSousSecteur.secteur.value;
    if (newSousSecteur.parent)
        newSousSecteur.parent = newSousSecteur.parent.value;
    return (dispatch, getState) => {


        const request = agent.post('/api/sous_secteurs', newSousSecteur);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: ADD_SOUS_SECTEUR
                }),
                dispatch(showMessage({
                    message: 'Sous-secteur bien ajouté!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getSousSecteurs(parametres)))
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    };
}

export function updateSousSecteur(sousSecteur, parametres) {
    sousSecteur.secteur = sousSecteur.secteur.value;
    if (sousSecteur.parent)
        sousSecteur.parent = sousSecteur.parent.value;
    return (dispatch, getState) => {


        const request = agent.put(sousSecteur['@id'], sousSecteur);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_SOUS_SECTEUR
                }),
                dispatch(showMessage({
                    message: 'Sous-secteur bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getSousSecteurs(parametres)))
        )
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                });
                dispatch(
                    showMessage({
                        message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                            return key + ': ' + value;
                        }),//text or html
                        autoHideDuration: 6000,//ms
                        anchorOrigin: {
                            vertical: 'top',//top bottom
                            horizontal: 'right'//left center right
                        },
                        variant: 'error'//success error info warning null
                    }))
            });
    };
}

export function removeSousSecteur(sousSecteur, parametres) {

    let data = {
        del: true,
        name: sousSecteur.name + '_deleted-' + sousSecteur.id
    }
    return (dispatch) => {

        dispatch({
            type: REQUEST_SOUS_SECTEURS,
        });
        const request = agent.put(sousSecteur['@id'], data);

        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Sous-secteur bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))

            ]).then(() => dispatch(getSousSecteurs(parametres)))
        ).catch((error) => {
            dispatch({
                type: REMOVE_SOUS_SECTEUR
            })
            if (error.response.data && error.response.data['hydra:description']) {
                dispatch(showMessage({
                    message: error.response.data['hydra:description'], anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'
                }));

            }

        });
    };
}



