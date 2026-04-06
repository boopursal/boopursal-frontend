import React, { useEffect, useState } from "react";
import { Typography, Button, Grid, IconButton, Icon, Box } from "@material-ui/core";
import { FuseAnimate, FuseAnimateGroup } from "@fuse";
import PricingFournisseur from "./PricingFournisseur";
import PricingAcheteur from "./PricingAcheteur";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import agent from 'agent';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
  },
  header: {
    padding: '40px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center'
  },
  toggleContainer: {
    display: 'inline-flex',
    backgroundColor: '#f1f5f9',
    padding: 4,
    borderRadius: 12,
    border: '1px solid #e2e8f0',
    marginTop: 24
  },
  toggleBtn: {
    padding: '8px 32px',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#64748b',
    backgroundColor: 'transparent'
  },
  activeToggle: {
    backgroundColor: '#fff',
    color: '#dd6b20',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  currencyRow: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'center',
    gap: 12
  },
  currBtn: {
    fontSize: '0.75rem',
    fontWeight: 900,
    color: '#94a3b8',
    padding: '4px 12px',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    background: 'white',
    '&:hover': {
      borderColor: '#f6ad55'
    }
  },
  activeCurr: {
    color: 'white',
    backgroundColor: '#dd6b20',
    borderColor: '#dd6b20'
  }
}));

const euroCountries = [
  "FR", "BE", "DE", "IT", "ES", "PT", "NL", "FI", "AT", "IE", "GR", "LU", "MT", "CY", "SI", "SK", "LV", "LT", "EE"
];


function TarifDetail(props) {
  const classes = useStyles();
  const [currency, setCurrency] = useState(0); // 0: MAD/dh, 1: EUR, 2: USD
  const [profileType, setProfileType] = useState('fournisseur');

  useEffect(() => {
    agent.get("/api/geolocation")
      .then((res) => {
        const data = res.data;
        const country = data.country_code;
        if (country === "MA") setCurrency(0);
        else if (euroCountries.includes(country)) setCurrency(1);
        else setCurrency(2);
      })
      .catch(() => setCurrency(2));
  }, []);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" className="font-950 text-slate-800 tracking-tight">Tarification & Formules</Typography>
        <Typography className="text-14 text-slate-400 mt-8 italic">Boopursal: Votre partenaire business B2B</Typography>

        <div className={classes.toggleContainer}>
          <button
            className={clsx(classes.toggleBtn, profileType === 'fournisseur' && classes.activeToggle)}
            onClick={() => setProfileType('fournisseur')}
          >
            <Icon fontSize="small" className="mr-8">storefront</Icon> Fournisseur
          </button>
          <button
            className={clsx(classes.toggleBtn, profileType === 'acheteur' && classes.activeToggle)}
            onClick={() => setProfileType('acheteur')}
          >
            <Icon fontSize="small" className="mr-8">shopping_cart</Icon> Acheteur
          </button>
        </div>

        <div className={classes.currencyRow}>
          {['dh/MAD', '€ EUR', '$ USD'].map((c, i) => (
            <button
              key={i}
              className={clsx(classes.currBtn, currency === i && classes.activeCurr)}
              onClick={() => setCurrency(i)}
            >{c}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white">
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <div>
            {profileType === 'fournisseur' ? (
              <PricingFournisseur currency={currency} {...props} />
            ) : (
              <PricingAcheteur currency={currency} {...props} />
            )}
          </div>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default React.memo(TarifDetail);
