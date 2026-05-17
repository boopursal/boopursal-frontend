
import React from 'react';
import {authRoles} from 'app/auth';

export const focusProduitsConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.admin,
    routes  : [
        {
            path     : '/admin/focus-produits/:produitId',
            component: React.lazy(() => import('./focusProduit/FocusProduit'))
        },
        {
            path     : '/admin/focus-produits',
            component: React.lazy(() => import('./focusProduits/FocusProduits'))
        }
    ]
};
