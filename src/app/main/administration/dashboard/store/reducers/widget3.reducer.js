import * as Actions from '../actions';

const initialState = {
    data: null,
    loading: false
};

const widget3Reducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_WIDGET3:
            return {
                ...state,
                loading: true

            };
        case Actions.GET_WIDGET3:
            return {
                ...state,
                loading: false,
                data: action.payload
            };
        case Actions.CLEAN_UP_WIDGET3:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default widget3Reducer;
