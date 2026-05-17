
import React from 'react';
import {authRoles} from 'app/auth';

export const produitConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.fournisseur,
    routes  : [
        {
            path     : '/produits/:produitId',
            component: React.lazy(() => import('./produit/Produit'))
        },
        {
            path     : '/produits',
            component: React.lazy(() => import('./produits/Produits'))
        }
    ]
};
