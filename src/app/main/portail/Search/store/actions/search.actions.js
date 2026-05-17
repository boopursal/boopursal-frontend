export const SET_SEARCH_TEXT = '[SEARCH APP] SET SEARCH TEXT';
export const GET_SEARCH_RESULTS = '[SEARCH APP] GET SEARCH RESULTS';
export const SET_SEARCH_RESULTS = '[SEARCH APP] SET SEARCH RESULTS';

export function setGlobalSearchText(event) {
    return (dispatch, getState) => {
        const searchText = event.target ? event.target.value : event;

        dispatch({
            type: SET_SEARCH_TEXT,
            searchText
        });

        if (searchText.length > 2) {
            dispatch(getResults(searchText));
        } else {
            dispatch({
                type: SET_SEARCH_RESULTS,
                results: { sections: [] }
            });
        }
    };
}

export function getResults(searchText) {
    return (dispatch) => {
        fetch(`/api/searchResult?searchText=${encodeURIComponent(searchText)}`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: SET_SEARCH_RESULTS,
                    results: data
                });
            })
            .catch(error => {
                console.error('Search error:', error);
                dispatch({
                    type: SET_SEARCH_RESULTS,
                    results: { sections: [] }
                });
            });
    };
} 
