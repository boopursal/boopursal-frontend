import agent from "agent";

export const CLEAN_UP = '[ACTIVITES PORTAIL APP] CLEAN_UP';
export const REQUEST_CATEGORIES = '[ACTIVITES PORTAIL APP] REQUEST_CATEGORIES';
export const GET_CATEGORIES = '[ACTIVITES PORTAIL APP] GET_CATEGORIES';

export const REQUEST_FOURNISEEURS = '[ACTIVITES PORTAIL APP] REQUEST_FOURNISEEURS';
export const GET_FOURNISEEURS = '[ACTIVITES PORTAIL APP] GET_FOURNISEEURS';

export const REQUEST_SOUS_SECTEUR = '[ACTIVITES PORTAIL APP] REQUEST_SOUS_SECTEUR';
export const GET_SOUS_SECTEUR = '[ACTIVITES PORTAIL APP] GET_SOUS_SECTEUR';


export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}
export function getSousSecteur(id) {
    const request = agent.get(`/api/sous_secteurs/${id}?props[]=id&props[]=name&props[]=slug&props[]=secteur`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_SOUS_SECTEUR,
        });

        return request.then((response) => {

            dispatch({
                type: GET_SOUS_SECTEUR,
                payload: response.data
            })

        }

        );
    }

}

export function getPCategories(id) {
    const request = agent.get(`/api/parcourir_categories/${id}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_CATEGORIES,
        });

        return request.then((response) => {

            dispatch({
                type: GET_CATEGORIES,
                payload: response.data
            })

        }

        );
    }

}

export function getTopFounrisseursActivites(id) {
    const request = agent.get(`/api/fournisseurs?categories.sousSecteurs.id=${id}&itemsPerPage=5&order[visite]=desc&props[]=societe&props[]=slug&props[]=avatar&props[]=pays&props[]=id`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISEEURS,
        });

        return request.then((response) => {

            dispatch({
                type: GET_FOURNISEEURS,
                payload: response.data['hydra:member'] || []
            })

        }

        ).catch(() => {
            dispatch({
                type: GET_FOURNISEEURS,
                payload: []
            })
        });
    }

}
