import agent from "agent";
import axios from "axios";
import _ from '@lodash';

export const CLEAN_UP = '[FOURNISSEURS PORTAIL APP] CLEAN_UP';
export const REQUEST_FOURNISSEURS = '[FOURNISSEURS PORTAIL APP] REQUEST_FOURNISSEURS';
export const REQUEST_SECTEURS_COUNT = '[FOURNISSEURS PORTAIL APP] REQUEST_SECTEURS_COUNT';
export const REQUEST_PAYS_COUNT = '[FOURNISSEURS PORTAIL APP] REQUEST_PAYS_COUNT';
export const REQUEST_ACTIVITES_COUNT = '[FOURNISSEURS PORTAIL APP] REQUEST_ACTIVITES_COUNT';
export const REQUEST_CATEGORIES_COUNT = '[FOURNISSEURS PORTAIL APP] REQUEST_CATEGORIES_COUNT';
export const REQUEST_VILLES_COUNT = '[FOURNISSEURS PORTAIL APP] REQUEST_VILLES_COUNT';

export const GET_VILLES_COUNT = '[FOURNISSEURS PORTAIL APP] GET_VILLES_COUNT';
export const GET_ACTIVITES_COUNT = '[FOURNISSEURS PORTAIL APP] GET_ACTIVITES_COUNT';
export const GET_CATEGORIES_COUNT = '[FOURNISSEURS PORTAIL APP] GET_CATEGORIES_COUNT';
export const GET_FOURNISSEURS = '[FOURNISSEURS PORTAIL APP] GET_FOURNISSEURS';
export const GET_SECTEURS_COUNT = '[FOURNISSEURS PORTAIL APP] GET_SECTEURS_COUNT';
export const GET_PAYS_COUNT = '[FOURNISSEURS PORTAIL APP] GET_PAYS_COUNT';
export const SET_PARAMETRES_DATA = '[FOURNISSEURS PORTAIL APP] SET PARAMETRES DATA';

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function getFournisseurs(params, pays, parametres, ville, q) {
    const { secteur, activite, categorie } = params;
    let parametre = '';
    if (categorie) {
        parametre += `&categories.slug=${categorie}`
    }
    else if (activite) {
        parametre += `&categories.sousSecteurs.slug=${activite}`
    }
    else if (secteur) {
        parametre += `categories.sousSecteurs.secteur.slug=${secteur}`
    }

    if (pays) {
        if (parametre)
            parametre += `&pays.slug=${pays}`
        else
            parametre += `pays.slug=${pays}`
    }
    if (ville) {
        parametre += `&ville.slug=${ville}`
    }
    if (q) {
        parametre += `&q=${q}`
    }

    let order = _.split(parametres.filter.id, '-');
    let requestUrl = `/api/fournisseurs?page=${parametres.page}&exists[parent]=false&isactif=true&isComplet=true&itemsPerPage=${parametres.itemsPerPage}&order[${order[0]}]=${order[1]}`;
    if (parametre) {
        requestUrl += (parametre.startsWith('&') ? parametre : '&' + parametre);
    }
    const request = agent.get(requestUrl);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEURS,
        });

        return request.then((response) => {

            dispatch({
                type: GET_FOURNISSEURS,
                payload: response.data
            })

        }

        );
    }

}


export function getSecteursCounts(params, pays, ville, q) {
    const { secteur, activite } = params;
    const request = agent.get(`/api/count_fournisseur_categorie?secteur=${secteur ? secteur : ''}&sousSecteur=${activite ? activite : ''}&pays=${pays ? pays : ''}&ville=${ville ? ville : ''}&q=${q ? q : ''}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SECTEURS_COUNT,
        });

        return request.then((response) => {

            dispatch({
                type: GET_SECTEURS_COUNT,
                payload: response.data
            })

        }



        );
    }

}

export function getActivitesCounts(params, pays, ville, q) {
    const { secteur, activite } = params;
    const request = agent.get(`/api/count_fournisseur_categorie?secteur=${secteur ? secteur : ''}&sousSecteur=${activite ? activite : ''}&pays=${pays ? pays : ''}&ville=${ville ? ville : ''}&q=${q ? q : ''}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ACTIVITES_COUNT,
        });

        return request.then((response) => {

            dispatch({
                type: GET_ACTIVITES_COUNT,
                payload: response.data
            })

        }
        );
    }

}

export function getCategoriesCounts(params, pays, ville, q) {
    const { secteur, activite, categorie } = params;
    const request = agent.get(`/api/count_fournisseur_categorie?secteur=${secteur ? secteur : ''}&sousSecteur=${activite ? activite : ''}&categorie=${categorie ? categorie : ''}&pays=${pays ? pays : ''}&ville=${ville ? ville : ''}&q=${q ? q : ''}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_CATEGORIES_COUNT,
        });
        return request.then((response) => {

            dispatch({
                type: GET_CATEGORIES_COUNT,
                payload: response.data
            })

        }
        );
    }

}

export function getVilleCounts(params, pays, q) {
    const { secteur, activite, categorie } = params;
    const request = agent.get(`/api/count_fournisseur_pays?secteur=${secteur ? secteur : ''}&sousSecteur=${activite ? activite : ''}&categorie=${categorie ? categorie : ''}&pays=${pays ? pays : ''}&q=${q ? q : ''}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_VILLES_COUNT,
        });

        return request.then((response) => {

            dispatch({
                type: GET_VILLES_COUNT,
                payload: response.data
            })

        }



        );
    }

}
export function getPaysCounts(params, pays, q) {
    const { secteur, activite, categorie } = params;
    const request = agent.get(`/api/count_fournisseur_pays?secteur=${secteur ? secteur : ''}&sousSecteur=${activite ? activite : ''}&categorie=${categorie ? categorie : ''}&pays=${pays ? pays : ''}&q=${q ? q : ''}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_PAYS_COUNT,
        });

        return request.then((response) => {

            dispatch({
                type: GET_PAYS_COUNT,
                payload: response.data
            })

        }



        );
    }

}


export function getSecteursAndPaysCounts(q) {

    const request = agent.get(`/api/count_fournisseur_categorie?q=${q ? q : ''}`);
    const request2 = agent.get(`/api/count_fournisseur_pays?q=${q ? q : ''}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_PAYS_COUNT,
        });
        dispatch({
            type: REQUEST_SECTEURS_COUNT,
        });

        axios.all([request, request2]).then(axios.spread((...responses) => {

            dispatch({
                type: GET_SECTEURS_COUNT,
                payload: responses[0].data
            });
            dispatch({
                type: GET_PAYS_COUNT,
                payload: responses[1].data
            });

            // use/access the results 
        })).catch(errors => {
            // react on errors.
        })
    }

}

export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}