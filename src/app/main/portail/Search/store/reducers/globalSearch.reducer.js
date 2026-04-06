import * as Actions from '../actions';

const initialState = {
    searchText: '',
    suggestions: [],
    loading: false,
    opened: false,
    noSuggestions: false,
    produits: [],
    loadingProduits: false,
    activites: [],
    loadingActivites: false,
    fournisseurs: [],
    loadingFournisseurs: false,
    actualites: [],
    loadingActualites: false
};



const globalSearchReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.CLEAN_UP:
            return {
                ...state,
                suggestions: [],
                noSuggestions: false,
                produits: [],
                activites: [],
                fournisseurs: [],
                actualites: []
            };

        case Actions.REQUEST_DATA:
            return {
                ...state,
                loading: true,
                suggestions: [],
                noSuggestions: false,
                loadingProduits: true,
                loadingActivites: true,
                loadingFournisseurs: true,
                loadingActualites: true
            };

        case Actions.GET_DATA:
            const rawData = action.payload;
            // Le backend retourne un tableau de sections [{title, suggestions}]
            const findSection = (title) => {
                const section = rawData.find(s => s.title === title);
                return section ? section.suggestions || [] : [];
            };

            const fournisseursSuggestions = findSection('Fournisseurs');
            const produitsSuggestions = findSection('Produits / Services');
            const activitesSuggestions = findSection('Activités');
            const actualitesSuggestions = findSection('Actualités');

            // Reconstruct suggestions for autosuggest (sections format)
            const allSuggestions = rawData;
            const noSuggestions = fournisseursSuggestions.length === 0 &&
                produitsSuggestions.length === 0 &&
                activitesSuggestions.length === 0 &&
                actualitesSuggestions.length === 0;

            return {
                ...state,
                suggestions: allSuggestions,
                noSuggestions,
                loading: false,
                loadingProduits: false,
                loadingActivites: false,
                loadingFournisseurs: false,
                loadingActualites: false,
                fournisseurs: fournisseursSuggestions,
                produits: produitsSuggestions,
                activites: activitesSuggestions,
                actualites: actualitesSuggestions,
            };

        case Actions.GS_OPEN:
            return {
                ...state,
                opened: true,
                produits: [],
                activites: [],
                fournisseurs: [],
                actualites: []
            };

        case Actions.GS_CLOSE:
            return {
                ...state,
                opened: false,
                searchText: '',
                produits: [],
                activites: [],
                fournisseurs: [],
                actualites: []
            };

        case Actions.SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.searchText
            };

        case Actions.CLEAR_SUGGESTIONS:
            return {
                ...state,
                suggestions: [],
                noSuggestions: false,
                loading: false,
                loadingProduits: false,
                loadingActivites: false,
                loadingFournisseurs: false,
                loadingActualites: false
            };

        default:
            return state;
    }
};

export default globalSearchReducer;
