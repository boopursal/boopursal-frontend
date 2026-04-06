import * as Actions from '../actions';

const initialState = {
    data: null,
    error: null,
    sousSecteurs: null,
    fournisseurs: [],
    motifs: null,
    loading: false,
    attachementReqInProgress: false,
    deleteReqInProgress: false,
    attachement: null,
    attachement_deleted: null,
    secteurs: [],
    loadingSousSecteursAdmin: false,
    sousSecteursAdmin: [],
    suggestionsDialog: {
        type: 'new',
        props: {
            open: false
        },
        data: null
    },
    requestSaveProduit: false,
    produit: null
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
        case Actions.REQUEST_SAVE_PRODUIT:
            {
                return {
                    ...state,
                    requestSaveProduit: true

                };
            }
        case Actions.SAVE_PRODUIT:
            {
                return {
                    ...state,
                    requestSaveProduit: false,
                    produit: action.payload
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
        case Actions.OPEN_SUGGESTION_DIALOG:
            {
                return {
                    ...state,
                    suggestionsDialog: {
                        type: 'edit',
                        props: {
                            open: true
                        },
                        data: action.data
                    }
                };
            }
        case Actions.CLOSE_SUGGESTION_DIALOG:
            {
                return {
                    ...state,
                    suggestionsDialog: {
                        type: 'edit',
                        props: {
                            open: false
                        },
                        data: null
                    }
                };
            }
        case Actions.REQUEST_SOUS_SECTEUR_ADMIN:
            {
                return {
                    ...state,
                    sousSecteursAdmin: [],
                    loadingSousSecteursAdmin: true,

                }
            }
        case Actions.GET_SECTEURS:
            {
                return {
                    ...state,
                    secteurs: action.payload['hydra:member'],
                };
            }
        case Actions.GET_SOUS_SECTEUR_ADMIN:
            {
                return {
                    ...state,
                    sousSecteursAdmin: action.payload['hydra:member'],
                    loadingSousSecteursAdmin: false
                };
            }
        case Actions.GET_SOUS_SECTEUR:
            {
                return {
                    ...state,
                    sousSecteurs: action.payload,
                    loading: false,


                };
            }
        case Actions.GET_MOTIF:
            {
                return {
                    ...state,
                    motifs: action.payload,

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
