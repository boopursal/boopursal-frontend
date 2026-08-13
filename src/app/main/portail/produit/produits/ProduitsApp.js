import React, { useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { Typography, Grid, Breadcrumbs, Button, LinearProgress, Paper, Icon, Drawer, Fab } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: '#f8fafc',
        overflowX: 'hidden'
    },
    header: {
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(circle at 100% 0%, #1e293b 0%, transparent 50%), radial-gradient(circle at 0% 100%, #1e293b 0%, transparent 50%)',
        borderBottom: '1px solid #1e293b',
        padding: '32px 0 40px',
        position: 'relative',
        zIndex: 10
    },
    headerContent: {
        position: 'relative',
        zIndex: 10
    },
    breadcrumbs: {
        color: '#94a3b8',
        fontSize: '0.85rem',
        marginBottom: 12,
        '& a': {
            color: '#cbd5e1',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'color 0.2s',
            '&:hover': {
                color: 'white'
            }
        },
        '& .MuiTypography-root': {
            color: 'white',
            fontWeight: 700
        }
    },
    mainTitle: {
        fontSize: '2.25rem',
        fontWeight: 800,
        color: 'white',
        letterSpacing: '-0.02em',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '1.75rem'
        }
    },
    locationSubtitle: {
        fontSize: '1.15rem',
        color: '#cbd5e1',
        display: 'flex',
        alignItems: 'center',
        marginTop: '8px',
        fontWeight: 500,
        gap: '8px'
    },
    container: {
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
        [theme.breakpoints.down('sm')]: {
            padding: '0 12px',
        },
        [theme.breakpoints.down('xs')]: {
            padding: '0 8px',
        }
    },
    contentWrapper: {
        marginTop: 24,
        position: 'relative',
        zIndex: 20,
        paddingBottom: 64,
        [theme.breakpoints.down('sm')]: {
            paddingBottom: 96
        }
    },
    switchContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '4px',
        borderRadius: 12,
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        alignSelf: 'flex-start',
        [theme.breakpoints.down('sm')]: {
            marginTop: 20
        }
    },
    switchBtn: {
        borderRadius: 8,
        padding: '10px 24px',
        fontWeight: 600,
        fontSize: '0.9rem',
        textTransform: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: 130,
        letterSpacing: '0.02em',
        [theme.breakpoints.down('xs')]: {
            minWidth: 100,
            padding: '8px 16px',
            fontSize: '0.85rem'
        },
        '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1
        },
        '&.inactive': {
            backgroundColor: 'transparent',
            color: '#94a3b8',
            '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
        }
    },
    filterFab: {
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        fontWeight: 700,
        fontSize: '0.9rem',
        textTransform: 'none',
        padding: '0 18px',
        borderRadius: 40,
        height: 44,
        boxShadow: '0 4px 16px -4px rgba(0,0,0,0.3)',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark
        }
    },
    drawerPaper: {
        width: '85vw',
        maxWidth: 360,
        padding: '24px 16px',
        backgroundColor: '#f8fafc'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #e2e8f0'
    }
}));

function useQuery(location) {
    return new URLSearchParams(location.search);
}

