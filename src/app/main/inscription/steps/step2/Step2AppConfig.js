import React from 'react';
import { authRoles } from 'app/auth';


export const Step2AppConfig =
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
        auth: authRoles.fournisseur_pre,
        routes: [
            {
                path: '/register/fournisseur',
                component: React.lazy(() => import('./Step2App'))
            }
        ]
    };
