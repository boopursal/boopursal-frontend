import React, { useEffect } from "react";
import {
  Button,
  Icon,
  CircularProgress,
  Typography,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { green, red } from "@material-ui/core/colors";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_CURRENCY } from "@fuse";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "24px 16px",
    maxWidth: 1000,
    margin: "0 auto",
  },
  card: {
    background: "#ffffff",
    borderRadius: 24,
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    position: "relative",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
    },
  },
  cardRecommended: {
    border: "2px solid #3182ce",
    boxShadow: "0 20px 40px -10px rgba(49,130,206,0.2)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 30px 50px -10px rgba(49,130,206,0.3)",
    }
  },
  header: {
    padding: "20px 16px",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  priceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 14,
    fontWeight: 600,
    marginRight: 4,
    opacity: 0.9,
  },
  price: {
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1,
  },
  period: {
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.9,
    marginLeft: 8,
  },
  features: {
    padding: "20px 16px",
    flexGrow: 1,
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: 12,
    fontSize: 13,
    color: "#334155",
  },
  featureIcon: {
    marginRight: 8,
    fontSize: 18,
  },
  featureText: {
    flex: 1,
    lineHeight: 1.3,
  },
  featureValue: {
    fontWeight: 700,
    marginLeft: 6,
  },
  action: {
    padding: "16px",
    marginTop: "auto",
  },
  button: {
    borderRadius: 8,
    padding: "8px 16px",
    fontWeight: 700,
    textTransform: "none",
    fontSize: 14,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "#fef08a",
    color: "#854d0e",
    padding: "2px 8px",
    borderRadius: 16,
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
  }
}));

const featuresList = [
  "Publication des demandes de devis ( RFQ )",
  "Réception des devis",
  "Voir les profils des Fournisseurs",
  "Voir les catalogues des Fournisseurs",
  "Voir le nombre de Fournisseurs Intéressés *",
  "Compte anonyme **",
  "Voir le nombre de diffusions de la ( RFQ )",
  "Sous-compte Acheteur ***",
  "Blackliste",
  "Critère sélection fournisseur",
  "Critère sélection produit"
];

const plans = [
  {
    id: "FREE",
    name: "FREE",
    offreName: "Pack Classic",
    priceMad: "0",
    decimalsMad: ",00",
    periodMad: "",
    priceEur: "0",
    decimalsEur: ",00",
    periodEur: "",
    bgGradient: "linear-gradient(135deg, #feb2b2 0%, #e53e3e 100%)",
    btnColor: "#e53e3e",
    values: ["illimité", "illimité", true, true, true, true, false, false, false, false, false]
  },
  {
    id: "PRO",
    name: "ACHETEUR PRO",
    offreName: "Pack Business",
    priceMad: "375",
    decimalsMad: ",00",
    periodMad: "/ mois HT",
    priceEur: "38",
    decimalsEur: ",00",
    periodEur: "/ mois",
    bgGradient: "linear-gradient(135deg, #90cdf4 0%, #2563eb 100%)",
    btnColor: "#2563eb",
    recommended: true,
    values: ["illimité", "illimité", true, true, true, true, true, true, true, false, false]
  },
  {
    id: "PRO_PLUS",
    name: "ACHETEUR PRO PLUS",
    offreName: "Pack Gold",
    priceMad: "500",
    decimalsMad: ",00",
    periodMad: "/ mois HT",
    priceEur: "50",
    decimalsEur: ",00",
    periodEur: "/ mois",
    bgGradient: "linear-gradient(135deg, #fde047 0%, #d97706 100%)",
    btnColor: "#d97706",
    values: ["illimité", "illimité", true, true, true, true, true, true, true, true, true]
  }
];

function Packs(props) {
  const classes = useStyles();
  const { currency } = props;
  const dispatch = useDispatch();
  const commande = useSelector(({ facturationApp }) => facturationApp.commande);

  useEffect(() => {
    dispatch(Actions.getOffres());
  }, [dispatch]);

  if (commande.loadingOffres) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <CircularProgress color="secondary" /> &ensp; Chargement des offres...
      </div>
    );
  }

  function handleSelectOffre(item) {
    dispatch(Actions.openNewCommandeDialog(item));
  }

  const isLocal = currency === LOCAL_CURRENCY;
  const currencySymbol = isLocal ? LOCAL_CURRENCY : "€";

  return (
    <div className={classes.root}>
      <div className="text-center mb-24">
        <Typography variant="h4" style={{ fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
          Choisissez votre Pack Acheteur
        </Typography>
        <Typography variant="body1" style={{ color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
          Débloquez toutes les fonctionnalités premium pour sourcer vos fournisseurs plus rapidement et efficacement.
        </Typography>
      </div>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch" style={{ maxWidth: '100%' }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id} style={{ display: 'flex' }}>
            <div
              className={clsx(
                classes.card,
                "w-full flex-1",
                plan.recommended && classes.cardRecommended
              )}
            >
            {plan.recommended && (
              <div className={classes.badge}>Recommandé</div>
            )}
            
            <div className={classes.header} style={{ background: plan.bgGradient }}>
              <div className={classes.title}>{plan.name}</div>
              <div className={classes.priceContainer}>
                <span className={classes.currency}>{currencySymbol}</span>
                <span className={classes.price}>
                  {isLocal ? plan.priceMad : plan.priceEur}
                </span>
                <span style={{ fontSize: 14, fontWeight: 700 }}>
                  {isLocal ? plan.decimalsMad : plan.decimalsEur}
                </span>
              </div>
              <div className={classes.period}>
                {isLocal ? plan.periodMad : plan.periodEur}
              </div>
            </div>

            <div className={classes.features}>
              {featuresList.map((featureName, index) => {
                const value = plan.values[index];
                const isString = typeof value === 'string';
                const isAvailable = isString || value === true;

                return (
                  <div key={index} className={classes.featureItem} style={{ opacity: isAvailable ? 1 : 0.4 }}>
                    <Icon 
                      className={classes.featureIcon} 
                      style={{ color: isAvailable ? (isString ? plan.btnColor : green[500]) : red[500] }}
                    >
                      {isAvailable ? 'check_circle' : 'cancel'}
                    </Icon>
                    <span className={classes.featureText}>
                      {featureName}
                      {isString && (
                        <span className={classes.featureValue} style={{ color: plan.btnColor }}>
                          {value}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className={classes.action}>
              <Button
                variant={plan.recommended ? "contained" : "outlined"}
                className={clsx(classes.button, "w-full")}
                style={{
                  backgroundColor: plan.recommended ? plan.btnColor : "transparent",
                  color: plan.recommended ? "#fff" : plan.btnColor,
                  borderColor: plan.btnColor,
                  borderWidth: 2
                }}
                onClick={() => {
                  const offre = commande.offres?.find(o => o.name === plan.offreName);
                  if (offre) handleSelectOffre(offre);
                }}
              >
                S'abonner
              </Button>
            </div>
          </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Packs;
