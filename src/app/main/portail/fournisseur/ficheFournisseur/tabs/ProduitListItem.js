import React from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import { useDispatch, useSelector } from "react-redux";
import { FuseAnimateGroup } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import _ from "@lodash";
import { Link } from "react-router-dom";
import { Chip, Icon, IconButton, Select, CircularProgress, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as Actions from "../../store/actions";

const useStyles = makeStyles(theme => ({
  productCard: {
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid #f1f5f9',
    backgroundColor: 'white',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      borderColor: theme.palette.primary.light
    }
  },
  imageWrapper: {
    height: 200,
    width: '100%',
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottom: '1px solid #f8fafc'
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  priceTag: {
    fontSize: '1rem',
    fontWeight: 900,
    color: theme.palette.primary.main,
    backgroundColor: '#f0f9ff',
    padding: '4px 12px',
    borderRadius: 8,
    display: 'inline-block'
  },
  paginationBtn: {
    borderRadius: 12,
    padding: '8px 16px',
    fontWeight: 700,
    border: '1px solid #e2e8f0',
    '&:hover': {
      backgroundColor: '#f8fafc',
      borderColor: theme.palette.primary.main
    }
  }
}));

function ProduitListItem(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pageCount = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.pageCount);
  const produits = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.produits);
  const loadingProduits = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.loadingProduits);
  const parametres = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.parametres);

  function handlePreviousClick() {
    dispatch(Actions.setParametresData({ ...parametres, page: Math.max(parametres.page - 1, 1) }));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  function handleNextClick() {
    dispatch(Actions.setParametresData({ ...parametres, page: Math.min(parametres.page + 1, pageCount) }));
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  function handleChangeItems(ev) {
    dispatch(Actions.setParametresData({ ...parametres, page: 1, itemsPerPage: ev.target.value }));
  }

  if (loadingProduits && !produits.length) {
    return (
      <div className="flex items-center justify-center py-64">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="w-full">
      <FuseAnimateGroup enter={{ animation: "transition.slideUpBigIn" }}>
        {produits.length > 0 ? (
          <Grid container spacing={3}>
            {produits.map((produit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper className={classes.productCard} elevation={0}>
                  <Link to={`/detail-produit/${produit.sousSecteurs?.slug}/${produit.categorie?.slug}/${produit.id}-${produit.slug}`} className="no-underline block">
                    <div className={classes.imageWrapper}>
                      <img
                        className={classes.img}
                        alt={produit.titre}
                        src={produit.featuredImageId ? URL_SITE + produit.featuredImageId.url : "assets/images/ecommerce/product-placeholder.jpg"}
                      />
                    </div>
                  </Link>
                  <div className="p-20 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-4 mb-12">
                      {produit.categorie && <Chip label={produit.categorie.name} size="small" className="text-10 font-bold bg-slate-50 text-slate-400" />}
                    </div>
                    <Typography
                      variant="h6"
                      className="font-800 text-slate-800 leading-tight mb-8 truncate-2-lines flex-grow no-underline"
                      component={Link}
                      to={`/detail-produit/${produit.sousSecteurs?.slug}/${produit.categorie?.slug}/${produit.id}-${produit.slug}`}
                    >
                      {produit.titre}
                    </Typography>

                    <div className="mt-16 flex items-center justify-between gap-12">
                      <div className={classes.priceTag}>
                        {produit.pu ? (
                          <span>{parseFloat(produit.pu).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} {produit.currency?.name}</span>
                        ) : (
                          <span className="text-12 font-bold opacity-70 italic">Sur demande</span>
                        )}
                      </div>
                      <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/detail-produit/${produit.sousSecteurs?.slug}/${produit.categorie?.slug}/${produit.id}-${produit.slug}`}
                        className="bg-slate-50"
                      >
                        <Icon className="text-18">arrow_forward</Icon>
                      </IconButton>
                    </div>
                  </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <div className="flex flex-col items-center py-64 bg-slate-50 rounded-24 border border-dashed border-slate-200">
            <Icon className="text-64 text-slate-300 mb-16">inventory_2</Icon>
            <Typography className="text-slate-500 font-bold">Aucun produit publié par cet établissement</Typography>
          </div>
        )}

        {produits.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-48 py-20 border-t border-slate-100 gap-24">
            <div className="flex items-center gap-12 text-13 font-bold text-slate-400">
              <span>Afficher :</span>
              <Select
                native
                value={parametres.itemsPerPage}
                onChange={handleChangeItems}
                className="bg-white px-8 py-4 rounded-8 border border-slate-200 font-bold"
                disableUnderline
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </Select>
              <span>par page</span>
            </div>

            <div className="flex items-center gap-16">
              <Button
                className={classes.paginationBtn}
                disabled={parametres.page === 1}
                onClick={handlePreviousClick}
              >
                <Icon className="mr-8">chevron_left</Icon>
                Précédent
              </Button>

              <div className="px-16 py-8 rounded-12 bg-slate-100 font-black text-slate-800">
                {parametres.page} / {pageCount}
              </div>

              <Button
                className={classes.paginationBtn}
                disabled={parametres.page === pageCount}
                onClick={handleNextClick}
              >
                Suivant
                <Icon className="ml-8">chevron_right</Icon>
              </Button>
            </div>
          </div>
        )}
      </FuseAnimateGroup>
    </div>
  );
}

export default ProduitListItem;
