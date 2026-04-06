import React from 'react';


export const InscriptionConfig = {
    settings: {
        layout: {
            style: 'layout1',
            config: {
                mode: 'fullwidth',
                scroll: 'content',
                navbar: {
                    display: false
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false,
                    style: 'static'
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        },
        theme: {
            main: 'greeny',
        },
    },
    routes: [
        {
            exact: true,
            path: '/register/confirm/:confirmationToken',
            component: React.lazy(() => import('./ConfirmPage'))
        },
        {
            exact: true,
            path: '/register/:page',
            component: React.lazy(() => import('./RegisterPage'))
        },
        {
            exact: true,
            path: '/mail-confirm',
            component: React.lazy(() => import('./MailConfirmPage'))
        }
    ]
};