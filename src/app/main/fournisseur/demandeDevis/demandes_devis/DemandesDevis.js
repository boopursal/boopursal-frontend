import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import DemandesDevisTable from './DemandesDevisTable';
import DemandesDevisHeader from './DemandesDevisHeader';
import reducer from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";

function DemandesDevis() {

    const dispatch = useDispatch();
    const parametres = useSelector(({ demandesDevisFrsApp }) => demandesDevisFrsApp.demandesDevis.parametres);
    const user = useSelector(({ auth }) => auth.user);

    useEffect(() => {
        const userId = user.data?.id || user.id;
        if (userId) dispatch(Actions.getDemandes(parametres, userId));
    }, [dispatch, parametres, user]);

    return (
        <>
            <Helmet>
                <title>Demandes de devis | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <DemandesDevisHeader />
                }
                content={
                    <DemandesDevisTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('demandesDevisFrsApp', reducer)(DemandesDevis);
