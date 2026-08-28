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
        if (login.success && user) {
            const discr = user.data?.discr || user.discr;
            const role = typeof user.role === 'string' ? user.role : (user.data && typeof user.data.role === 'string' ? user.data.role : null);
            const roles = (user.data && Array.isArray(user.data.roles)) ? user.data.roles : (role ? [role] : []);

            console.log('[ConfirmPage] Successful email confirmation. Discr:', discr, 'Role:', role, 'Roles:', roles);

            if (discr === 'fournisseur' || roles.includes('ROLE_FOURNISSEUR_PRE') || role === 'ROLE_FOURNISSEUR_PRE') {
                if (user.data?.fournisseur?.is_complet) {
                    props.history.push('/boopursal/fournisseur/dashboard');
                } else {
                    props.history.push('/onboarding/fournisseur');
                }
            } else if (discr === 'acheteur' || roles.includes('ROLE_ACHETEUR_PRE') || role === 'ROLE_ACHETEUR_PRE') {
                if (user.data?.acheteur?.is_complet) {
                    props.history.push('/boopursal/acheteur/dashboard');
                } else {
                    props.history.push('/onboarding/acheteur');
                }
            } else if (roles.includes('ROLE_FOURNISSEUR') || role === 'ROLE_FOURNISSEUR') {
                props.history.push('/boopursal/fournisseur/dashboard');
            } else if (roles.includes('ROLE_ACHETEUR') || role === 'ROLE_ACHETEUR') {
                props.history.push('/boopursal/acheteur/dashboard');
            } else {
                props.history.push('/dashboard');
            }
        }
    }, [login.success, user, props.history]);

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
