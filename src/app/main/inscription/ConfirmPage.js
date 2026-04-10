import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import * as Actions from 'app/store/actions';
import { FuseSplashScreen } from '@fuse';
import _ from '@lodash';


function ConfirmPage(props) {
    const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);
    const login = useSelector(({ auth }) => auth.login);
    const params = props.match.params;
    const { confirmationToken } = params;

    useEffect(() => {
        if (confirmationToken) {
            dispatch(authActions.submitLoginWithConfirmToken(confirmationToken));
        }
    }, [dispatch, confirmationToken]);

    useEffect(() => {
        if (user && user.role) {
            if (user.role === 'ROLE_FOURNISSEUR_PRE') {
                props.history.push('/register/fournisseur');
            } else if (user.role === 'ROLE_ACHETEUR_PRE') {
                props.history.push('/register/acheteur');
            } else if (user.role === 'ROLE_FOURNISSEUR') {
                props.history.push('/boopursal/fournisseur/dashboard');
            } else if (user.role === 'ROLE_ACHETEUR') {
                props.history.push('/boopursal/acheteur/dashboard');
            } else {
                props.history.push('/');
            }
        }
    }, [user, props.history]);

    useEffect(() => {
        if (login.error && (login.error.confirmationToken || login.error.Erreur)) {
            dispatch(
                Actions.showMessage({
                    message: _.map(login.error, function (value, key) {
                        return login.error.confirmationToken ? 'Le code d\'activation est incorrect' : value;
                    }),
                    autoHideDuration: 6000,
                    variant: 'error'
                }));
            
            const timer = setTimeout(() => {
                props.history.push('/login');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [dispatch, login.error, props.history]);


    return (
        <FuseSplashScreen />
    )
}

export default ConfirmPage;
