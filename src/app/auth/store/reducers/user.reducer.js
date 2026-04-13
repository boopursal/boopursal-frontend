import * as Actions from '../actions';

const initialState = {
    role: [],//guest
    data: {
        'displayName': 'Votre compte',
        'photoURL': null,
        'email': 'johndoe@test.com',
        shortcuts: [
            'calendar',
            'mail',
            'contacts',
            'todo'
        ]
    },
    jetons: 0,
    requestJeton: false,
    loadingAbonnement: false,
    abonnement: null
};

const user = function (state = initialState, action) {
    switch (action.type) {
        case Actions.SET_USER_DATA:
            {
                // Hoist user.data.id to user.id so all components using user.id work correctly.
                // In our JWT flow, the ID lives under user.data.id — this makes it available everywhere.
                const payload = action.payload;
                const hoistedId = payload?.data?.id || payload?.id;
                return {
                    ...initialState,
                    ...payload,
                    id: hoistedId,
                };
            }
        case Actions.REQUEST_FOURNISSEUR_JETONS:
            {
                return {
                    ...state,
                    requestJeton: true
                };
            }
        case Actions.GET_FOURNISSEUR_JETONS:
            {
                return {
                    ...state,
                    jetons: action.payload,
                    requestJeton: false
                };
            }
        case Actions.REQUEST_FOURNISSEUR_ABONNEMENT:
            {
                return {
                    ...state,
                    loadingAbonnement: true
                };
            }
        case Actions.GET_FOURNISSEUR_ABONNEMENT:
            {
                return {
                    ...state,
                    abonnement: action.payload,
                    loadingAbonnement: false
                };
            }
        case Actions.REMOVE_USER_DATA:
            {
                return {
                    ...initialState
                };
            }
        case Actions.USER_LOGGED_OUT:
            {
                return initialState;
            }
        default:
            {
                return state
            }
    }
};

export default user;
