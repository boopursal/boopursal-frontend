import React, { useState, useEffect } from 'react';
import agent from 'agent';
//import { Upload, HelpCircle } from 'lucide-react';
import jwtService from 'app/services/jwtService';

const CSVUpload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [csvData, setCsvData] = useState(null);

    const [importedFournisseurs, setImportedFournisseurs] = useState([]);
    const [activeTab, setActiveTab] = useState('import'); // Onglet actif


    useEffect(() => {
        if (!jwtService.getAccessToken()) {
            window.location.href = '/login';
            return;
        }
        loadImportedFournisseurs();
    }, []);

    const onFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            alert('Aucun fichier sélectionné');
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'csv') {
            alert('Veuillez sélectionner un fichier avec l\'extension .csv');
            event.target.value = '';
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('Le fichier est trop volumineux. Taille maximum : 5MB');
            event.target.value = '';
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n');
            const headers = lines[0].trim().split(/[,;]/);

            const data = lines.slice(1).filter(line => line.trim()).map(line => {
                const values = line.trim().split(/[,;]/);
                return headers.reduce((obj, header, index) => {
                    const value = values[index] ? values[index].trim() : '';
                    obj[header.trim()] = value;
                    return obj;
                }, {});
            });

            setCsvData(data);
        };
        reader.readAsText(selectedFile);
    };

    const onFileUpload = () => {
        // Vérification du token JWT
        const accessToken = jwtService.getAccessToken();
        console.log('Token JWT:', accessToken); // Affiche le token JWT dans la console

        if (!accessToken) {
            alert('Veuillez vous connecter pour utiliser cette fonctionnalité');
            window.location.href = '/login'; // Redirige vers la page de connexion si aucun token
            return;
        }

        // Vérification que le fichier a bien été sélectionné
        if (!file) {
            alert('Veuillez sélectionner un fichier CSV avant de télécharger.');
            return;
        }

        setIsUploading(true); // Indiquer que l'upload est en cours

        const formData = new FormData();
        formData.append('file', file); // Ajoute le fichier dans FormData

        // Envoi de la requête POST pour importer le fichier
        agent.request({
            method: 'POST',
            url: '/api/fournisseurs/import', // L'URL de l'API d'import
            data: formData,
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Ajout du token JWT dans l'en-tête Authorization
                'Content-Type': 'multipart/form-data' // Type de contenu pour l'upload de fichier
            }
        })
            .then(response => {
                // Vérification de la réponse
                if (response.data && response.data.data) {
                    // Met à jour l'état des fournisseurs importés
                    setImportedFournisseurs(response.data.data);
                    alert('Fichier CSV importé avec succès !');
                } else {
                    alert('Aucun fournisseur importé.'); // Si aucun fournisseur n'est importé
                }
            })
            .catch(error => {
                // Gestion des erreurs
                console.error('Erreur lors de l\'importation:', error);

                // Si l'erreur est due à l'authentification (par exemple, token expiré), rediriger vers la page de connexion
                if (error.response && error.response.status === 401) {
                    alert('Session expirée ou non authentifiée. Veuillez vous reconnecter.');
                    window.location.href = '/login'; // Redirige vers la page de connexion si le token est expiré
                } else if (error.response && error.response.data && error.response.data.error) {
                    // Afficher l'erreur reçue du serveur (si disponible)
                    alert(`Erreur: ${error.response.data.error}`);
                } else {
                    // Si une autre erreur se produit, afficher un message générique
                    alert('Erreur lors de l\'importation, veuillez réessayer plus tard.');
                }
            })
            .finally(() => {
                setIsUploading(false); // Désactive l'état de téléchargement
            });
    };



    const loadImportedFournisseurs = () => {
        agent.request({
            method: 'GET',
            url: '/api/fournisseurs/import/list',
            headers: {
                'Authorization': `Bearer ${jwtService.getAccessToken()}`
            }
        })
            .then((response) => {
                console.log(response.data);
                if (response.data && response.data.data) {
                    const formattedData = response.data.data.map(item => ({
                        id: item.id,
                        nom: item.nom,
                        email: item.email,
                        telephone: item.telephone,
                        tempPassword: item.tempPassword
                    }));
                    setImportedFournisseurs(formattedData);
                }
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des fournisseurs importés:', error);
            });
    };

    const downloadExample = () => {
        const csvContent = `Civilite;Nom;Prenom;Adresse;Pays;Telephone;Email;Société;Secteur d'activité;Produit;Service
M.;Dupont;Jean;123 rue Example;Maroc;0123456789;jean.dupont@example.com;Maroc aviation;Aeromautique;;Audite
Mme;Martin;Marie;456 avenue Test;;0987654321;marie.martin@example.com;FerAcier Maroc;Métallique;Tôle;`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "exemple_import_fournisseurs.csv";
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // Initialisation des états pour la pagination
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const itemsPerPage = 10; // Nombre d'éléments par page

    // Calcul des indices pour les éléments à afficher
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = importedFournisseurs.slice(indexOfFirstItem, indexOfLastItem);



    const [currentCsvPage, setCurrentCsvPage] = useState(1); // Page actuelle pour csvData
    const csvItemsPerPage = 10; // Nombre d'éléments à afficher par page

    // Calcul des indices pour les éléments à afficher pour csvData
    const indexOfLastCsvItem = currentCsvPage * csvItemsPerPage;
    const indexOfFirstCsvItem = indexOfLastCsvItem - csvItemsPerPage;
    const currentCsvItems = csvData && Array.isArray(csvData)
        ? csvData.slice(indexOfFirstCsvItem, indexOfLastCsvItem)
        : [];

    // Gestion de la pagination (Précédent/Suivant) pour csvData
    const handleCsvPrevPage = () => {
        if (currentCsvPage > 1) {
            setCurrentCsvPage(currentCsvPage - 1);
        }
    };

    const handleCsvNextPage = () => {
        if (currentCsvPage < Math.ceil(csvData.length / csvItemsPerPage)) {
            setCurrentCsvPage(currentCsvPage + 1);
        }
    };





    return (
        <div className="flex flex-col items-center bg-gray-50 pt-8">
            <div className="w-full max-w-2xl space-y-6">
                {/* Onglets */}
                <div className="flex border-b border-gray-300 mb-6">
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`py-2 px-4 text-xl font-medium ${activeTab === 'import' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        Importer
                    </button>
                    <button
                        onClick={() => setActiveTab('fournisseurs')}
                        className={`py-2 px-4 text-xl font-medium ${activeTab === 'fournisseurs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                    >
                        Fournisseurs Importés
                    </button>
                </div>

                {/* Contenu de l'onglet Importer */}
                {activeTab === 'import' && (
                    <div>
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Import de Fournisseurs</h2>
                            <p className="text-gray-600 text-lg">Importez votre liste de fournisseurs au format CSV</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
                                  hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={onFileChange}
                                    className="hidden"
                                    id="csvFile"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="csvFile"
                                    className={`cursor-pointer flex flex-col items-center ${isUploading ? 'opacity-50' : ''}`}
                                >
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <svg className="lucide lucide-upload" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M12 3v12M9 10l3 3 3-3" />
                                        </svg>
                                    </div>
                                    <span className="text-xl font-medium text-gray-700 mb-2">
                                        {isUploading ? 'Importation en cours...' : 'Déposez votre fichier CSV ici'}
                                    </span>
                                    <span className="text-base text-gray-500">
                                        ou <span className="text-blue-600 hover:text-blue-700 underline font-medium">parcourez vos fichiers</span>
                                    </span>
                                </label>

                                {file && (
                                    <div className="flex items-center justify-center space-x-2 mt-4">
                                        <div className="bg-gray-100 px-4 py-2 rounded-full text-gray-700 border border-gray-200 font-medium">
                                            {file.name}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={onFileUpload}
                                    disabled={isUploading || !file}
                                    className="mt-4 inline-flex items-center px-6 py-3 bg-blue-600 
                                     text-xl font-bold text-gray-800 hover:bg-blue-700 hover:text-blue
                                     disabled:opacity-50 transition-all duration-300 font-medium 
                                     shadow-sm hover:shadow-md group text-lg"
                                >
                                    {isUploading ? (
                                        <>
                                            <span className="animate-spin mr-2">⚬</span>
                                            Importation...
                                        </>
                                    ) : (
                                        <>
                                            Importer
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </>
                                    )}
                                </button>


                            </div>
                            <div className="flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mt-2 rounded">
                                <span className="text-xl mr-2" role="img" aria-label="warning">⚠️</span>
                                <span><strong> Avant importation, merci de bien vérifier que votre fichier ne contient pas de doublons.</strong></span>
                            </div>

                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                            <div className="flex items-start space-x-4">
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <svg className="lucide lucide-help-circle" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2zm0 4c-1.5 0-2.6.5-3.5 1.4-.9.9-1.4 2.1-1.4 3.5s.5 2.6 1.4 3.5C9.4 14.5 10.5 15 12 15s2.6-.5 3.5-1.4c.9-.9 1.4-2.1 1.4-3.5s-.5-2.6-1.4-3.5C14.6 6.5 13.5 6 12 6zm0 6c-.8 0-1.5-.3-2.1-.9-.6-.6-.9-1.3-.9-2.1 0-.8.3-1.5.9-2.1C10.5 5.3 11.2 5 12 5c.8 0 1.5.3 2.1.9.6.6.9 1.3.9 2.1 0 .8-.3 1.5-.9 2.1C13.5 11.7 12.8 12 12 12z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                                        Format du fichier CSV
                                    </h3>
                                    <div className="w-full max-w-4xl text-center">
                                        <img src="https://www.3findustrie.com/wp-content/uploads/2025/03/imp.png" alt="Logo" className="w-[600px] h-[400px]" />
                                    </div>
                                </div>

                            </div>
                            <button
                                onClick={downloadExample}
                                className="mt-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Télécharger un fichier d'exemple
                            </button>
                        </div>


                        {csvData && csvData.length > 0 && (
                            <div>
                                <div className="overflow-x-auto shadow-md ring-1 ring-gray-300 rounded-lg">
                                    <h3 className="text-xl font-bold text-gray-500 mb-4">
                                        Aperçu des données  ({csvData.length}lignes)

                                    </h3>
                                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                                        <thead className="bg-gray-100 text-xs text-gray-600">
                                            <tr>
                                                {Object.keys(csvData[0]).map((header, index) => (
                                                    <th
                                                        key={index}
                                                        className="px-2 py-2 text-left font-medium tracking-wider text-gray-700 uppercase border-b"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-xs text-gray-600">
                                            {currentCsvItems.map((row, rowIndex) => (
                                                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    {Object.values(row).map((value, cellIndex) => (
                                                        <td key={cellIndex} className="px-2 py-2 text-left whitespace-nowrap border-b">
                                                            {value}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {csvData.length > csvItemsPerPage && (
                                        <div className="mt-2 text-xs text-gray-500 text-center">
                                            ... et {csvData.length - currentCsvItems.length} autres lignes
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-4 flex justify-center space-x-2">
                                    <button
                                        onClick={handleCsvPrevPage}
                                        disabled={currentCsvPage === 1}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                                    >
                                        Précédent
                                    </button>

                                    <span className="text-sm">
                                        Page {currentCsvPage} de {Math.ceil(csvData.length / csvItemsPerPage)}
                                    </span>

                                    <button
                                        onClick={handleCsvNextPage}
                                        disabled={currentCsvPage === Math.ceil(csvData.length / csvItemsPerPage)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {activeTab === 'fournisseurs' && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md mt-6 w-full max-w-2xl">
                        <h3 className="text-xl font-bold text-gray-500 mb-4">
                            Fournisseurs importés ({importedFournisseurs.length})
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300 border-separate border-spacing-0">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-300">Nom</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-300">Téléphone</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b border-gray-300">Email</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {currentItems.map((fournisseur, index) => (
                                        <tr key={fournisseur.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">{fournisseur.nom}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">{fournisseur.telephone}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200">{fournisseur.email}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(currentPage < Math.ceil(importedFournisseurs.length / itemsPerPage) ? currentPage + 1 : currentPage)}
                                disabled={currentPage === Math.ceil(importedFournisseurs.length / itemsPerPage)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-300"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>



                )}

            </div>
        </div>
    );
};

export default CSVUpload;
