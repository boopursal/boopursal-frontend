import React from 'react';
import { Typography, Grid, Divider, Container, Box } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogoPortail from 'app/fuse-layouts/shared-components/LogoPortail';

const useStyles = makeStyles((theme) => ({
    root: {
        background: "var(--portal-footer-bg)",
        color: "var(--portal-footer-text)",
        padding: "60px 0 40px", 
        position: 'relative',
        zIndex: 10,
        borderTop: "1px solid var(--portal-border)",
    },
    container: {
        maxWidth: 1200,
        margin: "0 auto",
    },
    column: {
        '& h4': {
            fontSize: "0.95rem",
            fontWeight: 800,
            marginBottom: "24px",
            color: "var(--portal-footer-text)",
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
        '& ul': {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        '& li': {
            marginBottom: "14px",
        },
        '& a': {
            color: "#64748b",
            textDecoration: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            transition: "color 0.2s ease",
            '&:hover': {
                color: "#1e293b",
            },
        },
    },
    aboutText: {
        color: "#64748b",
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.7,
        marginBottom: "24px",
    },
    divider: {
        background: "#f1f5f9",
        margin: "64px 0 32px",
    },
    bottom: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: "16px",
        '& p': {
            color: "#94a3b8",
            fontSize: "0.95rem",
            fontWeight: 400,
        }
    },
    bottomLinks: {
        display: 'flex',
        gap: "32px",
        '& a': {
            color: "#94a3b8",
            fontSize: "0.95rem",
            fontWeight: 400,
            textDecoration: 'none',
            transition: "all 0.3s ease",
            '&:hover': {
                color: "#1e293b",
            }
        }
    }
}));

function FooterLayout3(props) {
    const classes = useStyles();
    const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);

    return (
        <ThemeProvider theme={footerTheme}>
            <footer className={classes.root}>
                <Container className={classes.container}>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4} className={classes.column}>
                            <div style={{ 
                                marginBottom: 32,
                                display: 'inline-block',
                                background: 'var(--portal-logo-badge)',
                                padding: '12px 24px',
                                borderRadius: '16px',
                                border: '1px solid var(--portal-border)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
                            }}>
                                <LogoPortail />
                            </div>
                            <Typography className={classes.aboutText}>
                                Boopursal est la place de marché B2B nouvelle génération connectant décideurs, acheteurs et fournisseurs à travers le monde pour des transactions fluides et sécurisées.
                            </Typography>
                        </Grid>

                        <Grid item xs={6} sm={4} md={2} className={classes.column}>
                            <Typography variant="h4" component="h4">Acheter</Typography>
                            <ul>
                                <li><Link to="/register/2">S'inscrire</Link></li>
                                <li><Link to="/vente-produits">Parcourir produits</Link></li>
                                <li><Link to="/demandes-achats">Demandes de devis</Link></li>
                            </ul>
                        </Grid>

                        <Grid item xs={6} sm={4} md={2} className={classes.column}>
                            <Typography variant="h4" component="h4">Vendre</Typography>
                            <ul>
                                <li><Link to="/register/1">Devenir fournisseur</Link></li>
                                <li><Link to="/tarifs/plans">Nos forfaits</Link></li>
                                <li><Link to="/vente-produits">Publier un produit</Link></li>
                            </ul>
                        </Grid>

                        <Grid item xs={12} sm={4} md={4} className={classes.column}>
                            <Typography variant="h4" component="h4">Navigation</Typography>
                            <Grid container>
                                <Grid item xs={6}>
                                    <ul>
                                        <li><Link to="/annuaire-entreprises">Secteurs</Link></li>
                                        <li><Link to="/entreprises">Entreprises</Link></li>
                                        <li><Link to="/actualites">Actualités</Link></li>
                                    </ul>
                                </Grid>
                                <Grid item xs={6}>
                                    <ul>
                                        <li><Link to="/contact">Contact</Link></li>
                                        <li><Link to="/faqs">FAQ</Link></li>
                                        <li><Link to="/conditions">Conditions</Link></li>
                                    </ul>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Divider className={classes.divider} />

                    <div className={classes.bottom}>
                        <Typography>© 2026 Boopursal Platform. Tous droits réservés.</Typography>
                        <div className={classes.bottomLinks}>
                            <Link to="/conditions">Confidentialité</Link>
                            <Link to="/conditions">Mentions légales</Link>
                            <Link to="/conditions">Cookies</Link>
                        </div>
                    </div>
                </Container>
            </footer>
        </ThemeProvider>
    );
}

export default FooterLayout3;
