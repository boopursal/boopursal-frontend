import agent from "agent";
import axios from "axios";

export const SC_SET_SEARCH_TEXT = '[SEARCH CATEGORIES APP] SC_SET_SEARCH_TEXT';
export const REQUEST_DATA = '[SEARCH CATEGORIES APP] REQUEST_DATA';
export const GET_DATA = '[SEARCH CATEGORIES APP] GET_DATA';
export const SC_OPEN = '[SEARCH CATEGORIES APP] SC_OPEN';
export const SC_CLOSE = '[SEARCH CATEGORIES APP] SC_CLOSE';
export const SC_SUSSP = '[SEARCH CATEGORIES APP] SC_SUSSP';
export const CLEAN_UP = '[SEARCH CATEGORIES APP] CLEAN_UP';
export const NO_SUGGESTIONS = '[SEARCH CATEGORIES APP] NO_SUGGESTIONS';

const CancelToken = axios.CancelToken;
let cancel;
let timeOut;

export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function loadSuggestions(value) {
    timeOut && clearTimeout(timeOut)
    return (dispatch) => {
        dispatch({
            type: REQUEST_DATA,
        });

        // Fake an AJAX call
        timeOut= setTimeout(() => {
            dispatch(getResults(value));
        }, randomDelay());
    };
}
function randomDelay() {
    return 300 + Math.random() * 1000;
}
export function getResults(searchText) {

    if (!searchText || searchText.trim() === "") {
        return (dispatch) => {
            dispatch({
                type: GET_DATA,
                payload: { 'hydra:member': [] }
            });
        };
    }

    cancel && cancel();
    const request = agent.get(`/api/categories?name=${searchText}&del=false&props[]=id&props[]=name`, {
        cancelToken: new CancelToken(function executor(c) {
            cancel = c;
        })
    });

    return (dispatch) => {

        return request.then((response) => {
            dispatch({
                type: GET_DATA,
                payload: response.data
            })

        }
        ).catch((error) => {
            if (axios.isCancel(error)) {
                console.log('get canceled')
            }
        })
    }
  
}


export function setGlobalSearchText(event) {
    return {
        type: SC_SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function showSearch() {
    return {
        type: SC_OPEN,
    }
}

export function hideSearch() {
    return {
        type: SC_CLOSE,
    }
}
export function susSearch() {
    return {
        type: SC_SUSSP,
    }
}


