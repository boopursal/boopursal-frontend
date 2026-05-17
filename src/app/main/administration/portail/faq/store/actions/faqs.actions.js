import agent from "agent";
import { showMessage } from 'app/store/actions/fuse';

export const REQUEST_FAQS = '[FAQS APP ADMIN] REQUEST FAQS';
export const GET_FAQS = '[FAQS APP ADMIN] GET FAQS';
export const SET_FAQS_SEARCH_TEXT = '[FAQS APP ADMIN] SET FAQS SEARCH TEXT';

export function setSearchText(event)
{
    return {
        type      : SET_FAQS_SEARCH_TEXT,
        searchText: event.target.value
    }
}
export function getFaqs() {
    const request = agent.get(`/api/faqs`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FAQS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_FAQS,
                payload: response.data
            })
        );
    }

}

export function setFaqsSearchText(event) {
    return {
        type: SET_FAQS_SEARCH_TEXT,
        searchText: event.target.value
    }
}


export function removeFaq(faq) {

    return (dispatch) => {
        const request = agent.delete(faq['@id']);
        dispatch({
            type: REQUEST_FAQS,
        });
        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Faq bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getFaqs()))
        );
    };
}
