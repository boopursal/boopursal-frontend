import * as Actions from '../actions';

const initialState = {
    count : 0,
};

const navigation = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_COUNT_BADGE:
        {
            return {
                ...initialState,
                count : action.payload
            };
        }
        default:
        {
            return state
        }
    }
};

export default navigation;
