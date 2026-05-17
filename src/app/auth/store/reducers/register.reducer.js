import * as Actions from '../actions';

const initialState = {
    loading: false,
    error: {
        username: null,
        password: null
    }
};

const register = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CLEAN_UP_ERRORS:
            {
                return {
                    ...state,
                    error: null
                }
            }
        case Actions.REQUEST_REGISTER:
            {
                return {
                    ...initialState,
                    loading: true
                };
            }
        case Actions.REGISTER_SUCCESS:
            {
                return {
                    ...initialState,
                    loading: false

                };
            }
        case Actions.REGISTER_ERROR:
            {
                return {
                    error: action.payload,
                    loading: false
                };
            }
        default:
            {
                return state
            }
    }
};

export default register;
