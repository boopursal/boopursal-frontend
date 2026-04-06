import React from "react";
import {
  Grid,
  Typography,
  Button,
  Icon,
  Paper,
  Divider,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FuseAnimate, LOCAL_CURRENCY, FuseAnimateGroup } from "@fuse";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '48px 40px',
    backgroundColor: '#ffffff',
    [theme.breakpoints.down("sm")]: {
      padding: '24px 16px',
    }
  },
  card: {
    borderRadius: 8,
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    padding: '0 0 32px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      borderColor: '#fbd38d'
    }
  },
  highlightedCard: {
    backgroundColor: '#fffffb',
    borderColor: '#f6ad55',
    borderWidth: 2,
    zIndex: 10
  },
  ribbon: {
    position: 'absolute',
    top: -12,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#cc0000',
    color: 'white',
    padding: '4px 20px',
    fontSize: '0.75rem',
    fontWeight: 800,
    zIndex: 20,
    borderRadius: '4px 4px 0 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      left: 0,
      borderLeft: '10px solid #990000',
      borderBottom: '6px solid transparent'
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: -6,
      right: 0,
      borderRight: '10px solid #990000',
      borderBottom: '6px solid transparent'
    }
  },
  cardHeader: {
    padding: '48px 24px 24px',
    textAlign: 'center'
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: 950,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 12
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: '#f6ad55',
    margin: '0 auto 16px',
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 1.4,
    minHeight: 45
  },
  priceBox: {
    marginTop: 8,
    textAlign: 'center'
  },
  priceLabel: {
    fontSize: '0.7rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '0.05em'
  },
  priceValue: {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#cc0000',
    lineHeight: 1
  },
  ctaBtnBox: {
    padding: '0 24px 24px'
  },
  ctaBtn: {
    borderRadius: 4,
    padding: '12px',
    border: '1px solid #fbd38d',
    color: '#c05621',
    fontSize: '0.9rem',
    fontWeight: 800,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#fffaf0',
      borderColor: '#f6ad55'
    }
  },
  featuresList: {
    padding: '0 32px 16px',
    flexGrow: 1
  },
  featureItem: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
    fontSize: '0.9rem',
    color: '#334155'
  }
}));

const PricingFournisseur = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const plans = [
    {
      name: "Standard",
      price: 0,
      subtitle: "Parfait pour lancer votre activité professionnelle",
      features: [
        { lab: "1 secteur d'activité", val: "✔" },
        { lab: "Catalogue produits en ligne", val: "✔" },
        { lab: "Mini-site de présentation", val: "✔" },
        { lab: "Photos et Vidéos", val: "Max 5" },
        { lab: "Gestion commerciale", val: "✗" },
      ],
      cta: "Commencer gratuitement"
    },
    {
      name: "Business",
      price: 35,
      subtitle: "Recommandé pour les leaders à fort potentiel",
      popular: true,
      features: [
        { lab: "5 secteurs d'activité", val: "✔" },
        { lab: "Gestion commerciale incluse", val: "✔" },
        { lab: "Suivi des ventes & Clients", val: "✔" },
        { lab: "Affectation aux agences", val: "✔" },
        { lab: "Catalogue spécifique PDF", val: "10 p." },
      ],
      cta: "S'abonner maintenant"
    },
    {
      name: "Performance",
      price: 45,
      subtitle: "Puissance et visibilité maximale pour expert",
      features: [
        { lab: "Secteurs d'activité illimités", val: "✔" },
        { lab: "Présentation en '1ère Page'", val: "2 prod." },
        { lab: "Campagne bannière publicitaire", val: "3 mois" },
        { lab: "Catalogue spécifique PDF", val: "20 p." },
        { lab: "Support technique VIP", val: "24/7" },
      ],
      cta: "S'abonner maintenant"
    },
  ];

  const getPrice = (p) => {
    if (p === 0) return "0";
    return props.currency === 0 ? Math.round(p * 10) : p;
  };

  const curr = props.currency === 0 ? "dh" : props.currency === 1 ? "EUR" : "USD";

  return (
    <div className={classes.root}>
      <Grid container spacing={4} className="max-w-7xl mx-auto">
        {plans.map((p, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Paper className={clsx(classes.card, p.popular && classes.highlightedCard)} elevation={0}>
              {p.popular && <div className={classes.ribbon}>Recommandé</div>}

              <div className={classes.cardHeader}>
                <Typography className={classes.planName}>{p.name}</Typography>
                <div className={classes.divider} />
                <Typography className={classes.subtitle}>{p.subtitle}</Typography>

                <div className={classes.priceBox}>
                  <span className={classes.priceLabel}>à partir de</span>
                  <div className="flex items-baseline justify-center">
                    <span className={classes.priceValue}>{getPrice(p.price)}</span>
                    <span className="text-red-700 font-900 ml-4 text-16">{curr}/mois</span>
                  </div>
                </div>
              </div>

              <div className={classes.ctaBtnBox}>
                <Button variant="outlined" fullWidth className={classes.ctaBtn}>
                  {p.cta}
                </Button>
              </div>

              <div className={classes.featuresList}>
                {p.features.map((f, fi) => (
                  <div key={fi} className={classes.featureItem}>
                    <Icon className="text-16" style={{ color: f.val === '✗' ? '#cbd5e1' : '#f6ad55' }}>
                      {f.val === '✗' ? 'remove' : 'check'}
                    </Icon>
                    <Typography className="text-14">
                      {f.val !== '✔' && f.val !== '✗' && <b>{f.val} </b>}
                      {f.lab}
                    </Typography>
                  </div>
                ))}
              </div>

              <Typography className="text-center pb-24 text-12 text-amber-800 font-bold cursor-pointer hover:underline">
                Voir toutes les fonctionnalités
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PricingFournisseur;
