import * as Actions from '../actions';
import FuseUtils from '@fuse/FuseUtils';

const initialState = {

    data: [],
    secteurs: [],
    activites: [],
    categories: [],
    pays: [],
    villes: [],
    loading: false,
    totalItems: null,
    pageCount: null,
    parametres: {
        itemsPerPage: 12,
        page: 1,
        filter: {
            id: 'created-desc',
        }
    },
    loadingSecteurs: false,
    loadingPays: false,
    loadingActivites: false,
    loadingCategories: false,
    loadingVilles: false,


};

const fournisseursReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CLEAN_UP:
            {
                return {
                    ...initialState,
                };
            }

        case Actions.REQUEST_FOURNISSEURS:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case Actions.REQUEST_SECTEURS_COUNT:
            {
                return {
                    ...state,
                    loadingSecteurs: true,
                };
            }
        case Actions.REQUEST_PAYS_COUNT:
            {
                return {
                    ...state,
                    loadingPays: true,
                };
            }
        case Actions.REQUEST_VILLES_COUNT:
            {
                return {
                    ...state,
                    loadingVilles: true,
                };
            }
        case Actions.REQUEST_ACTIVITES_COUNT:
            {
                return {
                    ...state,
                    loadingActivites: true,
                };
            }
        case Actions.REQUEST_CATEGORIES_COUNT:
            {
                return {
                    ...state,
                    loadingCategories: true,
                };
            }
        case Actions.GET_FOURNISSEURS:
            {
                return {
                    ...state,
                    loading: false,
                    data: action.payload['hydra:member'],
                    pageCount: FuseUtils.hydraPageCount(action.payload),
                    totalItems: action.payload['hydra:totalItems'],

                };
            }
        case Actions.GET_SECTEURS_COUNT:
            {
                return {
                    ...state,
                    loadingSecteurs: false,
                    secteurs: action.payload

                };
            }
        case Actions.GET_PAYS_COUNT:
            {
                return {
                    ...state,
                    loadingPays: false,
                    pays: action.payload

                };
            }
        case Actions.GET_VILLES_COUNT:
            {
                return {
                    ...state,
                    loadingVilles: false,
                    villes: action.payload

                };
            }
        case Actions.GET_ACTIVITES_COUNT:
            {
                return {
                    ...state,
                    loadingActivites: false,
                    activites: action.payload

                };
            }
        case Actions.GET_CATEGORIES_COUNT:
            {
                return {
                    ...state,
                    loadingCategories: false,
                    categories: action.payload

                };
            }
        case Actions.SET_PARAMETRES_DATA:
            {
                return {
                    ...state,
                    parametres: {
                        itemsPerPage: action.parametres.itemsPerPage,
                        page: action.parametres.page,
                        filter: {
                            id: action.parametres.filter.id,
                        }
                    }
                };
            }
        default:
            {
                return state;
            }
    }
};

export default fournisseursReducer;
