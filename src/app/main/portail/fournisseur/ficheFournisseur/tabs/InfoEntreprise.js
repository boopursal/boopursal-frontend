import React from "react";
import { FuseAnimateGroup } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import {
  Typography,
  Grid,
  IconButton,
  Icon,
  Chip,
  Paper,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Link2 from "@material-ui/core/Link";
import _ from "@lodash";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 900,
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    marginTop: 40,
    '&:first-child': {
      marginTop: 0
    }
  },
  titleLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#f1f5f9'
  },
  productCard: {
    borderRadius: 16,
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      borderColor: theme.palette.primary.light
    }
  },
  productImgWrapper: {
    height: 160,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  tag: {
    borderRadius: 8,
    fontWeight: 700,
    fontSize: '0.75rem',
    margin: '0 4px 8px 0',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    color: '#64748b',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      borderColor: theme.palette.primary.main
    }
  }
}));

function InfoEntreprise(props) {
  const classes = useStyles();
  const params = props.match.params;
  const { id, slug } = params;
  const data = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.data);
  const produitsApercu = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.produitsApercu);
  const loadingProduitsApercu = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.loadingProduitsApercu);
  const loading = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.loading);

  if (!data) return null;

  return (
    <div className="p-0">
      {loading ? (
        <div className="flex items-center justify-center py-64">
          <CircularProgress />
        </div>
      ) : (
        <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>

          {/* Description Section */}
          <div className={classes.sectionTitle}>
            <Icon color="primary" style={{ fontSize: 20 }}>description</Icon>
            À PROPOS
            <div className={classes.titleLine} />
          </div>
          <Typography className="text-slate-500 leading-relaxed text-15 whitespace-pre-line mb-40">
            {data.description || "Aucune description fournie par l'entreprise."}
          </Typography>

          {/* Preview Section */}
          <div className={classes.sectionTitle}>
            <Icon color="primary" style={{ fontSize: 20 }}>view_module</Icon>
            APERÇU DU CATALOGUE
            <div className={classes.titleLine} />
          </div>

          {!loadingProduitsApercu ? (
            produitsApercu.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {produitsApercu.map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Link to={`/detail-produit/${item.sousSecteurs?.slug}/${item.categorie?.slug}/${item.id}-${item.slug}`} className="no-underline">
                        <Paper className={classes.productCard} elevation={0}>
                          <div className={classes.productImgWrapper}>
                            <img
                              src={item.featuredImageId ? URL_SITE + item.featuredImageId.url : "assets/images/ecommerce/product-placeholder.jpg"}
                              alt={item.titre}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="p-12 border-t border-slate-50 bg-white">
                            <Typography className="font-bold text-slate-800 truncate text-sm">{item.titre}</Typography>
                          </div>
                        </Paper>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
                <div className="text-right mt-24">
                  <Button
                    component={Link}
                    to={`/entreprise/${id}-${slug}/produits`}
                    color="primary"
                    className="font-bold text-13 normal-case"
                  >
                    Voir tout le catalogue produits
                    <Icon className="ml-8">arrow_forward</Icon>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-40 bg-slate-50 rounded-20 border border-dashed border-slate-200">
                <Icon className="text-48 text-slate-300 mb-12">inventory_2</Icon>
                <Typography className="text-slate-400 font-bold">Aucun produit n'est publié par cette entreprise</Typography>
              </div>
            )
          ) : (
            <div className="grid grid-cols-4 gap-16 py-20">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-200 bg-slate-50 animate-pulse rounded-16" />)}
            </div>
          )}

          {/* Activities Section */}
          <div className={classes.sectionTitle}>
            <Icon color="primary" style={{ fontSize: 20 }}>business_center</Icon>
            DOMAINES D'ACTIVITÉ
            <div className={classes.titleLine} />
          </div>
          <div className="flex flex-wrap gap-8">
            {data.categories && data.categories.length > 0 ? data.categories.map((item, index) => (
              <Chip
                key={index}
                label={_.capitalize(item.name)}
                onClick={() => item.sousSecteurs?.[0] && props.history.push({
                  pathname: `/entreprises/${item.sousSecteurs[0].secteur.slug}/${item.sousSecteurs[0].slug}/${item.slug}`
                })}
                className={classes.tag}
                variant="outlined"
              />
            )) : (
              <Typography className="text-slate-400 italic text-13">Non spécifié</Typography>
            )}
          </div>

        </FuseAnimateGroup>
      )}
    </div>
  );
}

export default InfoEntreprise;
