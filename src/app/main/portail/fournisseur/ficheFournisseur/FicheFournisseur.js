import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Tabs,
  Tab,
  Typography,
  Paper,
  Avatar,
  Icon,
  CardContent,
  Button,
  CircularProgress,
  Input,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import _ from "@lodash";
import { Helmet } from "react-helmet";
import { URL_SITE } from "@fuse/Constants";
import { FuseAnimate } from "@fuse";
import * as Actions from "../store/actions";
import InfoEntreprise from "./tabs/InfoEntreprise";
import Produits from "./tabs/Produits";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { showMessage } from "app/store/actions/fuse";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1240,
    margin: "0 auto",
    width: "100%",
    padding: "0 20px",
    marginTop: -80,
    position: "relative",
    zIndex: 50,
    paddingBottom: 80,
  },
  mainPaper: {
    borderRadius: 32,
    backgroundColor: "white",
    boxShadow: "0 40px 80px -20px rgba(0,0,0,0.12)",
    overflow: "hidden",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
  },
  companyHeader: {
    padding: "48px 40px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      textAlign: "center"
    }
  },
  logoWrapper: {
    width: 160,
    height: 160,
    borderRadius: 28,
    backgroundColor: "white",
    border: "2px solid #f1f5f9",
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
    overflow: "hidden"
  },
  logo: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain"
  },
  companyBadge: {
    fontSize: '0.8rem',
    fontWeight: 900,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 12,
    backgroundColor: '#eff6ff',
    padding: '4px 12px',
    borderRadius: 50,
    display: 'inline-block'
  },
  companyName: {
    fontSize: '2.75rem',
    fontWeight: 900,
    color: '#0f172a',
    lineHeight: 1,
    marginBottom: 24,
    letterSpacing: '-0.02em'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#475569'
  },
  tabsSection: {
    padding: "0 40px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fff"
  },
  tab: {
    minHeight: 80,
    fontWeight: 800,
    fontSize: "0.9rem",
    color: "#94a3b8",
    marginRight: 40,
    '&.Mui-selected': {
      color: theme.palette.primary.main
    }
  },
  contactCard: {
    borderRadius: 28,
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    padding: '32px 24px',
    position: "sticky",
    top: 24,
    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.03)"
  },
  contactTitle: {
    fontSize: '0.75rem',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 18,
    background: '#f8fafc',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
    border: '1px solid #f1f5f9',
    "& i": {
      color: theme.palette.primary.main,
      backgroundColor: '#fff',
      padding: 8,
      borderRadius: 12,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }
  },
  actionBtn: {
    borderRadius: 16,
    padding: "16px",
    fontSize: "1rem",
    fontWeight: 900,
    textTransform: "none",
    marginBottom: 16,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
    }
  },
  primaryBtn: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: 'white'
  },
  secondaryBtn: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: `2px solid #e2e8f0`,
    '&:hover': {
      borderColor: theme.palette.primary.main,
      backgroundColor: '#fff'
    }
  },
  shareGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40
  },
  shareBtn: {
    aspectRatio: '1/1',
    width: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
    },
    '& svg': {
      width: 18,
      height: 18,
      fill: 'white'
    }
  },
  copyInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: "6px 16px",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    transition: 'all 0.3s ease',
    '&:hover': {
      borderColor: theme.palette.primary.light
    }
  }
}));

const FB_ICON = <svg viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>;
const LI_ICON = <svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const WA_ICON = <svg viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.891 11.891-11.891 3.181 0 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.481 8.403 0 6.556-5.332 11.891-11.891 11.891-2.001 0-3.961-.503-5.713-1.457l-6.28 1.675zm11.913-21.493c-5.299 0-9.613 4.312-9.613 9.611 0 2.023.626 3.992 1.796 5.632l-1.077 3.93 4.02-1.073c1.554.912 3.321 1.394 5.122 1.394 5.301 0 9.615-4.314 9.615-9.613 0-2.559-1.002-4.965-2.822-6.786-1.815-1.815-4.223-2.815-6.821-2.815zm5.286 12.875c-.289-.145-1.714-.847-1.98-.943-.264-.097-.457-.145-.65.145-.195.289-.749.943-.917 1.137-.168.194-.336.216-.624.072-.288-.145-1.22-.449-2.324-1.434-.86-.766-1.44-1.713-1.609-2.002-.168-.288-.018-.444.126-.587.13-.129.288-.337.433-.505.144-.169.192-.289.288-.481.096-.192.048-.36-.024-.505-.072-.144-.65-1.566-.891-2.144-.233-.563-.473-.487-.65-.496-.168-.009-.36-.009-.553-.009-.192 0-.505.072-.769.36-.264.289-1.01 0.985-1.01 2.404s1.033 2.784 1.177 2.977c.144.192 2.031 3.102 4.921 4.352.686.297 1.222.474 1.639.607.69.219 1.319.189 1.815.115.553-.083 1.714-.699 1.956-1.374.24-.675.24-1.253.168-1.374-.072-.121-.264-.193-.552-.338z" /></svg>;

