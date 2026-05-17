// front-end/src/app/main/acheteur/import/store/reducers/import.reducer.js

import { 
  REQUEST_IMPORT, 
  IMPORT_ERROR, 
  IMPORT_SUCCESS, 
  SET_FOURNISSEURS 
} from '../actions/import.actions';

const initialState = {
  fournisseurs: [],
  loading: false,
  error: null,
};

const importReducer = (state = initialState, action) => {
  switch (action.type) {
      case REQUEST_IMPORT:
          return {
              ...state,
              loading: true, // Indique que l'importation est en cours
              error: null,   // Réinitialise l'erreur
          };
      case IMPORT_SUCCESS:
          return {
              ...state,
              loading: false, // L'importation est terminée
              fournisseurs: action.payload, // Met à jour la liste des fournisseurs
          };
      case IMPORT_ERROR:
          return {
              ...state,
              loading: false, // L'importation est terminée
              error: action.payload, // Enregistre l'erreur
          };
      case SET_FOURNISSEURS:
          return {
              ...state,
              fournisseurs: action.payload,
          };
      default:
          return state;
  }
};

export default importReducer;
