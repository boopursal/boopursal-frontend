import SearchResultsPage from './SearchResultsPage';

export const SearchConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/recherche',
            component: SearchResultsPage
        }
    ]
};
