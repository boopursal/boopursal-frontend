import * as Actions from '../actions';
import { FuseUtils } from '@fuse';

const initialState = {
    data: [],
    produits: [],
    produitsApercu: [],
    loading: false,
    loadingProduits: false,
    loadingProduitsApercu: false,
    loadingsPhone: false,
    loadingsContact: false,
    showPhone: false,
    phone: null,
    error: null,
    totalItems: null,
    pageCount: null,
    parametres: {
        itemsPerPage: 10,
        page: 1,
        filter: {
            id: 'created-desc',
        }
    },
    contactFournisseurDialog: {
        type: 'new',
        props: {
            open: false
        },
        data: null
    }
};

const fournisseurReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SAVE_ERROR_GET:
            {
                return {
                    ...state,
                    loading: false
                }
            }
        case Actions.CLEAN_UP:
            {
                return {
                    ...initialState,
                };
            }
        case Actions.CLEAN_ERROR:
            {
                return {
                    ...state,
                    error: null,
                };
            }
        case Actions.REQUEST_SAVE:
            {
                return {
                    ...state,
                    loadingsContact: true,
                };
            }
        case Actions.REQUEST_FOURNISSEUR:
            {
                return {
                    ...state,
                    loading: true,
                    showPhone: false,
                    phone: null,


                };
            }
        case Actions.REQUEST_FOURNISSEUR_PRODUITS:
            {
                return {
                    ...state,
                    loadingProduits: true,


                };
            }
        case Actions.REQUEST_FOURNISSEUR_PRODUITS_APERCU:
            {
                return {
                    ...state,
                    loadingProduitsApercu: true,


                };
            }
        case Actions.REQUEST_UPDATE_FOURNISSEUR:
            {
                return {
                    ...state,
                    loadingsPhone: true,
                    showPhone: false,

                };
            }

        case Actions.GET_FOURNISSEUR:
            {
                return {
                    ...state,
                    loading: false,
                    data: action.payload

                };
            }
        case Actions.CLEAN_UP_FRS:
            {
                return {
                    ...state,
                    data: []

                };
            }
        case Actions.SAVE_MESSAGE:
            {
                return {
                    ...state,
                    loadingsContact: false,

                };
            }
        case Actions.GET_FOURNISSEUR_PRODUITS_APERCU:
            {
                return {
                    ...state,
                    loadingProduitsApercu: false,
                    produitsApercu: action.payload

                };
            }
        case Actions.CLEAN_UP_PD_AP:
            {
                return {
                    ...state,
                    produitsApercu: []

                };
            }
        case Actions.GET_FOURNISSEUR_PRODUITS:
            {
                return {
                    ...state,
                    loadingProduits: false,
                    produits: action.payload['hydra:member'],
                    pageCount: FuseUtils.hydraPageCount(action.payload),
                    totalItems: action.payload['hydra:totalItems'],

                };
            }
        case Actions.CLEAN_UP_PDS:
            {
                return {
                    ...state,
                    produits: [],
                    totalItems: null,
                    pageCount: null,

                };
            }
        case Actions.GET_UPDATE_FOURNISSEUR:
            {
                return {
                    ...state,
                    loadingsPhone: false,
                    phone: state.data ? state.data.phone : null,
                    showPhone: true

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
                            direction: action.parametres.filter.direction
                        }
                    }

                };
            }
        case Actions.OPEN_NEW_CONTACT_FOURNISSEUR_DIALOG:
            {
                return {
                    ...state,
                    contactFournisseurDialog: {
                        type: 'new',
                        props: {
                            open: true
                        },
                        data: action.id
                    }
                };
            }
        case Actions.SAVE_ERROR:
            {
                return {
                    ...state,
                    error: action.payload,
                    loadingsContact: false,

                };
            }
        case Actions.CLOSE_NEW_CONTACT_FOURNISSEUR_DIALOG:
            {
                return {
                    ...state,
                    contactFournisseurDialog: {
                        type: 'new',
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

export default fournisseurReducer;
