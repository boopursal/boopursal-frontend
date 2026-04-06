import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { Typography, Grid, Breadcrumbs, Button, Icon, LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import SideBareSearch from './SideBareSearch';
import HomeIcon from '@material-ui/icons/Home';
import ContentList from './ContentList';
import _ from '@lodash';
import { Helmet } from "react-helmet";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: '#f8fafc'
    },
    header: {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        padding: '40px 0 80px',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("assets/images/backgrounds/pattern-dot.svg") repeat',
            opacity: 0.1
        }
    },
    headerContent: {
        position: 'relative',
        zIndex: 10
    },
    breadcrumbs: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.8125rem',
        marginBottom: 16,
        '& a': {
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        },
        '& .MuiTypography-root': {
            fontSize: '0.8125rem',
            color: 'white',
            fontWeight: 700
        }
    },
    mainTitle: {
        fontSize: '2.5rem',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.75rem'
        }
    },
    container: {
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        padding: '0 24px'
    },
    contentWrapper: {
        marginTop: -40,
        position: 'relative',
        zIndex: 20,
        paddingBottom: 80
    },
    switchContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: '6px',
        borderRadius: 20,
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)'
    },
    switchBtn: {
        borderRadius: 16,
        padding: '10px 28px',
        fontWeight: 800,
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: 160,
        '&.active': {
            backgroundColor: 'white',
            color: theme.palette.primary.main,
            boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)',
            zIndex: 1,
            '&:hover': {
                backgroundColor: 'white',
            }
        },
        '&.inactive': {
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.9)',
            '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
            }
        }
    }
}));

function useQuery(location) {
    return new URLSearchParams(location.search);
}

function DemandesAchatsApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery(props.location);
    const params = props.match.params;
    const { secteur, activite } = params;
    const pays = query.get("pays");
    const ville = query.get("ville");
    const q = query.get("q");

    const parametres = useSelector(({ demandesAchat }) => demandesAchat.demandes.parametres);
    const loading = useSelector(({ demandesAchat }) => demandesAchat.demandes.loading);
    const demandes = useSelector(({ demandesAchat }) => demandesAchat.demandes.data);

    useEffect(() => {
        dispatch(Actions.getDemandeAchats(params, pays, ville, parametres, q));
    }, [dispatch, params, pays, parametres, ville, q]);

    useEffect(() => {
        if (!secteur && !pays) dispatch(Actions.getSecteursAndPaysCounts(q));
        if (!secteur && pays) {
            dispatch(Actions.getSecteursCounts(params, pays, ville, q));
            dispatch(Actions.getVilleCounts(params, pays, q));
        }
        if (secteur) {
            if (activite) dispatch(Actions.getCategoriesCounts(params, pays, ville, q));
            else dispatch(Actions.getActivitesCounts(params, pays, ville, q));
            if (!pays) dispatch(Actions.getPaysCounts(params, pays, q));
            else dispatch(Actions.getVilleCounts(params, pays, q));
        }
    }, [dispatch, params, pays, ville, activite, secteur, q]);

    const getBreadcrumbTitle = () => {
        if (activite) return _.capitalize(activite.replace('-', ' '));
        if (secteur) return _.capitalize(secteur.replace('-', ' '));
        return null;
    };

    if (loading && !demandes.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <LinearProgress className="w-full max-w-xs rounded-full h-4" color="primary" />
                <Typography className="mt-16 text-slate-500 font-semibold animate-pulse">Chargement des demandes...</Typography>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{`Demandes d'achats ${getBreadcrumbTitle() || ''} - Boopursal`}</title>
            </Helmet>

            <div className={classes.header}>
                <div className={classes.container}>
                    <div className={classes.headerContent}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs}>
                            <Link to="/" className="flex items-center"><HomeIcon className="text-16 mr-4" /> Accueil</Link>
                            <Link to="/demandes-achats">Demandes d'achats</Link>
                            {secteur && <Typography color="inherit">{getBreadcrumbTitle()}</Typography>}
                        </Breadcrumbs>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-24">
                            <div className="flex-1">
                                <Typography className={classes.mainTitle}>
                                    Demandes d'achats {getBreadcrumbTitle() && <span># {getBreadcrumbTitle()}</span>}
                                </Typography>
                                {pays && (
                                    <div className="flex items-center mt-8 text-blue-100 font-medium">
                                        <Icon className="text-18 mr-4">location_on</Icon>
                                        Localisation: {_.capitalize(pays)} {ville && `, ${_.capitalize(ville)}`}
                                    </div>
                                )}
                            </div>
                            
                            <div className={classes.switchContainer}>
                                <Button className={clsx(classes.switchBtn, "active")}>
                                    Demandes
                                </Button>
                                <Button onClick={() => props.history.push('/vente-produits')} className={clsx(classes.switchBtn, "inactive")}>
                                    Produits
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.container}>
                <div className={classes.contentWrapper}>
                    <Grid container spacing={4}>
                        <Grid item lg={3} md={4} xs={12}>
                            <SideBareSearch {...props} />
                        </Grid>
                        <Grid item lg={9} md={8} xs={12}>
                            <ContentList />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    );
}

export default withReducer('demandesAchat', reducer)(DemandesAchatsApp);