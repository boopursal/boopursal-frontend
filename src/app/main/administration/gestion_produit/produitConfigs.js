
import React from 'react';
import {authRoles} from 'app/auth';

export const produitConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.admin,
    routes  : [
        {
            path     : '/products/:produitId',
            component: React.lazy(() => import('./produit/Produit'))
        },
        {
            path     : '/products',
            exact    : true,
            component: React.lazy(() => import('./produits/Produits'))
        }
    ]
};
