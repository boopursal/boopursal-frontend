import * as Actions from '../actions';

const initialState = {
    data: null,
    loading: false
};

const widget7Reducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_WIDGET7:
            return {
                ...state,
                loading: true

            };
        case Actions.GET_WIDGET7:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case Actions.CLEAN_UP_WIDGET7:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default widget7Reducer;
