import agent from 'agent';
import * as Actions from 'app/store/actions';

export const GET_COUNT_BADGE = '[NAVIGATION APP] GET COUNT BADGE';

export function getCountForBadge(url) {
    const request = agent.get('/api/' + url);

    return (dispatch) =>

        request.then((response) => {

            dispatch(Actions.updateNavigationItem(url,
                {
                    'badge': {
                        'count': response.data.count,
                    }
                }
            ))

        });
}