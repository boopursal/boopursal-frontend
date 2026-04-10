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

    if (user.role === 'ROLE_FOURNISSEUR') {
        return <DashboardApp />;
    }

    if (user.role === 'ROLE_ACHETEUR') {
        return <DashboardAppAcheteur />;
    }

    if (user.role === 'ROLE_ADMIN') {
        return <DashboardAdmin />;
    }

    if (user.role === 'ROLE_Mediateur') {
        return <DashboardAppMediateur />;
    }

    if (user.role === 'ROLE_FOURNISSEUR_PRE') {
        return <Redirect to="/register/fournisseur" />;
    }

    if (user.role === 'ROLE_ACHETEUR_PRE') {
        return <Redirect to="/register/acheteur" />;
    }

    return (
        <div className="flex flex-1 items-center justify-center p-24">
            <Typography variant="h5" color="textSecondary">
                Chargement de votre espace...
            </Typography>
        </div>
    );
}

export default Dashboard;
