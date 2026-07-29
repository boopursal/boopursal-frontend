import Example from './Example';
import {authRoles} from 'app/auth';

export const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : null,
    routes  : [
        {
            path     : '/example',
            component: Example
        }
    ]
};

/**
 * Lazy load Example
 */
/*
import React from 'react';

export const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }
    ]
};
*/
