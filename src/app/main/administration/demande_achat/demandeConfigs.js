
import React from 'react';
import {authRoles} from 'app/auth';

export const demandeConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.admin,
    routes  : [
        {
            path     : '/demandes_admin/:demandeId',
            component: React.lazy(() => import('./demande/Demande'))
        },
        {
            path     : '/demandes_admin',
            component: React.lazy(() => import('./demandes/Demandes'))
        }
    ]
};
