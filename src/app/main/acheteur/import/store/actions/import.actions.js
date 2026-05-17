import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import jwtService from 'app/services/jwtService'; // Assurez-vous d'importer jwtService si nécessaire

export const SET_FOURNISSEURS = 'SET_FOURNISSEURS';
export const REQUEST_IMPORT = 'REQUEST_IMPORT';
export const IMPORT_ERROR = 'IMPORT_ERROR';
export const IMPORT_SUCCESS = 'IMPORT_SUCCESS';

// Action pour initier l'importation
export const requestImport = () => ({
    type: REQUEST_IMPORT,
});

// Action pour gérer l'erreur d'importation
export const importError = (error) => ({
    type: IMPORT_ERROR,
    payload: error,
});

// Action pour gérer le succès de l'importation
export const importSuccess = (fournisseurs) => ({
    type: IMPORT_SUCCESS,
    payload: fournisseurs,
});

// Action pour définir les fournisseurs
export const setFournisseurs = (fournisseurs) => ({
    type: SET_FOURNISSEURS,
    payload: fournisseurs,
});

// Fonction pour soumettre l'importation de fournisseurs via un fichier CSV
export function submitImportFournisseurs(csvFile) {
    return (dispatch) => {
        const formData = new FormData();
        formData.append('file', csvFile);

        const accessToken = jwtService.getAccessToken(); // Récupère le token
        console.log('Token JWT:', accessToken); // Vérifiez si le token est bien récupéré

        if (!accessToken) {
            alert('Veuillez vous connecter pour utiliser cette fonctionnalité');
            window.location.href = '/login'; // Redirige vers la page de connexion si le token est manquant
            return;
        }

        const request = agent.post('/api/fournisseurs/import', formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Ajout du token dans l'en-tête
                'Content-Type': 'multipart/form-data'
            },
        });

        dispatch(requestImport());

        return request
            .then((response) => {
                if (response.data && response.data.data) {
                    dispatch(importSuccess(response.data.data));
                    alert('Fichier CSV importé avec succès !');
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    window.location.href = '/login'; // Si erreur 401, rediriger vers la page de connexion
                }
                dispatch(importError(FuseUtils.parseApiErrors(error)));
            });
    };
}