function ProduitsApp(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const dispatch = useDispatch();
    const query = useQuery(props.location);
    const params = props.match.params;
    const { secteur, activite, categorie } = params;
    const pays = query.get("pays");
    const q = query.get("q");
    const ville = query.get("ville");

    const parametres = useSelector(({ produitsApp }) => produitsApp.produits.parametres);
    const produits = useSelector(({ produitsApp }) => produitsApp.produits.data);
    const loading = useSelector(({ produitsApp }) => produitsApp.produits.loading);
    const secteurs = useSelector(({ produitsApp }) => produitsApp.produits.secteurs);
    const activites = useSelector(({ produitsApp }) => produitsApp.produits.activites);
    const categories = useSelector(({ produitsApp }) => produitsApp.produits.categories);

    useEffect(() => {
        dispatch(Actions.getProduits(params, pays, parametres, ville, q));
        if (isMobile) setFilterDrawerOpen(false);
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
    }, [dispatch, params, pays, ville, q, activite, secteur]);

    const handleUrlEntreprises = () => {
        const path = (secteur ? '/' + secteur : '') + (activite ? '/' + activite : '') + (categorie ? '/' + categorie : '');
        const searchText = pays ? (q ? '&q=' + q : '') : (q ? 'q=' + q : '');
        props.history.push({ pathname: '/entreprises' + path, search: (pays ? 'pays=' + pays : '') + searchText });
    };

    const getSecteurTitle = () => secteurs.length > 0 ? secteurs.find(x => x.slug === secteur)?.name : (secteur ? _.capitalize(secteur.replace(/-/g, ' ')) : '');
    const getActiviteTitle = () => activites.length > 0 ? activites.find(x => x.slug === activite)?.name : (activite ? _.capitalize(activite.replace(/-/g, ' ')) : '');
    const getCategorieTitle = () => categories.length > 0 ? categories.find(x => x.slug === categorie)?.name : (categorie ? _.capitalize(categorie.replace(/-/g, ' ')) : '');

    const getBreadcrumbTitle = () => {
        if (categorie) return getCategorieTitle();
        if (activite) return getActiviteTitle();
        if (secteur) return getSecteurTitle();
        return null;
    };

    if (loading && !produits.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <LinearProgress className="w-full max-w-xs rounded-full h-4" color="primary" />
                <Typography className="mt-16 text-slate-500 font-semibold animate-pulse">{t('portail.loading_products', 'Chargement des produits...')}</Typography>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{`Produits ${getBreadcrumbTitle() || ''} ${pays ? 'au ' + _.capitalize(pays) : ''} - Boopursal`}</title>
            </Helmet>

            <div className={classes.header}>
                <div className={classes.container}>
                    <div className={classes.headerContent}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" style={{ color: '#64748b' }} />} className={classes.breadcrumbs}>
                            <Link to="/" className="flex items-center"><HomeIcon className="text-16 mr-4" /> {t('portail.home', 'Accueil')}</Link>
                            <Link to="/vente-produits">{t('common.products', 'Produits')}</Link>
                            {secteur && <Typography color="inherit">{getBreadcrumbTitle()}</Typography>}
                        </Breadcrumbs>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-24">
                            <div className="flex-1">
                                <Typography component="div" className={classes.mainTitle}>
                                    <Icon style={{ fontSize: '2.5rem', color: theme.palette.primary.main }}>inventory</Icon>
                                    <div>
                                        {t('common.products', 'Produits')} {getBreadcrumbTitle() && <span style={{ color: theme.palette.primary.light }}>{getBreadcrumbTitle()}</span>}
                                    </div>
                                    {q && <span className="text-primary-main ml-8 text-xl">#{q}</span>}
                                </Typography>
                                {pays && (
                                    <div className={classes.locationSubtitle}>
                                        <Icon style={{ fontSize: '1.2rem', color: theme.palette.primary.main }}>location_on</Icon>
                                        {t('portail.location', 'Localisation')}: {_.capitalize(pays)} {ville && `, ${_.capitalize(ville)}`}
                                    </div>
                                )}
                            </div>

                            <div className={classes.switchContainer}>
                                <Button className={clsx(classes.switchBtn, "active")}>
                                    {t('common.products', 'Produits')}
                                </Button>
                                <Button onClick={handleUrlEntreprises} className={clsx(classes.switchBtn, "inactive")}>
                                    {t('portail.companies', 'Entreprises')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.container}>
                <div className={classes.contentWrapper}>
                    {produits.length === 0 ? (
                        <Paper className="p-32 sm:p-64 w-full text-center flex flex-col items-center justify-center rounded-20 sm:rounded-32 border-0" style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.05)', background: 'linear-gradient(to bottom, #ffffff, #f8fafc)' }}>
                            <div className="relative mb-24 sm:mb-32">
                                <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                                <div className="w-96 h-96 sm:w-144 sm:h-144 bg-white rounded-full shadow-2xl flex items-center justify-center relative z-10 border-4 border-slate-50">
                                    <Icon style={{ fontSize: isMobile ? 48 : 72 }} className="text-primary-main">inventory_off</Icon>
                                </div>
                            </div>
                            <Typography variant={isMobile ? 'h5' : 'h3'} className="mb-16 font-black text-slate-800 tracking-tight">{t('portail.no_products', 'Aucun produit trouvé')}</Typography>
                            <Typography className="mb-32 text-slate-500 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
                                {t('portail.no_products_desc', 'Nous n\'avons trouvé aucun produit correspondant à votre recherche.')}
                            </Typography>
                            <div className="flex flex-col sm:flex-row gap-12">
                                <Button variant="contained" color="primary" onClick={() => props.history.push('/')} className="px-24 sm:px-32 py-12 rounded-12 font-bold shadow-lg">
                                    {t('portail.back_home', "Retour à l'accueil")}
                                </Button>
                                <Button variant="outlined" onClick={() => props.history.goBack()} className="px-24 sm:px-32 py-12 rounded-12 font-bold border-slate-200">
                                    {t('portail.prev_page', 'Page précédente')}
                                </Button>
                            </div>
                        </Paper>
                    ) : (
                        <Grid container spacing={isMobile ? 2 : 4}>
                            {!isMobile && (
                                <Grid item lg={3} md={4} style={{ position: 'sticky', top: 24, alignSelf: 'flex-start' }}>
                                    <SideBareSearch {...props} />
                                </Grid>
                            )}
                            <Grid item lg={9} md={8} xs={12}>
                                <ContentList />
                            </Grid>
                        </Grid>
                    )}
                </div>
            </div>

            {/* Mobile filter drawer */}
            {isMobile && produits.length > 0 && (
                <>
                    <Fab
                        className={classes.filterFab}
                        variant="extended"
                        onClick={() => setFilterDrawerOpen(true)}
                    >
                        <Icon className="mr-8">tune</Icon>
                        {t('filters.title', 'Filtres')}
                    </Fab>

                    <Drawer
                        anchor="left"
                        open={filterDrawerOpen}
                        onClose={() => setFilterDrawerOpen(false)}
                        classes={{ paper: classes.drawerPaper }}
                    >
                        <div className={classes.drawerHeader}>
                            <Typography style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                                {t('filters.title', 'Filtres')}
                            </Typography>
                            <Button
                                onClick={() => setFilterDrawerOpen(false)}
                                style={{ minWidth: 40, padding: 8, borderRadius: 12 }}
                            >
                                <Icon>close</Icon>
                            </Button>
                        </div>
                        <SideBareSearch {...props} />
                    </Drawer>
                </>
            )}
        </div>
    );
}

export default withReducer('produitsApp', reducer)(ProduitsApp);
