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

    if (hasRole('ROLE_FOURNISSEUR')) {
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

    if (hasRole('ROLE_FOURNISSEUR_PRE')) {
        console.log('[DASHBOARD DEBUG] Redirecting to supplier registration steps');
        return <Redirect to="/register/fournisseur" />;
    }

    if (hasRole('ROLE_ACHETEUR_PRE')) {
        console.log('[DASHBOARD DEBUG] Redirecting to buyer registration steps');
        return <Redirect to="/register/acheteur" />;
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
