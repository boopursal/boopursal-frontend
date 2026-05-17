import agent from 'agent';

export const GET_WIDGETS = '[PROJECT DASHBOARD APP] GET WIDGETS';
export const REQUEST_WIDGETS = '[PROJECT DASHBOARD APP] REQUEST WIDGETS';

export const GET_WIDGET6 = '[PROJECT DASHBOARD APP] GET_WIDGET6';
export const REQUEST_WIDGET6 = '[PROJECT DASHBOARD APP] REQUEST_WIDGET6';

export const GET_WIDGET5 = '[PROJECT DASHBOARD APP] GET_WIDGET5';
export const REQUEST_WIDGET5 = '[PROJECT DASHBOARD APP] REQUEST_WIDGET5';

export const REQUEST_TOP_BUDGET = '[PROJECT DASHBOARD APP] REQUEST_TOP_BUDGET';
export const GET_TOP_BUDGET = '[PROJECT DASHBOARD APP] GET_TOP_BUDGET';

export const REQUEST_POTENTIEL = '[PROJECT DASHBOARD APP] REQUEST_POTENTIEL';
export const GET_POTENTIEL = '[PROJECT DASHBOARD APP] GET_POTENTIEL';

export const REQUEST_PERSONNEL_POTENTIEL = '[PROJECT DASHBOARD APP] REQUEST_PERSONNEL_POTENTIEL';
export const GET_PERSONNEL_POTENTIEL = '[PROJECT DASHBOARD APP] GET_PERSONNEL_POTENTIEL';

export function getWidgets() {
    const request = agent.get('/api/fournisseur/widgets');

    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGETS,
        })
        return request.then((response) =>
            dispatch({
                type: GET_WIDGETS,
                payload: response.data
            })
        );

    }

}



export function getDoughnut(data) {
    const request = agent.get(`/api/fournisseur/doughnut?year=${data}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGET6,
        })
        return request.then((response) =>
            dispatch({
                type: GET_WIDGET6,
                payload: response.data
            })
        );

    }

}

export function getDemandeDevisByProduct() {
    const request = agent.get(`/api/fournisseur/demandeDevisByProduct`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGET5,
        })
        return request.then((response) =>
            dispatch({
                type: GET_WIDGET5,
                payload: response.data
            })
        );

    }

}


export function getTopBudgetGagner(data) {
    const request = agent.get(`/api/fournisseur/topbudget?year=${data}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_TOP_BUDGET,
        })
        return request.then((response) =>
            dispatch({
                type: GET_TOP_BUDGET,
                payload: response.data
            })
        );

    }

}


export function getPotentielBudgets(data) {
    const request = agent.get(`/api/fournisseur/potentiel?year=${data}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_POTENTIEL,
        })
        return request.then((response) =>
            dispatch({
                type: GET_POTENTIEL,
                payload: response.data
            })
        );

    }

}


export function getPersonnelPotentiels(data) {
    const request = agent.get(`/api/fournisseur/personnelsRank?year=${data}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_PERSONNEL_POTENTIEL,
        })
        return request.then((response) =>
            dispatch({
                type: GET_PERSONNEL_POTENTIEL,
                payload: response.data
            })
        );

    }

}
