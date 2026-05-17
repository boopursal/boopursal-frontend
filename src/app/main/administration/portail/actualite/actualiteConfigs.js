
import React from 'react';
import {authRoles} from 'app/auth';

export const actualiteConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.admin,
    routes  : [
        {
            path     : '/admin/actualites/:actualiteId',
            component: React.lazy(() => import('./actualite/Actualite'))
        },
        {
            path     : '/admin/actualites',
            component: React.lazy(() => import('./actualites/Actualites'))
        }
    ]
};
