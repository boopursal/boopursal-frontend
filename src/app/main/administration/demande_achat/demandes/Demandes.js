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
    const parametres = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.parametres);


    useEffect(() => {
        dispatch(Actions.getDemandes(parametres));
    }, [dispatch, parametres]);

    return (
        <>
            <Helmet>
                <title>Demandes achats | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex",
                }}
                content={
                    <DemandesTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('demandesAdminApp', reducer)(Demandes);
