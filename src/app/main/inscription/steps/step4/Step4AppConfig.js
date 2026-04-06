import React from 'react';
import { authRoles } from 'app/auth';


export const Step4AppConfig =
    {
        settings: {
            layout: {
                config: {

                    navbar: {
                        display: false
                    },
                    toolbar: {
                        display: false
                    },
                    footer: {
                        display: false
                    },

                }
            }
        },
        auth: authRoles.acheteur_pre,
        routes: [
            {
                path: '/register/ac2',
                component: React.lazy(() => import('./Step4App'))
            }
        ]
    };
