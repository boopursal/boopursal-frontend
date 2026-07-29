import React, { useRef, useState, useEffect } from 'react';
import { Tab, Tabs, Typography } from '@material-ui/core';
import { FusePageSimple,LOCAL_CURRENCY } from '@fuse';
import { makeStyles } from '@material-ui/styles';
import { Helmet } from "react-helmet";
import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import MonAbonnement from './tabs/MonAbonnement';
import Packs from './tabs/Packs';
import HistoriqueFacturation from './tabs/HistoriqueFacturation';
import { useDispatch, useSelector } from 'react-redux';
import CommandeDialog from './tabs/CommandeDialog';
import * as Actions from './store/actions';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    }
}));

function FacturationApp(props) {

    const classes = useStyles(props);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const pageLayout = useRef(null);
    const [tabValue, setTabValue] = useState(0);
    const user = useSelector(({ auth }) => auth.user);
    const params = props.match.params;
    const { tab } = params;
    const abonnement = useSelector(({ auth }) => auth.user.abonnement);

    useEffect(() => {
        if (!tab) {
            return;
        }
        switch (tab) {
            case "pack":
                return setTabValue(2);
            case "renew":
                return handleRenew();
            default:
                return setTabValue(0);
        }
    }, [tab, setTabValue]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleRenew() {
        if (!abonnement) {
            return;
        }
        const data = {
            offre: abonnement.offre,
            sousSecteurs: abonnement.sousSecteurs,
            mode: abonnement.mode,
            duree: abonnement.duree,
            type: true,
            suggestions: [],
            renew: true
        };
        dispatch(Actions.openEditCommandeDialog(data));
    }
    return (
        <>
            <Helmet>
                <title>{t('billing.title', 'Facturations')} | Boopursal</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageSimple
                classes={{
                    toolbar: "min-h-48 h-48",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}
                header={
                    <div className="flex flex-col justify-between flex-1 px-24 pt-24">
                        <div className="flex justify-between">
                            <Typography className="py-0 sm:py-24" variant="h4">{t('billing.title', 'Facturations')}</Typography>

                        </div>
                    </div>
                }
                contentToolbar={
                    <Tabs
                        value={tabValue}
                        onChange={handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="off"
                        className="w-full border-b-1 px-24"
                    >
                        <Tab className="text-14 font-600 normal-case" label={t('billing.mySubscription', 'Mon abonnement')} />
                        <Tab className="text-14 font-600 normal-case" label={t('billing.invoiceHistory', 'Mon historique de facturation')} />
                        <Tab className="text-14 font-600 normal-case" label={t('billing.packs', 'Les Packs d\'abonnements')} />
                    </Tabs>
                }
                content={
                    <div className="p-12">
                        {tabValue === 0 && (
                            <MonAbonnement />
                        )}
                        {tabValue === 1 && (
                            <HistoriqueFacturation />
                        )}
                        {tabValue === 2 && (
                            <Packs currency={user.data ? user.data.currency : LOCAL_CURRENCY} />
                        )}

                    </div>
                }
                ref={pageLayout}
            />
            <CommandeDialog currency={user.data ? user.data.currency : LOCAL_CURRENCY} />
        </>
    );
}

export default withReducer('facturationApp', reducer)(FacturationApp);

