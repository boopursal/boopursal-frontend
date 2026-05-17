import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import { FusePageCarded, FuseAnimate, SelectReactFormsy } from "@fuse";
import Formsy from "formsy-react";
import {
  Typography,
  Icon,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CardActions,
  Chip,
  IconButton,
  Avatar,
} from "@material-ui/core";
import ContentLoader from "react-content-loader";
import _ from "@lodash";
import { URL_SITE } from "@fuse/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  media: {
    height: 140,
  },
}));

function FocusProduits(props) {
  const dispatch = useDispatch();
  
  // We use the existing state from the focusProduit reducer
  const produit = useSelector(({ focusProduitsApp }) => focusProduitsApp.focusProduit);
  // We also load the list of currently selected products to know which ones are checked
  const focusList = useSelector(({ focusProduitsApp }) => focusProduitsApp.focusProduits.data);

  const [fournisseur, setFournisseur] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const classes = useStyles(props);

  useEffect(() => {
    // 1. Initial load: get all active focus items to compare against
    dispatch(Actions.getProduits());
    // 2. Load the list of suppliers to show in the dropdown
    dispatch(Actions.getFournisseurHasProducts());
    
    return () => {
      dispatch(Actions.cleanUp());
    };
  }, [dispatch]);

  // Helper to check if an item is currently focused
  const isItemFocused = (itemId) => {
    if (!focusList) return false;
    return Object.values(focusList).some(f => f.produit && f.produit.id === itemId);
  };

  return (
    <FusePageCarded
      classes={{
        content: "flex flex-col h-full",
        header: "h-auto p-24 bg-transparent",
      }}
      header={
        <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between">
          <div className="flex items-center">
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Typography className="text-24 sm:text-32 font-800 text-slate-800 tracking-tight flex items-center gap-12">
                    <Icon className="text-32 text-indigo-500">star</Icon>
                    Mise à la Une (Focus Produits)
                </Typography>
            </FuseAnimate>
          </div>
        </div>
      }
      content={
        <div className="p-10 sm:p-24 max-w-full">
            <Typography variant="body1" className="mb-24 text-slate-500 max-w-3xl leading-relaxed">
                Recherchez directement un fournisseur ciblé (ex: fabricant de pompes, thés...) pour explorer l'ensemble de son catalogue instantanément.\<br/>
                Cliquez ensuite sur l'étoile ou le bouton pour placer immédiatement ses meilleurs articles en page d'accueil de Boopursal.
            </Typography>

            {/* BANDREAU RECAPITULATIF DES PRODUITS A LA UNE */}
            {focusList && focusList.length > 0 && (
                <div className="mb-32 p-16 rounded-2xl bg-amber-50 border border-amber-200">
                    <Typography className="text-14 font-700 text-amber-800 mb-12 flex items-center gap-8">
                        <Icon className="text-18">stars</Icon>
                        Actuellement à la Une (Page d'accueil) - {focusList.length} / 8 Emplacements Utilisés
                    </Typography>
                    <div className="flex flex-wrap gap-12">
                        {focusList.map((slot) => (
                            slot.produit ? (
                                <Chip
                                    key={slot.id}
                                    avatar={<Avatar src={
                                        slot.produit.featuredImageId 
                                            ? URL_SITE + "/images/produits/" + slot.produit.featuredImageId.url 
                                            : (slot.produit.images && slot.produit.images.length > 0
                                                ? URL_SITE + "/images/produits/" + slot.produit.images[0].url
                                                : '/assets/images/ecommerce/product-image-placeholder.png')
                                    } />}
                                    label={_.truncate(slot.produit.titre, { length: 25 })}
                                    onDelete={() => {
                                        dispatch(Actions.toggleFocusProduit(slot.produit.id)).then(() => {
                                            dispatch(Actions.getProduits());
                                        });
                                    }}
                                    className="h-32 bg-white border border-amber-300 font-500 text-slate-700 shadow-sm"
                                    deleteIcon={<Icon className="text-slate-400 hover:text-red-500">cancel</Icon>}
                                />
                            ) : null
                        ))}
                    </div>
                </div>
            )}

            <Formsy>
              <Grid
                container
                spacing={3}
                className="items-center bg-white p-24 rounded-2xl shadow-sm mb-32"
                style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}
              >
                <Grid item sm={6} xs={12}>
                  <SelectReactFormsy
                    id="fournisseur"
                    name="fournisseur"
                    value={fournisseur}
                    placeholder="Tapez le nom d'un fournisseur pour chercher..."
                    textFieldProps={{
                      label: "1. Rechercher un fournisseur",
                      InputLabelProps: { shrink: true },
                      variant: "outlined",
                    }}
                    options={produit.fournisseurs}
                    onChange={(value) => {
                      setFournisseur(value);
                      setCategorie(null);
                      if (value) {
                        dispatch(Actions.GetAllCategorieByFournisseur(value.value));
                        dispatch(Actions.GetProductsByCategorieByFournisseur(value.value, null));
                      }
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <SelectReactFormsy
                    id="categorie"
                    name="categorie"
                    value={categorie}
                    placeholder="Toutes les catégories..."
                    textFieldProps={{
                      label: "2. Filtrer par Catégorie (Optionnel)",
                      InputLabelProps: { shrink: true },
                      variant: "outlined",
                    }}
                    options={produit.categories}
                    disabled={!fournisseur || (produit.categories && produit.categories.length === 0)}
                    onChange={(value) => {
                      setCategorie(value);
                      if (fournisseur && value) {
                        dispatch(Actions.GetProductsByCategorieByFournisseur(fournisseur.value, value.value));
                      } else if (fournisseur && !value) {
                        dispatch(Actions.GetProductsByCategorieByFournisseur(fournisseur.value, null));
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Formsy>

            {produit.loadingProducts ? (
              <ContentLoader viewBox="0 0 1360 400" speed={2}>
                <rect x="0" y="20" rx="8" width="250" height="250" />
                <rect x="280" y="20" rx="8" width="250" height="250" />
                <rect x="560" y="20" rx="8" width="250" height="250" />
              </ContentLoader>
            ) : null}

            {!produit.loadingProducts && produit.products && produit.products.length === 0 && fournisseur ? (
                <div className="flex flex-col items-center justify-center p-48 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Icon className="text-48 text-slate-300 mb-16">inventory_2</Icon>
                    <Typography className="text-16 font-600 text-slate-500">Aucun produit valide trouvé pour ce fournisseur.</Typography>
                </div>
            ) : null}

            {!produit.loadingProducts && produit.products && produit.products.length > 0 && (
              <Grid container spacing={4} className="mt-8">
                {produit.products.map((item, index) => {
                  const isFocused = isItemFocused(item.id);

                  return (
                    <Grid item xl={3} lg={4} md={4} sm={6} xs={12} key={index}>
                      <Card 
                        className="flex flex-col h-full rounded-2xl transition-all duration-300 relative overflow-hidden"
                        style={{ 
                          boxShadow: isFocused ? '0 10px 40px -10px rgba(245,158,11,0.3)' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                          border: isFocused ? '2px solid #F59E0B' : '2px solid transparent'
                        }}
                      >
                        {isFocused && (
                            <div className="absolute top-0 right-0 p-8 z-10">
                                <div className="bg-amber-500 text-white p-6 rounded-full shadow-lg flex items-center justify-center">
                                    <Icon className="text-20">star</Icon>
                                </div>
                            </div>
                        )}
                        <CardMedia
                          className={classes.media}
                          image={
                            item.featuredImageId
                              ? URL_SITE + "/images/produits/" + item.featuredImageId.url
                              : (item.images && item.images.length > 0 
                                  ? URL_SITE + "/images/produits/" + item.images[0].url 
                                  : "/assets/images/ecommerce/product-image-placeholder.png")
                          }
                          title={item.titre}
                        />
                        <CardContent className="flex-1 pt-16">
                          <Typography
                            gutterBottom
                            variant="h6"
                            className="font-700 text-15 leading-tight"
                          >
                            {_.capitalize(_.truncate(item.titre, { length: 45 }))}
                          </Typography>
                          <Typography variant="caption" className="text-12 font-500 text-slate-500 mb-8 block">
                            Réf. {item.reference}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" className="mb-16 mt-8 leading-relaxed">
                            {_.capitalize(_.truncate(item.description, { length: 80 }))}
                          </Typography>
                        </CardContent>

                        <CardActions className="flex justify-center p-16 pt-0 bg-transparent mt-auto">
                          {isFocused ? (
                            <Button
                                className="w-full h-40 rounded-xl font-600 transition-colors shadow-none"
                                variant="contained"
                                onClick={() => {
                                  dispatch(Actions.toggleFocusProduit(item.id)).then(() => {
                                      // Refresh the global list of focused item
                                      dispatch(Actions.getProduits());
                                  });
                                }}
                                style={{ backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' }}
                            >
                                <Icon className="mr-8">star_border</Icon>
                                Retirer de la Une
                            </Button>
                          ) : (
                            <Button
                              className="w-full h-40 rounded-xl font-600 transition-colors shadow-none hover:shadow-md"
                              variant="contained"
                              onClick={() => {
                                dispatch(Actions.toggleFocusProduit(item.id)).then(() => {
                                    dispatch(Actions.getProduits());
                                });
                              }}
                              style={{ backgroundColor: '#F1F5F9', color: '#475569' }}
                            >
                              <Icon className="mr-8 text-amber-500">star</Icon>
                              Placer à la Une
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
        </div>
      }
      innerScroll
    />
  );
}

export default withReducer("focusProduitsApp", reducer)(FocusProduits);
