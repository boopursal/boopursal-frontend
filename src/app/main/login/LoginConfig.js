import Login from './Login';
import {authRoles} from 'app/auth';

export const LoginConfig = {
    settings: {
        layout: {
            style: 'layout1',
            config: {
                mode: 'fullwidth',
                scroll: 'content',
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
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

