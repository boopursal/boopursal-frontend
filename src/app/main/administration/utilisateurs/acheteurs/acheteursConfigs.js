
import React from 'react';
import { authRoles } from 'app/auth';

export const acheteursConfigs = {
    settings: {
        layout: {}
    },
    auth: authRoles.admin,
    routes: [
        {
            path: '/users/acheteur/show/:acheteurId',
            component: React.lazy(() => import('./acheteur/AcheteurDetails'))
        },
        {
            path: '/users/acheteurs/:acheteurId',
            component: React.lazy(() => import('./acheteur/Acheteur'))
        },
        {
            path: '/users/acheteurs',
            component: React.lazy(() => import('./acheteurs/Acheteurs'))
        }
    ]
};
