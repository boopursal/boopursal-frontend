import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Icon, Typography, Breadcrumbs } from '@material-ui/core';
import DetailProduit from './DetailProduit';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import DemandeDevisDialog from './DemandeDevisDialog';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import _ from '@lodash';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flex: '1 0 auto',
        height: 'auto',
        backgroundColor: '#f8fafc',
        fontFamily: "'Inter', sans-serif"
    },
    topBar: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    header: {
        background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', // Vibrant orange gradient
        color: 'white',
        padding: '48px 0 140px',
        position: 'relative',
        overflow: 'hidden',
        "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }
    },
    container: {
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
        padding: '0 24px',
        position: 'relative',
        zIndex: 1
    },
    breadcrumbs: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: '0.85rem',
        fontWeight: 500,
        marginBottom: 16,
        '& a': {
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            transition: 'opacity 0.2s',
            '&:hover': {
                opacity: 0.8
            }
        }
    },
    switchContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: '6px',
        borderRadius: 16,
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        backdropFilter: 'blur(5px)'
    },
    switchBtn: {
        borderRadius: 12,
        padding: '8px 24px',
        fontWeight: 900,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: 120,
        '&.active': {
            backgroundColor: 'white',
            color: '#e67300',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        '&.inactive': {
            color: 'white',
            '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
            }
        }
    },
    backBtn: {
        borderRadius: 16,
        textTransform: 'none',
        fontWeight: 800,
        padding: '8px 24px',
        color: 'white',
        backgroundColor: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.25)',
            transform: 'translateX(-4px)'
        }
    }
}));

function DetailProduitApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const produit = useSelector(({ produitsApp }) => produitsApp.detailProduit);

    useEffect(() => {
        const { id } = props.match.params;
        dispatch(Actions.getProduit(id));
    }, [dispatch, props.match.params]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.container}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-16">
                        <div className="flex flex-col gap-8">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.backBtn}
                                onClick={() => props.history.goBack()}
                                style={{ width: 'fit-content' }}
                            >
                                <Icon className="text-18 mr-8">arrow_back</Icon> Retour
                            </Button>

                            {produit.data && (
                                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className="text-white opacity-40" />} className={classes.breadcrumbs}>
                                    <Link to="/" className="flex items-center opacity-80"><HomeIcon style={{ fontSize: 14 }} className="mr-4" /> Accueil</Link>
                                    <Link to="/vente-produits" className="opacity-80">Produits</Link>
                                    {produit.data.sousSecteurs && <Link to={`/vente-produits/${produit.data.secteur?.slug}/${produit.data.sousSecteurs.slug}`} className="opacity-80">{produit.data.sousSecteurs.name}</Link>}
                                    <Typography className="font-bold text-white text-12">{_.capitalize(produit.data.titre)}</Typography>
                                </Breadcrumbs>
                            )}

                            <Typography variant="h4" className="font-900 text-white tracking-tight">
                                {produit.data ? _.capitalize(produit.data.titre) : 'Chargement...'}
                            </Typography>
                        </div>

                        <div className={classes.switchContainer}>
                            <Button className={clsx(classes.switchBtn, "active")}>Produits</Button>
                            <Button onClick={() => props.history.push('/entreprises')} className={clsx(classes.switchBtn, "inactive")}>Entreprises</Button>
                        </div>
                    </div>
                </div>
            </div>

            <DetailProduit {...props} />
            <DemandeDevisDialog />
        </div>
    );
}

export default withReducer('produitsApp', reducer)(DetailProduitApp);