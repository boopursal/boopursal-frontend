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
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        background: "#f8fafc",
        minHeight: "100vh",
        display: 'flex',
        flexDirection: 'column'
    },
    headerWrapper: {
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
        color: "rgba(255, 255, 255, 0.8)",
        fontWeight: 500,
    },
    tabs: {
        marginTop: 32,
        '& .MuiTabs-indicator': {
            backgroundColor: '#ffffff',
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
    dateDisplay: {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '12px 24px',
        borderRadius: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: '#ffffff',
        fontWeight: 800,
        fontSize: '0.95rem'
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
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        dispatch(Actions.getWidgets());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Espace Acheteur | Boopursal Dashboard</title>
            </Helmet>

            <div className={classes.headerWrapper}>
                <div className={classes.headerOverlay}></div>
                <Container maxWidth="xl" style={{ position: 'relative', zIndex: 2 }}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item xs={12} md={7}>
                            <Typography className={classes.title}>Espace Acheteur Stratégique</Typography>
                            <Typography className={classes.subtitle}>Supervisez vos approvisionnements, centralisez vos RFQ et optimisez vos budgets.</Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
                            <div className={classes.dateDisplay}>
                                <Icon style={{ fontSize: 20 }}>calendar_today</Icon> {moment().format('DD MMM YYYY')}
                            </div>
                        </Grid>
                    </Grid>

                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        className={classes.tabs}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab className={classes.tab} label="Aperçu Global" />
                        <Tab className={classes.tab} label="Mes Demandes RFQ" />
                        <Tab className={classes.tab} label="Fournisseurs Favoris" />
                    </Tabs>
                </Container>
            </div>

            <div className={classes.contentBody}>
                <Container maxWidth="xl">
                    {widgets.loading === false ? (
                        <FuseAnimate animation="transition.slideUpIn" duration={400} key={activeTab}>
                            <div>
                                {activeTab === 0 && (
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={6} md={3}><Widget3 widget={widgets.data.widget3} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget1 widget={widgets.data.widget1} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget2 widget={widgets.data.widget2} /></Grid>
                                        <Grid item xs={12} sm={6} md={3}><Widget4 widget={widgets.data.widget4} /></Grid>
                                        <Grid item xs={12}><Widget6 /></Grid>
                                    </Grid>
                                )}

                                {activeTab === 1 && (
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={8}><Widget6 /></Grid>
                                        <Grid item xs={12} md={4}>
                                            <div className="flex flex-col" style={{ gap: '32px', height: '100%' }}>
                                                <Widget1 widget={widgets.data.widget1} />
                                                <Widget3 widget={widgets.data.widget3} />
                                            </div>
                                        </Grid>
                                    </Grid>
                                )}

                                {activeTab === 2 && (
                                    <div className={classes.emptySpace}>
                                        <Typography variant="h5" style={{ fontWeight: 900, color: '#0f172a', marginBottom: 24 }}>Fournisseurs & Réseau</Typography>
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
                            <rect x="0" y="180" rx="24" ry="24" width="1200" height="240" />
                        </ContentLoader>
                    )}
                </Container>
            </div>
        </div>
    );
}

export default withReducer('dashboardApp', reducer)(DashboardApp);
