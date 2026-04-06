import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, CardContent, Icon, Button, Box, Grid } from '@material-ui/core';
import { NavLinkAdapter } from '@fuse';

const useStyles = makeStyles(theme => ({
    card: {
        borderRadius: 24,
        background: "transparent",
        color: "#ffffff",
        padding: "0",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        boxShadow: "none",
    },
    iconBox: {
        width: 70,
        height: 70,
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "32px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    benefitItem: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
    },
    checkIcon: {
        color: "#ffffff",
        fontSize: 22,
    },
    button: {
        marginTop: "48px",
        padding: "16px 32px",
        borderRadius: 14,
        background: "#ffffff",
        color: "#1e3a8a",
        fontWeight: 900,
        textTransform: "none",
        fontSize: "1.1rem",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "#f8fafc",
            transform: "scale(1.02)",
            boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
        }
    }
}));

export default function BioFournisseur() {
    const classes = useStyles();

    return (
        <Card className={classes.card} style={{ 
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#ffffff",
            padding: "40px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "32px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
        }}>
            <CardContent style={{ textAlign: "center", padding: 0 }}>
                <Box display="flex" justifyContent="center" style={{ marginBottom: "32px" }}>
                    <div style={{ 
                        width: 80, height: 80, borderRadius: "50%",
                        background: "rgba(59, 130, 246, 0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(59, 130, 246, 0.3)"
                    }}>
                        <Icon style={{ color: "#60a5fa", fontSize: 36 }}>storefront</Icon>
                    </div>
                </Box>

                <Typography variant="h3" style={{ fontWeight: 900, marginBottom: "20px", color: "#ffffff", fontSize: "2.5rem", letterSpacing: "-0.04em" }}>
                    Vous êtes <br/>Fournisseur ?
                </Typography>

                <Typography style={{ color: "#94a3b8", marginBottom: "48px", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    Propulsez vos ventes B2B et touchez des acheteurs qualifiés dans toute l'Europe.
                </Typography>

                <Grid container spacing={2} style={{ marginBottom: "48px" }}>
                    <Grid item xs={12}>
                        <Typography style={{ color: "#ffffff", fontWeight: 700, fontSize: "1rem" }}>✓ Visibilité Maximale</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ color: "#ffffff", fontWeight: 700, fontSize: "1rem" }}>✓ Gestion de Devis</Typography>
                    </Grid>
                </Grid>

                <Button
                    component={NavLinkAdapter}
                    to="/register/1"
                    style={{ 
                        background: "#ffffff", 
                        color: "#0f172a",
                        padding: '20px 40px',
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 30px rgba(255, 255, 255, 0.1)",
                        width: "100%"
                    }}
                >
                    S'inscrire comme Fournisseur
                </Button>
            </CardContent>
        </Card>
    );
}