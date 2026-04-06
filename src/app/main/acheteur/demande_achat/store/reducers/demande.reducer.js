import * as Actions from '../actions';

const initialState = {
    data: null,
    fournisseurs: [],
    error: null,
    sousSecteurs: null,
    loading: false,
    attachementReqInProgress: false,
    deleteReqInProgress: false,
    attachement: null,
    attachement_deleted: null,
    new: false,
    requestSaveFrs: false,
};

const demandeReducer = function (state = initialState, action) {
    switch (action.type) {

        case Actions.REQUEST_SOUS_SECTEUR:
        case Actions.REQUEST_DEMANDE:
        case Actions.REQUEST_SAVE:
            {
                return {
                    ...state,
                    loading: true,
                    new: false,
                }
            }
        case Actions.REQUEST_SAVE_FOURNISSEUR:
            {
                return {
                    ...state,
                    requestSaveFrs: true,
                }
            }
        case Actions.SAVE_FOURNISSEUR:
            {
                return {
                    ...state,
                    requestSaveFrs: false,

                }
            }
        case Actions.REQUEST_DEMANDE_FOURNISSEURS:
            {
                return {
                    ...state,
                    loadingFrs: true,
                }
            }
        case Actions.GET_DEMANDE_FOURNISSEURS:
            {
                return {
                    ...state,
                    fournisseurs: action.payload ? (action.payload['hydra:member'] || []) : [],
                    loadingFrs: false,
                }
            }
        case Actions.CLEAN_UP_DEMANDE:
            {
                return {
                    ...initialState,
                    new: false,

                }
            }
        case Actions.NEW_DEMANDE:
            {
                return {
                    ...state,
                    new: true

                }
            }
        case Actions.UPLOAD_REQUEST:
            {
                return {
                    ...state,
                    attachementReqInProgress: true

                };
            }
        case Actions.REQUEST_DELETE:
            {
                return {
                    ...state,
                    deleteReqInProgress: true

                };
            }
        case Actions.UPLOAD_ATTACHEMENT:
            {
                return {
                    ...state,
                    attachement: action.payload,
                    attachementReqInProgress: false

                };
            }
        case Actions.DELETE_SUCCESS:
            {
                return {
                    ...state,
                    deleteReqInProgress: false,
                    attachement_deleted: action.id,

                };
            }
        case Actions.UPLOAD_ERROR:
            {
                return {
                    ...state,
                    attachementReqInProgress: false

                };
            }
        case Actions.GET_SOUS_SECTEUR:
            {
                return {
                    ...state,
                    sousSecteurs: action.payload || [],
                    loading: false,

                };
            }
        case Actions.GET_DEMANDE:
            {
                return {
                    ...state,
                    data: action.payload,
                    loading: false,

                };
            }
        case Actions.SAVE_DEMANDE:
            {
                return {
                    ...state,
                    loading: false,
                    data: null,

                };
            }
        case Actions.SAVE_ERROR:
            {
                return {
                    ...state,
                    error: action.payload,
                    loading: false,

                };
            }
        default:
            {
                return state;
            }
    }
};

export default demandeReducer;
