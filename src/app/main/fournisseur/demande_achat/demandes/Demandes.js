import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import DemandesTable from './DemandesTable';
import DemandesHeader from './DemandesHeader';
import reducer from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";

function Demandes() {

    const dispatch = useDispatch();
    const parametres = useSelector(({ demandesApp }) => demandesApp.demandes.parametres);
    const user = useSelector(({ auth }) => auth.user);


    useEffect(() => {
        const userId = user.data?.id || user.id;
        if (userId) dispatch(Actions.getDemandes(parametres, userId));
    }, [dispatch, parametres, user]);

    return (
        <>
            <Helmet>
                <title>RFQs | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex flex-col h-full",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <DemandesHeader />
                }
                content={
                    <DemandesTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('demandesApp', reducer)(Demandes);
