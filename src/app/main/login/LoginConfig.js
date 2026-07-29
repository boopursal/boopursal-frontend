import Login from './Login';
import {authRoles} from 'app/auth';

export const LoginConfig = {
    settings: {
        layout: {
            style: 'layout3',
            config: {
                mode: 'fullwidth',
                scroll: 'content',
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
    auth    : authRoles.onlyGuest,
    routes  : [
        {
            path     : '/login',
            component: Login
        }
    ]
};

