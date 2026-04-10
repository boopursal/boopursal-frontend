import * as Actions from '../actions';

const initialState = {
    pays: null,
    loading: false,
    loadingVille: false,
    villes: null,
    error: null,
    currencies: null,

};

const step2Reducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_PAYS:
        case Actions.REQUEST_UPDATE_FOURNISSEUR:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case Actions.REQUEST_VILLES:
            {
                return {
                    ...state,
                    villes: null,
                    loadingVille: true

                };
            }
        case Actions.GET_CURRENCY:
            {
                return {
                    ...state,
                    currencies: action.payload,

                };
            }
        case Actions.GET_PAYS:
            {
                return {
                    ...state,
                    pays: action.payload,
                    loading: false

                };
            }

        case Actions.GET_VILLES:
            {
                const villesData = Array.isArray(action.payload) ? action.payload : [];
                return {
                    ...state,
                    villes: [...villesData, { '@id': '/api/villes/113', name: 'Autre' }],
                    loadingVille: false
                };
            }
        case Actions.UPDATE_FOURNISSEUR:
            {
                return {
                    ...state,
                    loading: false,
                };
            }
        case Actions.SAVE_ERROR:
            {
                return {
                    ...state,
                    loading: false,
                    error: action.payload,
                };
            }

        default:
            {
                return state;
            }
    }
};

export default step2Reducer;
