
import React from 'react';
import { authRoles } from 'app/auth';

export const fournisseursConfigs = {
    settings: {
        layout: {}
    },
    auth: authRoles.admin,
    routes: [
        {
            path: '/users/fournisseur/show/:fournisseurId',
            component: React.lazy(() => import('./fournisseur/FournisseurDetails'))
        },
        {
            path: '/users/fournisseurs/:fournisseurId',
            component: React.lazy(() => import('./fournisseur/Fournisseur'))
        },
        {
            path: '/users/fournisseurs',
            component: React.lazy(() => import('./fournisseurs/Fournisseurs'))
        }
    ]
};
