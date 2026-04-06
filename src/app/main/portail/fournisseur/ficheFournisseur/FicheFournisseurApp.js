import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, Icon, Typography, Breadcrumbs } from '@material-ui/core';
import FicheFournisseur from './FicheFournisseur';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import withReducer from 'app/store/withReducer';
import clsx from 'clsx';
import ContactFournisseurDialog from './ContactFournisseurDialog';
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
        backgroundColor: '#f8fafc'
    },
    header: {
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: 'white',
        padding: '30px 0 100px',
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
    container: {
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '0 24px'
    },
    breadcrumbs: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.75rem',
        marginBottom: 8,
        '& a': {
            color: 'white',
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline'
            }
        }
    },
    switchContainer: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: '4px',
        borderRadius: 12,
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)'
    },
    switchBtn: {
        borderRadius: 8,
        padding: '6px 16px',
        fontWeight: 800,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        transition: 'all 0.3s ease',
        minWidth: 100,
        '&.active': {
            backgroundColor: 'white',
            color: '#f39c12',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
    },
    backBtn: {
        borderRadius: 50,
        textTransform: 'none',
        fontWeight: 700,
        color: 'white',
        borderColor: 'rgba(255,255,255,0.4)',
        '&:hover': {
            borderColor: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)'
        }
    }
}));

function FicheFournisseurApp(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const data = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.data);
    const parametres = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.parametres);
    const { id, tab } = props.match.params;

    useEffect(() => {
        dispatch(Actions.getFournisseur(id));
        return () => dispatch(Actions.cleanUpFrs());
    }, [dispatch, id]);

    useEffect(() => {
        if (!tab) dispatch(Actions.getFournisseurProduitsApercu(id));
        return () => dispatch(Actions.cleanUpPrdApercu());
    }, [dispatch, tab, id]);

    useEffect(() => {
        if (tab) dispatch(Actions.getFournisseurProduits(id, parametres));
        return () => dispatch(Actions.cleanUpPrds());
    }, [dispatch, tab, id, parametres]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.container}>
                    <div className={classes.headerContent}>
                        <div className="flex items-center mb-16 gap-16">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.backBtn}
                                onClick={() => props.history.goBack()}
                            >
                                <Icon className="mr-8 text-18">arrow_back</Icon> Retour
                            </Button>

                            {data && (
                                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" className="text-white opacity-40" />} className={classes.breadcrumbs}>
                                    <Link to="/" className="flex items-center opacity-80"><HomeIcon style={{ fontSize: 14 }} className="mr-4" /> Accueil</Link>
                                    <Link to="/entreprises" className="opacity-80">Entreprises</Link>
                                    <Typography className="font-bold text-white text-12">{data.societe}</Typography>
                                </Breadcrumbs>
                            )}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-16">
                            <Typography variant="h4" className="font-900 text-white tracking-tight">
                                {data ? data.societe : 'Chargement...'}
                            </Typography>

                            <div className={classes.switchContainer}>
                                <Button onClick={() => props.history.push('/vente-produits')} className={clsx(classes.switchBtn, "inactive")}>Produits</Button>
                                <Button className={clsx(classes.switchBtn, "active")}>Entreprises</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FicheFournisseur {...props} />
            <ContactFournisseurDialog />
        </div>
    );
}

export default withReducer('fournisseursApp', reducer)(FicheFournisseurApp);