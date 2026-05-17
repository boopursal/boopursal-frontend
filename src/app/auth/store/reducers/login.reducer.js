import * as Actions from '../actions';

const initialState = {
    loading: false,
    relogin: false,
    success: false,
    error: {
        username: null,
        password: null
    }
};

const login = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_LOGIN:
            {
                return {
                    ...initialState,
                    loading: true
                };
            }
        case Actions.REQUEST_RE_LOGIN:
            {
                return {
                    ...initialState,
                    relogin: true
                };
            }
        case Actions.LOGIN_RE_SUCCESS:
        case Actions.LOGIN_RE_ERROR:
            {
                return {
                    ...initialState,
                    relogin: false
                };
            }
        case Actions.LOGIN_SUCCESS:
            {
                return {
                    ...initialState,
                    loading: false,
                    success: true,
                    error: {
                        username: null,
                        password: null
                    }

                };
            }
        case Actions.LOGIN_ERROR:
            {
                return {
                    loading: false,
                    success: false,
                    error: action.payload
                };
            }
        default:
            {
                return state
            }
    }
};

export default login;
