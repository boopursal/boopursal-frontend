import React from 'react';
import { authRoles } from 'app/auth';

export const OnboardingConfig = {
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
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    auth: authRoles.registe,
    routes: [
        {
            path: '/onboarding/fournisseur',
            component: React.lazy(() => import('./SupplierOnboarding'))
        },
        {
            path: '/onboarding/acheteur',
            component: React.lazy(() => import('./BuyerOnboarding'))
        }
    ]
};
