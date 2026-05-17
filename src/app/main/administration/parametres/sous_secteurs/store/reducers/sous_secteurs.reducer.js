import * as Actions from '../actions';
import FuseUtils from '@fuse/FuseUtils';

const initialState = {
    searchText: '',
    entities: null,
    pageCount: null,
    parametres: {
        page: 1,
        search: [],
        filter: {
            id: 'id',
            direction: 'desc'
        }
    },
    routeParams: {},
    sous_secteursDialog: {
        type: 'new',
        props: {
            open: false
        },
        data: null
    },
    secteur: null,
    loading: false,
    parents: null
};

const sous_secteursReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_SECTEURS:
            {
                return {
                    ...state,
                    secteur: action.payload
                };
            }
        case Actions.GET_PARENTS:
            {
                return {
                    ...state,
                    parents: action.payload
                };
            }
        case Actions.REQUEST_SOUS_SECTEURS:
            {
                return {
                    ...state,
                    loading: true

                };
            }
        case Actions.GET_SOUS_SECTEURS:
            {
                return {
                    ...state,
                    entities: action.payload['hydra:member'],
                    pageCount: FuseUtils.hydraPageCount(action.payload),
                    loading: false
                };
            }
        case Actions.REMOVE_SOUS_SECTEUR:
            {
                return {
                    ...state,
                    loading: false
                };
            }
        case Actions.SET_SEARCH_TEXT:
            {
                return {
                    ...state,
                    searchText: action.searchText
                };
            }
      
        case Actions.SET_PARAMETRES_DATA:
            {
                return {
                    ...state,
                    parametres: {
                        page: action.parametres.page,
                        search: action.parametres.search,
                        filter: {
                            id: action.parametres.filter.id,
                            direction: action.parametres.filter.direction
                        }
                    }

                };
            }

        case Actions.OPEN_NEW_SOUS_SECTEURS_DIALOG:
            {
                return {
                    ...state,
                    sous_secteursDialog: {
                        type: 'new',
                        props: {
                            open: true
                        },
                        data: null
                    }
                };
            }
        case Actions.CLOSE_NEW_SOUS_SECTEURS_DIALOG:
            {
                return {
                    ...state,
                    sous_secteursDialog: {
                        type: 'new',
                        props: {
                            open: false
                        },
                        data: null
                    }
                };
            }
        case Actions.OPEN_EDIT_SOUS_SECTEURS_DIALOG:
            {
                return {
                    ...state,
                    sous_secteursDialog: {
                        type: 'edit',
                        props: {
                            open: true
                        },
                        data: action.data
                    }
                };
            }
        case Actions.CLOSE_EDIT_SOUS_SECTEURS_DIALOG:
            {
                return {
                    ...state,
                    sous_secteursDialog: {
                        type: 'edit',
                        props: {
                            open: false
                        },
                        data: null
                    }
                };
            }

        default:
            {
                return state;
            }
    }
};

export default sous_secteursReducer;
