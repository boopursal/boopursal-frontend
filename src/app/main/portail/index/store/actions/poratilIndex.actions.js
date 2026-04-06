import agent from "agent";

export const REQUEST_DEMANDE_DEVIS = "[PORTAIL APP] REQUEST_DEMANDE_DEVIS";
export const GET_DEMANDE_DEVIS = "[PORTAIL APP] GET_DEMANDE_DEVIS";

export const REQUEST_ACTUALITE = "[PORTAIL APP] REQUEST_ACTUALITE";
export const GET_ACTUALITE = "[PORTAIL APP] GET_ACTUALITE";

export const REQUEST_FOCUS_PRODUITS = "[PORTAIL APP] REQUEST_FOCUS_PRODUITS";
export const GET_FOCUS_PRODUITS = "[PORTAIL APP] GET_FOCUS_PRODUITS";

export const REQUEST_CATEGORIES = "[PORTAIL APP] REQUEST_CATEGORIES";
export const GET_CATEGORIES = "[PORTAIL APP] GET_CATEGORIES";

export const SET_PARAMETRES_DATA = "[PORTAIL APP] SET PARAMETRES DATA";
export const SET_PORTAIL_SEARCH_TEXT = "[PORTAIL APP] SET PORTAIL SEARCH TEXT";

export const CLEAN_UP_DEVIS = "[PORTAIL APP] CLEAN_UP_DEVIS";
export const CLEAN_UP_PRODUCT = "[PORTAIL APP] CLEAN_UP_PRODUCT";
export const CLEAN_UP_NEW = "[PORTAIL APP] CLEAN_UP_NEW";
export const CLEAN_UP_CATEGORIES = "[PORTAIL APP] CLEAN_UP_CATEGORIES";

export function cleanUpCategories() {
  return (dispatch) =>
    dispatch({
      type: CLEAN_UP_CATEGORIES,
    });
}

export function cleanUpDevis() {
  return (dispatch) =>
    dispatch({
      type: CLEAN_UP_DEVIS,
    });
}
export function cleanUpProduct() {
  return (dispatch) =>
    dispatch({
      type: CLEAN_UP_PRODUCT,
    });
}

export function cleanUpNew() {
  return (dispatch) =>
    dispatch({
      type: CLEAN_UP_NEW,
    });
}

export function getCategories() {
  const request = agent.get(`/api/focus_categories_mobile`);

  return (dispatch) => {
    dispatch({
      type: REQUEST_CATEGORIES,
    });
    return request.then((response) =>
      dispatch({
        type: GET_CATEGORIES,
        payload: response.data,
      })
    );
  };
}

export function getFocusProduct() {
  const request = agent.get(`/api/select_produits?produit[exists]=true`);

  return (dispatch) => {
    dispatch({
      type: REQUEST_FOCUS_PRODUITS,
    });
    return request.then((response) =>
      dispatch({
        type: GET_FOCUS_PRODUITS,
        payload: response.data["hydra:member"],
      })
    );
  };
}

export function getdemandeDevis() {
  const request = agent.get(
    `/api/demande_achats?itemsPerPage=4&statut=1&isPublic=1&order[created]=desc&props[]=id&props[]=reference&props[]=titre&props[]=description&props[]=pays&props[]=ville&props[]=dateExpiration&props[]=created&props[]=slug`
  );

  return (dispatch) => {
    dispatch({
      type: REQUEST_DEMANDE_DEVIS,
    });
    return request.then((response) =>
      dispatch({
        type: GET_DEMANDE_DEVIS,
        payload: response.data["hydra:member"],
      })
    );
  };
}

export function getNews() {
  const request = agent.get(
    `/api/actualites?itemsPerPage=4&isActive=true&order[created]=desc`
  );

  return (dispatch) => {
    dispatch({
      type: REQUEST_ACTUALITE,
    });
    return request.then((response) =>
      dispatch({
        type: GET_ACTUALITE,
        payload: response.data["hydra:member"],
      })
    );
  };
}

export function setParametresData(parametres) {
  return {
    type: SET_PARAMETRES_DATA,
    parametres,
  };
}

export function setProduitsSearchText(event) {
  return {
    type: SET_PORTAIL_SEARCH_TEXT,
    searchText: event.target.value,
  };
}
