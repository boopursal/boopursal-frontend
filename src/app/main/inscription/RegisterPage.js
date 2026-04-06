import React, { useState, useEffect } from 'react';
import { Tabs, Card, Typography, Tab, Icon, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import clsx from 'clsx';
import { Link, withRouter } from 'react-router-dom';
import FournisseurTab from './tabs/FournisseurTab';
import AcheteurTab from './tabs/AcheteurTab';
import { Helmet } from "react-helmet";

const useStyles = makeStyles(theme => ({
    root: {
        background: '#ffffff',
        minHeight: '100%',
        display: 'block',
        position: 'relative',
        padding: theme.spacing(8, 4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2),
        }
    },
    backgroundArt: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        background: 'radial-gradient(circle at 100% 0%, #f0fdf4 0%, transparent 40%), radial-gradient(circle at 0% 100%, #eff6ff 0%, transparent 40%), #ffffff',
    },
    card: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 720,
        margin: '0 auto',
        display: 'block',
        borderRadius: 32,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.05)',
        padding: theme.spacing(8),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(4),
        }
    },
    logo: {
        height: 60,
        width: 'auto',
        marginBottom: 32,
        margin: '0 auto',
        display: 'block'
    },
    title: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '2.25rem',
        fontWeight: 700,
        color: '#0f172a',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: '-0.02em',
    },
    subtitle: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '1rem',
        fontWeight: 400,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 1.5,
        marginBottom: 48,
    },
    tabs: {
        marginBottom: 40,
        background: '#f1f5f9',
        borderRadius: 16,
        padding: 6,
        minHeight: 52,
        '& .MuiTabs-indicator': {
            height: '100%',
            borderRadius: 12,
            background: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)',
        }
    },
    tab: {
        textTransform: 'none',
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontWeight: 700,
        fontSize: '0.9rem',
        minHeight: 40,
        color: '#64748b',
        zIndex: 1,
        transition: 'all 0.2s',
        '&.Mui-selected': {
            color: '#0f172a',
        }
    },
    footerLink: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#94a3b8',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        '&:hover': {
            color: '#0f172a'
        }
    },
    switchPrompt: {
        marginTop: 40,
        paddingTop: 32,
        borderTop: '1px solid #f1f5f9',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#64748b',
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        lineHeight: 1.5,
    },
    loginLink: {
        color: theme.palette.primary.main,
        fontWeight: 700,
        textDecoration: 'none',
        marginLeft: 8,
        '&:hover': {
            textDecoration: 'underline'
        }
    }
}));

function RegisterPage(props) {
    const classes = useStyles();
    const params = props.match.params;
    const { page } = params;
    const [selectedTab, setSelectedTab] = useState(page <= 2 && page >= 1 ? page - 1 : 0);

    useEffect(() => {
        setSelectedTab(page <= 2 && page >= 1 ? page - 1 : 0);
    }, [page]);

    const handleTabChange = (event, value) => {
        setSelectedTab(value);
    };

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Inscription | Boopursal</title>
                <meta name="description" content="Créez votre compte professionnel sur Boopursal." />
            </Helmet>

            <div className={classes.backgroundArt} />

            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <Card className={classes.card} elevation={0}>
                    <img className={classes.logo} src="assets/images/logos/icon.png" alt="Boopursal" />

                    <Typography className={classes.title}>Inscription</Typography>
                    <Typography className={classes.subtitle}>Sélectionnez votre profil pour commencer l'aventure Boopursal</Typography>

                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        className={classes.tabs}
                    >
                        <Tab className={classes.tab} label="Espace Fournisseur" />
                        <Tab className={classes.tab} label="Espace Acheteur" />
                    </Tabs>

                    <Box mt={2}>
                        {selectedTab === 0 ? <FournisseurTab {...props} /> : <AcheteurTab {...props} />}
                    </Box>

                    <div className={classes.switchPrompt}>
                        Déjà inscrit sur la plateforme ?
                        <Link to="/login" className={classes.loginLink}>Se connecter</Link>
                    </div>

                    <Link to="/" className={classes.footerLink}>
                        <Icon className="text-18 mr-8">arrow_back</Icon>
                        Retour sur Boopursal.com
                    </Link>
                </Card>
            </FuseAnimate>
        </div>
    );
}

export default withRouter(RegisterPage);
