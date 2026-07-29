import React from 'react';

export const ForgotPasswordPageConfig = {
    settings: {
        layout: {
            style: 'layout3',
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: true
                },
                footer        : {
                    display: true
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : '/forgot-password',
            component: React.lazy(() => import('./ForgotPasswordPage'))
        },
        {
            path     : '/email-reset',
            component: React.lazy(() => import('./MailReset'))
        },
        {
            path     : '/reset-password/:token/',
            component: React.lazy(() => import('./ResetPassword'))
        },
    ]
};
