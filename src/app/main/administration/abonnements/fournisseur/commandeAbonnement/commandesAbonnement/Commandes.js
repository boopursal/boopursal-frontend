import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import CommandesTable from './CommandesTable';
import CommandesHeader from './CommandesHeader';
import reducer from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";

function Commandes() {

    const dispatch = useDispatch();
    const parametres = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.parametres);

    useEffect(() => {
        dispatch(Actions.getCommandesAb(parametres));
    }, [dispatch, parametres]);

    return (
        <>
            <Helmet>
                <title>Commande abonnement | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex flex-col h-full",
                }}
                content={
                    <CommandesTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('commandeOffreAdminApp', reducer)(Commandes);
