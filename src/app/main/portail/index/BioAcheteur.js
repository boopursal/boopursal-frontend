import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Card, CardContent, Icon, Button, Box, Grid } from '@material-ui/core';
import { NavLinkAdapter } from '@fuse';

const useStyles = makeStyles(theme => ({
    card: {
        borderRadius: 24,
        background: "transparent",
        color: "var(--portal-text)",
        padding: "0",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        border: "none",
        boxShadow: "none",
    },
    iconBox: {
        width: 70,
        height: 70,
        borderRadius: "16px",
        background: "rgba(255, 90, 90, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "32px",
        border: "1px solid rgba(255, 90, 90, 0.2)",
    },
    icon: {
        color: "#ff5a5a",
        fontSize: 36,
    },
    benefitItem: {
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
    },
    checkIcon: {
        color: "#10b981",
        fontSize: 22,
    },
    button: {
        marginTop: "48px",
        padding: "16px 32px",
        borderRadius: 14,
        background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
        color: "#ffffff",
        fontWeight: 800,
        textTransform: "none",
        fontSize: "1.1rem",
        boxShadow: "0 10px 20px rgba(255, 90, 90, 0.2)",
        transition: "all 0.3s ease",
        "&:hover": {
            background: "linear-gradient(135deg, #ff6b6b 0%, #ff9a9a 100%)",
            transform: "scale(1.02)",
            boxShadow: "0 15px 30px rgba(255, 90, 90, 0.3)",
        }
    }
}));

export default function BioAcheteur() {
    const classes = useStyles();

    return (
        <Card className={classes.card} style={{ 
            background: "#ffffff",
            color: "#0f172a",
            padding: "40px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            borderRadius: "32px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 20px 50px rgba(0,0,0,0.03)"
        }}>
            <CardContent style={{ textAlign: "center", padding: 0 }}>
                <Box display="flex" justifyContent="center" style={{ marginBottom: "32px" }}>
                    <div style={{ 
                        width: 80, height: 80, borderRadius: "50%",
                        background: "rgba(255, 90, 90, 0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(255, 90, 90, 0.2)"
                    }}>
                        <Icon style={{ color: "#ff5a5a", fontSize: 36 }}>shopping_cart</Icon>
                    </div>
                </Box>

                <Typography variant="h3" style={{ fontWeight: 900, marginBottom: "20px", color: "#0f172a", fontSize: "2.5rem", letterSpacing: "-0.04em" }}>
                    Vous êtes un <br/>Acheteur ?
                </Typography>

                <Typography style={{ color: "#64748b", marginBottom: "48px", fontSize: "1.1rem", lineHeight: 1.6 }}>
                    Trouvez les meilleurs fournisseurs et recevez vos devis en un temps record.
                </Typography>

                <Grid container spacing={2} style={{ marginBottom: "48px" }}>
                    <Grid item xs={12}>
                        <Typography style={{ color: "#0f172a", fontWeight: 700, fontSize: "1rem" }}>✓ 100% Gratuit</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography style={{ color: "#0f172a", fontWeight: 700, fontSize: "1rem" }}>✓ Devis Rapides</Typography>
                    </Grid>
                </Grid>

                <Button
                    component={NavLinkAdapter}
                    to="/register/2"
                    style={{ 
                        background: "#ff5a5a", 
                        color: "#ffffff",
                        padding: '20px 40px',
                        borderRadius: "16px",
                        fontWeight: 900,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        boxShadow: "0 10px 30px rgba(255, 90, 90, 0.2)",
                        width: "100%"
                    }}
                >
                    S'inscrire comme Acheteur
                </Button>
            </CardContent>
        </Card>
    );
}