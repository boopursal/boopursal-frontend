import React from 'react'
import { Card, CardContent, Typography, Icon, Box, ButtonBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FuseSplashScreen } from '@fuse';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import JWTLoginTab from './tabs/JWTLoginTab';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
    root: {
        background: '#ffffff',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(8, 4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2),
        },
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },
    backgroundArt: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
    },
    megaCard: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 1000,
        backgroundColor: '#ffffff',
        borderRadius: 40,
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        border: '1px solid #e2e8f0',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            borderRadius: 24,
            maxWidth: 480
        }
    },
    loginPane: {
        flex: 1,
        padding: theme.spacing(8),
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(5),
        }
    },
    registerPane: {
        flex: 1,
        backgroundColor: '#f8fafc',
        backgroundImage: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 1) 100%)',
        padding: theme.spacing(8),
        borderLeft: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        [theme.breakpoints.down('sm')]: {
            borderLeft: 'none',
            borderTop: '1px solid #f1f5f9',
            padding: theme.spacing(5),
        }
    },
    logo: {
        height: 60,
        width: 'auto',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '2rem',
        fontWeight: 900,
        color: '#0f172a',
        marginBottom: 8,
        letterSpacing: '-0.04em',
    },
    subtitle: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '0.925rem',
        fontWeight: 400,
        color: '#64748b',
        lineHeight: 1.5,
        marginBottom: 48,
    },
    sectionTitle: {
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        fontWeight: 900,
        letterSpacing: '0.15em',
        color: theme.palette.primary.main,
        marginBottom: 24
    },
    ctaBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
    },
    optionBtn: {
        padding: '20px 24px',
        borderRadius: 16,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        textAlign: 'left',
        '&:hover': {
            borderColor: theme.palette.primary.main,
            transform: 'translateX(8px)',
            boxShadow: '0 15px 30px -5px rgba(37, 99, 235, 0.1)'
        }
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    optionTitle: {
        fontSize: '1rem',
        fontWeight: 800,
        color: '#1e293b'
    },
    optionDesc: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 400
    },
    footerLink: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#94a3b8',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: 32,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        '&:hover': {
            color: '#64748b'
        }
    }
}));

function Login() {
    const classes = useStyles();
    const login = useSelector(({ auth }) => auth.login);

    if (login.relogin) {
        return <FuseSplashScreen />
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Connexion & Inscription | Boopursal</title>
                <meta name="description" content="Espace membre professionnel Boopursal." />
            </Helmet>

            <div className={classes.backgroundArt} />

            <FuseAnimate animation="transition.slideUpIn" delay={100}>
                <div className={classes.megaCard}>

                    {/* LE CÔTÉ CONNEXION */}
                    <div className={classes.loginPane}>
                        <img className={classes.logo} src="assets/images/logos/icon.png" alt="Boopursal" />
                        <Typography className={classes.title}>Boopursal</Typography>
                        <Typography className={classes.subtitle}>Accédez à votre écosystème d'achats professionnel.</Typography>

                        <JWTLoginTab />

                        <Link to="/" className={classes.footerLink}>
                            <Icon className="text-16 mr-8">keyboard_backspace</Icon>
                            Portail Boopursal
                        </Link>
                    </div>

                    {/* LE CÔTÉ INSCRIPTION (PARALLÈLE) */}
                    <div className={classes.registerPane}>
                        <Typography className={classes.sectionTitle}>Nouveau sur la plateforme ?</Typography>
                        <Typography className="text-24 font-900 text-slate-800 mb-24 tracking-tight leading-tight">
                            Rejoignez le premier réseau B2B du Maroc.
                        </Typography>

                        <div className={classes.ctaBox}>
                            <ButtonBase
                                component={Link}
                                to="/register/1"
                                className={classes.optionBtn}
                            >
                                <div className={classes.iconBox} style={{ backgroundColor: '#fff7ed' }}>
                                    <Icon style={{ color: '#f59e0b' }}>storefront</Icon>
                                </div>
                                <div>
                                    <Typography className={classes.optionTitle}>Vendeur / Fournisseur</Typography>
                                    <Typography className={classes.optionDesc}>Boostez vos ventes aujourd'hui.</Typography>
                                </div>
                                <Icon className="ml-auto text-slategray opacity-30">chevron_right</Icon>
                            </ButtonBase>

                            <ButtonBase
                                component={Link}
                                to="/register/2"
                                className={classes.optionBtn}
                            >
                                <div className={classes.iconBox} style={{ backgroundColor: '#eff6ff' }}>
                                    <Icon style={{ color: '#3b82f6' }}>shopping_cart</Icon>
                                </div>
                                <div>
                                    <Typography className={classes.optionTitle}>Directeur Achat</Typography>
                                    <Typography className={classes.optionDesc}>Optimisez votre sourcing.</Typography>
                                </div>
                                <Icon className="ml-auto text-slategray opacity-30">chevron_right</Icon>
                            </ButtonBase>
                        </div>

                        <div className="mt-48 p-24 bg-white border border-slate-100 rounded-20">
                            <Typography className="text-13 font-700 text-slate-600 italic">
                                "La plateforme idéale pour sécuriser ses approvisionnements."
                            </Typography>
                            <Typography className="text-11 font-800 text-blue mt-8 uppercase tracking-widest">
                                — Expert Secteur Industriel
                            </Typography>
                        </div>
                    </div>

                </div>
            </FuseAnimate>
        </div>
    )
}

export default Login;
