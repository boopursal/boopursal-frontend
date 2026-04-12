import React from 'react';
import { useSelector } from 'react-redux';
import DashboardApp from '../fournisseur/dashboard/DashboardApp';
import DashboardAppAcheteur from '../acheteur/dashboard/DashboardApp';
import { Typography } from '@material-ui/core';
import DashboardAdmin from '../administration/dashboard/DashboardAdmin';
import DashboardAppMediateur from '../mediateur/dashboard/DashboardApp';

import { Redirect } from 'react-router-dom';

function Dashboard(props) {
    const user = useSelector(({ auth }) => auth.user);
    const role = user.role;

    console.log('[DASHBOARD DEBUG] Current user role:', role);

    const hasRole = (r) => {
        if (Array.isArray(role)) return role.includes(r);
        return role === r;
    };

    if (hasRole('ROLE_FOURNISSEUR') || (hasRole('ROLE_FOURNISSEUR_PRE') && user?.data?.fournisseur?.is_complet)) {
        return <DashboardApp />;
    }

    if (hasRole('ROLE_ACHETEUR')) {
        return <DashboardAppAcheteur />;
    }

    if (hasRole('ROLE_ADMIN')) {
        return <DashboardAdmin />;
    }

    if (hasRole('ROLE_Mediateur')) {
        return <DashboardAppMediateur />;
    }

    if (hasRole('ROLE_FOURNISSEUR_PRE') || hasRole('ROLE_ACHETEUR_PRE')) {
        // Sécurité ultime: si le profil est marqué complet en base (et donc dans user.data), on ne redirige PAS vers l'onboarding
        if (user?.data?.fournisseur?.is_complet || user?.data?.acheteur?.is_complet) {
            console.log('[DASHBOARD DEBUG] Profile is complete. Bypassing onboarding redirect despite PRE role.');
            return hasRole('ROLE_FOURNISSEUR_PRE') ? <DashboardApp /> : <DashboardAppAcheteur />;
        }

        let redirectPath = (user && user.data && user.data.redirect) ? user.data.redirect : (user && user.redirect ? user.redirect : null);
        
        // Redirection vers le NOUVEAU onboarding si on est sur l'ancien système
        if (!redirectPath || redirectPath.includes('/register/')) {
            redirectPath = hasRole('ROLE_FOURNISSEUR_PRE') ? '/onboarding/fournisseur' : '/onboarding/acheteur';
        }

        console.log('[DASHBOARD DEBUG] Redirecting to modern onboarding:', redirectPath);
        return <Redirect to={redirectPath} />;
    }



    return (
        <div className="flex flex-1 items-center justify-center p-24">
            <Typography variant="h5" color="textSecondary">
                Chargement de votre espace... ({String(role)})
            </Typography>
        </div>
    );
}

export default Dashboard;
