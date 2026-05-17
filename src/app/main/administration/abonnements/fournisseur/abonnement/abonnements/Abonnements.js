import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import AbonnementsTable from './AbonnementsTable';
import AbonnementsHeader from './AbonnementsHeader';
import reducer from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";

function Abonnements() {

    const dispatch = useDispatch();
    const parametres = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.parametres);

    useEffect(() => {
        dispatch(Actions.getAbonnements(parametres));
    }, [dispatch, parametres]);

    return (
        <>
            <Helmet>
                <title>Abonnements | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex flex-col h-full",
                }}
                content={
                    <AbonnementsTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('abonnementOffreApp', reducer)(Abonnements);
