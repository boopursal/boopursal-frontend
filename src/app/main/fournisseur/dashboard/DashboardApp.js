import React, { useEffect, useState } from 'react';
import { Typography, makeStyles, Container, Grid, Tab, Tabs, Button, Icon, Box } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions'
import reducer from './store/reducers';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import ContentLoader from 'react-content-loader';
import { Helmet } from "react-helmet";
import moment from 'moment';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#f4f7fe",
        minHeight: "100vh",
        display: 'flex',
        flexDirection: 'column'
    },
    headerWrapper: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        position: 'relative',
        paddingTop: 60,
        paddingBottom: 120,
        overflow: 'hidden'
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("assets/images/backgrounds/pattern-dot.svg") repeat',
        opacity: 0.1
    },
    title: {
        fontSize: "2.25rem",
        fontWeight: 900,
        color: "#ffffff",
        letterSpacing: "-0.02em",
        marginBottom: 8
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "rgba(255, 255, 255, 0.7)",
        fontWeight: 500,
    },
    tabs: {
        marginTop: 32,
        '& .MuiTabs-indicator': {
            backgroundColor: '#3b82f6',
            height: 4,
            borderRadius: '4px 4px 0 0',
        }
    },
    tab: {
        textTransform: 'none',
        fontWeight: 700,
        fontSize: '0.95rem',
        minWidth: 140,
        color: 'rgba(255, 255, 255, 0.6)',
        '&.Mui-selected': {
            color: '#ffffff',
        }
    },
    contentBody: {
        marginTop: -80,
        paddingBottom: 80,
        position: 'relative',
        zIndex: 10
    },
    subscriptionCard: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '16px 24px',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        [theme.breakpoints.down('sm')]: {
            marginTop: 24,
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 16
        }
    },
    subStatusActive: {
        color: '#4ade80',
        fontWeight: 800
    },
    subStatusExpired: {
        color: '#f87171',
        fontWeight: 800
    },
    actionBtn: {
        background: '#3b82f6',
        color: '#ffffff',
        fontWeight: 700,
        borderRadius: 12,
        padding: '8px 24px',
        '&:hover': {
            background: '#2563eb'
        }
    },
    emptySpace: {
        background: '#ffffff',
        borderRadius: 24,
        padding: 40,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
    }
}));

function DashboardApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const abonnement = useSelector(({ auth }) => auth.user.abonnement);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        dispatch(Actions.getWidgets());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (!widgets) return null;

    const daysRemaining = abonnement ? moment(abonnement.expired).diff(moment(), 'days') : 0;
    const isExpired = daysRemaining <= 0;

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Tableau de bord Fournisseur | Boopursal</title>
            </Helmet>

            <div className={classes.headerWrapper}>
                <div className={classes.headerOverlay}></div>
                <Container maxWidth="xl" style={{ position: 'relative', zIndex: 2 }}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item xs={12} md={6}>
                            <Typography className={classes.title}>Espace Fournisseur</Typography>
                            <Typography className={classes.subtitle}>Supervisez vos performances commerciales et gérez vos offres avec précision.</Typography>
                        </Grid>

                        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {abonnement && (
                                <div className={classes.subscriptionCard}>
                                    <div>
                                        <Typography variant="overline" style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, display: 'block', lineHeight: 1.2 }}>
                                            Mon Forfait
                                        </Typography>
                                        <Typography variant="h6" style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', marginBottom: 4 }}>
                                            {abonnement.offre?.name || 'Standard'}
                                        </Typography>
                                        <Typography className={isExpired ? classes.subStatusExpired : classes.subStatusActive}>
                                            {isExpired ? 'Expiré' : `${daysRemaining} jours restants`}
                                        </Typography>
                                    </div>
                                    <Button component={Link} to="/billing/renew" className={classes.actionBtn} disableElevation>
                                        Gérer l'accès
                                    </Button>
                                </div>
                            )}
                        </Grid>
                    </Grid>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        className={classes.tabs}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab className={classes.tab} label="Vue Globale" />
                        <Tab className={classes.tab} label="Conversions & Produits" />
                        <Tab className={classes.tab} label="Abonnement" />
                    </Tabs>
                </Container>
            </div>

            <div className={classes.contentBody}>
                <Container maxWidth="xl">
                    {(widgets.loading === false && widgets.data) ? (
                        <FuseAnimate animation="transition.slideUpIn" duration={400} key={activeTab}>
                            <div>
                                {activeTab === 0 && (
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={6} md={3}><Widget1 widget={widgets.data.widget1} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget2 widget={widgets.data.widget2} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget3 widget={widgets.data.widget3} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget4 widget={widgets.data.widget4} /></Grid>
                                        <Grid item xs={12} lg={8}><Widget6 /></Grid>
                                        <Grid item xs={12} lg={4}><Widget2 widget={widgets.data.widget2} /></Grid>
                                    </Grid>
                                )}

                                {activeTab === 1 && (
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} lg={8}><Widget6 /></Grid>
                                        <Grid item xs={12} lg={4}>
                                            <div className="flex flex-col" style={{ gap: '32px', height: '100%' }}>
                                                <Widget1 widget={widgets.data.widget1} />
                                                <Widget3 widget={widgets.data.widget3} />
                                            </div>
                                        </Grid>
                                    </Grid>
                                )}

                                {activeTab === 2 && (
                                    <div className={classes.emptySpace}>
                                        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>Mon Abonnement Pro</Typography>
                                        <Widget5 />
                                    </div>
                                )}
                            </div>
                        </FuseAnimate>
                    ) : (
                        <ContentLoader speed={2} width={1200} height={400} backgroundColor="#e2e8f0" foregroundColor="#cbd5e1">
                            <rect x="0" y="0" rx="24" ry="24" width="280" height="150" />
                            <rect x="306" y="0" rx="24" ry="24" width="280" height="150" />
                            <rect x="612" y="0" rx="24" ry="24" width="280" height="150" />
                            <rect x="918" y="0" rx="24" ry="24" width="280" height="150" />
                            <rect x="0" y="180" rx="24" ry="24" width="790" height="300" />
                            <rect x="820" y="180" rx="24" ry="24" width="380" height="300" />
                        </ContentLoader>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default withReducer('dashboardApp', reducer)(DashboardApp);
