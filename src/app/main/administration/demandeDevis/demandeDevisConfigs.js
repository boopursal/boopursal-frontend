
import React from 'react';
import { authRoles } from 'app/auth';

export const demandeDevisConfigs = {
    settings: {
        layout: {}
    },
    auth: authRoles.admin,
    routes: [
        {
            path: '/demandes_devis/:demandeId',
            component: React.lazy(() => import('./demande_devis/DemandeDevis'))
        },
        {
            path: '/dv_ntraite',
            component: React.lazy(() => import('./demandes_devis/DemandesDevis'))
        },
        {
            path: '/dv_traite',
            component: React.lazy(() => import('./demandes_devis_traitees/DemandesDevis'))
        },
        {
            path: '/demandesdevis/corbeille',
            component: React.lazy(() => import('./demandes_devis_supprimer/DemandesDevis'))
        }
    ]
};