function FicheFournisseur(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const fournisseur = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur);
  const data = fournisseur.data;
  const loading = fournisseur.loading;
  const { id, tab, slug } = props.match.params;

  useEffect(() => {
    setValue(tab === "produits" ? 1 : 0);
  }, [tab]);

  const handleChange = (event, newValue) => {
    const targetTab = newValue === 1 ? "produits" : "";
    props.history.push(`/entreprise/${id}-${slug}${targetTab ? "/" + targetTab : ""}`);
    setValue(newValue);
  };

  const shareOn = (platform) => {
    const url = window.location.href;
    const title = data.societe;
    let shareUrl = "";
    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`; break;
      default: break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  if (loading && !data) {
    return (
      <div className={classes.root}>
        <Paper className={classes.mainPaper} style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress color="primary" />
        </Paper>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{`${data.societe} | Officiel - Boopursal`}</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <Paper className={classes.mainPaper}>
        <div className={classes.companyHeader}>
          <div className={classes.logoWrapper}>
            {data.avatar ? (
              <img src={URL_SITE + data.avatar.url} className={classes.logo} alt={data.societe} />
            ) : (
              <Typography variant="h2" color="primary" className="font-black text-48">
                {data.societe?.substring(0, 2).toUpperCase()}
              </Typography>
            )}
          </div>
          <div className="flex-1">
            <div className={classes.companyBadge}>{data.ville?.name}</div>
            <Typography className={classes.companyName}>{data.societe}</Typography>

            <div className={classes.infoContainer}>
              <div className={classes.infoItem}>
                <Icon style={{ fontSize: 20 }} className="text-slate-300">business</Icon>
                <span>Identifiant Commun (ICE): <span className="text-slate-900 font-900 ml-4">{data.ice || 'Contactez-nous'}</span></span>
              </div>
              {data.website && (
                <div className={classes.infoItem}>
                  <Icon style={{ fontSize: 20 }} className="text-blue-500">public</Icon>
                  <a
                    href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {data.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={classes.tabsSection}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            className="w-full"
          >
            <Tab label="NOTRE PRÉSENTATION" className={classes.tab} />
            <Tab label="CATALOGUE PRODUITS" className={classes.tab} />
          </Tabs>
        </div>

        <div className="p-40">
          <Grid container spacing={5}>
            <Grid item md={8} xs={12}>
              <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div>
                  {value === 0 && <InfoEntreprise {...props} />}
                  {value === 1 && <Produits />}
                </div>
              </FuseAnimate>
            </Grid>

            <Grid item md={4} xs={12}>
              <div className={classes.contactCard}>
                <Typography className={classes.contactTitle}>Partage & Contact</Typography>

                <div className={classes.shareGrid}>
                  <Tooltip title="Facebook" placement="top">
                    <div onClick={() => shareOn('facebook')} style={{ backgroundColor: '#1877f2' }} className={classes.shareBtn}>
                      {FB_ICON}
                    </div>
                  </Tooltip>
                  <Tooltip title="LinkedIn" placement="top">
                    <div onClick={() => shareOn('linkedin')} style={{ backgroundColor: '#0077b5' }} className={classes.shareBtn}>
                      {LI_ICON}
                    </div>
                  </Tooltip>
                  <Tooltip title="WhatsApp" placement="top">
                    <div onClick={() => shareOn('whatsapp')} style={{ backgroundColor: '#25d366' }} className={classes.shareBtn}>
                      {WA_ICON}
                    </div>
                  </Tooltip>
                </div>

                <div className={classes.contactItem}>
                  <Icon>location_on</Icon>
                  <div>
                    <Typography className="text-13 font-900 text-slate-800 uppercase tracking-widest mb-4">Siège Social</Typography>
                    <Typography className="text-15 text-slate-500 leading-relaxed font-600">
                      {data.adresse1}<br />
                      {data.ville?.name}, {data.pays?.name}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col">
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    className={clsx(classes.actionBtn, classes.primaryBtn)}
                    onClick={() => dispatch(Actions.openNewContactFournisseurDialog(data.id))}
                  >
                    <Icon className="mr-12">send</Icon> Envoyer un message
                  </Button>

                  {fournisseur.showPhone ? (
                    <div className="p-16 text-center rounded-16 border-2 border-primary-100 bg-primary-50 mb-16 shadow-inner">
                      <Typography className="text-lg font-black text-primary-700 flex items-center justify-center gap-12">
                        <Icon>phone</Icon> {fournisseur.phone}
                      </Typography>
                    </div>
                  ) : (
                    <Button
                      variant="outlined"
                      fullWidth
                      className={clsx(classes.actionBtn, classes.secondaryBtn)}
                      onClick={() => dispatch(Actions.updateVuPhoneFournisseur(data.id))}
                    >
                      <Icon className="mr-12">call</Icon>
                      {fournisseur.loadingsPhone ? <CircularProgress size={20} className="mr-8" /> : "Afficher le téléphone"}
                    </Button>
                  )}
                </div>

                <div className={classes.copyInput}>
                  <Typography className="text-11 text-slate-400 flex-1 truncate font-800">{window.location.href}</Typography>
                  <CopyToClipboard text={window.location.href} onCopy={() => dispatch(showMessage({ message: "URL copiée !", anchorOrigin: { vertical: "top", horizontal: "right" }, variant: "success" }))}>
                    <IconButton size="small" color="primary"><Icon className="text-18">content_copy</Icon></IconButton>
                  </CopyToClipboard>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </div>
  );
}

export default React.memo(FicheFournisseur);
