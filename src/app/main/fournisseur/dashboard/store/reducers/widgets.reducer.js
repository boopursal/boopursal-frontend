import * as Actions from '../actions';

const initialState = {
    data: [],
    dataDDP: [],
    doughnut: { labels: [], datasets: [] },
    potentiels: [],
    personnelPotentiels: [],
    topBudget: null,
    loading: false,
    loadingDDP: false,
    loadingDoughnut: false,
    loadingTopBudget: false,
    loadingPotentiels: false,
    loadingPersonnelPotentiels: false,
};

const widgetsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_WIDGETS:
            return {
                ...state,
                data: [],
                loading: true
            };
        case Actions.GET_WIDGETS:
            return {
                ...state,
                data: action.payload,
                loading: false
            };
        case Actions.REQUEST_WIDGET5:
            return {
                ...state,
                dataDDP: [],
                loadingDDP: true
            };
        case Actions.GET_WIDGET5:
            return {
                ...state,
                dataDDP: action.payload,
                loadingDDP: false
            };
        case Actions.REQUEST_WIDGET6:
            return {
                ...state,
                doughnut: [],
                loadingDoughnut: true
            };
        case Actions.GET_WIDGET6:
            return {
                ...state,
                doughnut: action.payload,
                loadingDoughnut: false
            };
        case Actions.REQUEST_TOP_BUDGET:
            return {
                ...state,
                topBudget: null,
                loadingTopBudget: true
            };
        case Actions.GET_TOP_BUDGET:
            return {
                ...state,
                topBudget: action.payload,
                loadingTopBudget: false
            };

        case Actions.REQUEST_POTENTIEL:
            return {
                ...state,
                potentiels: [],
                loadingPotentiels: true
            };
        case Actions.GET_POTENTIEL:
            return {
                ...state,
                potentiels: action.payload,
                loadingPotentiels: false
            };
        case Actions.REQUEST_PERSONNEL_POTENTIEL:
            return {
                ...state,
                personnelPotentiels: [],
                loadingPersonnelPotentiels: true
            };
        case Actions.GET_PERSONNEL_POTENTIEL:
            return {
                ...state,
                personnelPotentiels: action.payload,
                loadingPersonnelPotentiels: false
            };
        default:
            return state;
    }
};

export default widgetsReducer;
