import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { Typography, Grid, Breadcrumbs, Button, LinearProgress, Paper, Icon } from '@material-ui/core';
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
import ContactFournisseurDialog from '../ficheFournisseur/ContactFournisseurDialog';
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
            color: '#f39c12',
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

function FournisseursApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery(props.location);
    const params = props.match.params;
    const { secteur, activite, categorie } = params;
    const pays = query.get("pays");
    const q = query.get("q");
    const ville = query.get("ville");
    const parametres = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.parametres);
    const fournisseurs = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.data);
    const loading = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.loading);
    const secteurs = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.secteurs);
    const activites = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.activites);
    const categories = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.categories);

    useEffect(() => {
        dispatch(Actions.getFournisseurs(params, pays, parametres, ville, q));
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

    const handleUrlProduits = () => {
        const path = (secteur ? '/' + secteur : '') + (activite ? '/' + activite : '') + (categorie ? '/' + categorie : '');
        const searchText = pays ? (q ? '&q=' + q : '') : (q ? 'q=' + q : '');
        props.history.push({ pathname: '/vente-produits' + path, search: (pays ? 'pays=' + pays : '') + searchText });
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

    if (loading && !fournisseurs.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <LinearProgress className="w-full max-w-xs rounded-full h-4" color="primary" />
                <Typography className="mt-16 text-slate-500 font-semibold animate-pulse">Chargement des entreprises...</Typography>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <title>{`Fournisseurs ${getBreadcrumbTitle() || ''} ${pays ? 'au ' + _.capitalize(pays) : ''} - Boopursal`}</title>
            </Helmet>

            <div className={classes.header}>
                <div className={classes.container}>
                    <div className={classes.headerContent}>
                        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} className={classes.breadcrumbs}>
                            <Link to="/" className="flex items-center"><HomeIcon className="text-16 mr-4" /> Accueil</Link>
                            <Link to="/entreprises">Entreprises</Link>
                            {secteur && <Typography color="inherit" className="font-bold text-white">{getBreadcrumbTitle()}</Typography>}
                        </Breadcrumbs>

                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-24">
                            <div className="flex-1">
                                <Typography className={classes.mainTitle}>
                                    Fournisseurs {getBreadcrumbTitle() && <span>{getBreadcrumbTitle()}</span>}
                                    {q && <span className="text-yellow-400"> #{q}</span>}
                                </Typography>
                                {pays && (
                                    <div className="flex items-center mt-8 text-blue-100 font-medium">
                                        <Icon className="text-18 mr-4">location_on</Icon>
                                        Localisation: {_.capitalize(pays)} {ville && `, ${_.capitalize(ville)}`}
                                    </div>
                                )}
                            </div>

                            <div className={classes.switchContainer}>
                                <Button onClick={handleUrlProduits} className={clsx(classes.switchBtn, "inactive")}>
                                    Produits
                                </Button>
                                <Button className={clsx(classes.switchBtn, "active")}>
                                    Entreprises
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.container}>
                <div className={classes.contentWrapper}>
                    {fournisseurs.length === 0 ? (
                        <Paper className="p-64 w-full text-center flex flex-col items-center justify-center rounded-32 shadow-xl border-0">
                            <div className="w-120 h-120 bg-slate-50 rounded-full flex items-center justify-center mb-24">
                                <Icon className="text-64 text-slate-300">business_off</Icon>
                            </div>
                            <Typography variant="h4" className="mb-16 font-900 text-slate-800">Aucun résultat trouvé</Typography>
                            <Typography className="mb-40 text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
                                Nous n'avons trouvé aucune entreprise correspondant à "<strong>{q || 'votre recherche'}</strong>".
                                Essayez de modifier vos filtres ou d'explorer d'autres catégories.
                            </Typography>
                            <div className="flex gap-16">
                                <Button variant="contained" color="primary" onClick={() => props.history.push('/')} className="px-32 py-12 rounded-12 font-bold shadow-lg">
                                    Retour à l'accueil
                                </Button>
                                <Button variant="outlined" onClick={() => props.history.goBack()} className="px-32 py-12 rounded-12 font-bold border-slate-200">
                                    Page précédente
                                </Button>
                            </div>
                        </Paper>
                    ) : (
                        <Grid container spacing={4}>
                            <Grid item lg={3} md={4} xs={12} className="sticky top-24">
                                <SideBareSearch {...props} />
                            </Grid>
                            <Grid item lg={9} md={8} xs={12}>
                                <ContentList />
                            </Grid>
                        </Grid>
                    )}
                </div>
            </div>

            <ContactFournisseurDialog />
        </div>
    );
}

export default withReducer('fournisseursApp', reducer)(FournisseursApp);