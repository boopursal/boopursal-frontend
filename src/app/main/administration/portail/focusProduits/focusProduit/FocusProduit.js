import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useForm } from "@fuse/hooks";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import { FusePageCarded, FuseAnimate, SelectReactFormsy } from "@fuse";
import {
  Typography,
  Icon,
  Grid,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Button,
  CardActions,
  Chip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import green from "@material-ui/core/colors/green";
import ContentLoader from "react-content-loader";
import _ from "@lodash";
import { URL_SITE } from "@fuse/Constants";
import Formsy from "formsy-react";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  media: {
    height: 140,
  },
}));
function FocusProduit(props) {
  const dispatch = useDispatch();
  const produit = useSelector(
    ({ focusProduitsApp }) => focusProduitsApp.focusProduit
  );
  const [fournisseur, setFournisseur] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const { form, setForm } = useForm(null);
  const classes = useStyles(props);

  useEffect(() => {
    function updateFocusProduitState() {
      const params = props.match.params;
      const { produitId } = params;
      dispatch(Actions.getFocusProduit(produitId));
      dispatch(Actions.getFournisseurHasProducts());
    }

    updateFocusProduitState();
  }, [dispatch, props.match.params]);

  useEffect(() => {
    if (
      (produit.data && !form) ||
      (produit.data && form && produit.data.id !== form.id)
    ) {
      setForm({ ...produit.data });
      if (produit.data.produit) {
        setFournisseur({
          value: produit.data.produit.fournisseur.id,
          label: produit.data.produit.fournisseur.societe,
        });
        setCategorie({
          value: produit.data.produit.categorie.id,
          label: produit.data.produit.categorie.name,
        });
        dispatch(
          Actions.GetAllCategorieByFournisseur(
            produit.data.produit.fournisseur.id
          )
        );
        dispatch(
          Actions.GetProductsByCategorieByFournisseur(
            produit.data.produit.fournisseur.id,
            produit.data.produit.categorie.id
          )
        );
      }
    }
  }, [dispatch, form, produit.data, setForm]);

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        form && (
          <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex flex-col items-start max-w-full">
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Typography
                  className="normal-case flex items-center sm:mb-12"
                  component={Link}
                  role="button"
                  to="/admin/focus-produits"
                  color="inherit"
                >
                  <Icon className="mr-4 text-20">arrow_back</Icon>
                  Retour
                </Typography>
              </FuseAnimate>

              <div className="flex items-center max-w-full">
                <div className="flex flex-col min-w-0">
                  <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                    <Typography className="text-16 sm:text-20 truncate font-700">
                      Configuration de l'Emplacement #{form.id}
                    </Typography>
                  </FuseAnimate>
                  <Typography variant="caption" style={{ color: '#64748B' }}>
                    Produit actuellement assigné : {form.produit ? form.produit.titre : "Vide"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )
      }
      content={
        !produit.loading
          ? form && (
              <div className="p-10  sm:p-24 max-w-2xl">
                <Formsy>
                  <Grid
                    container
                    spacing={3}
                    className="items-center bg-white p-24 rounded-2xl shadow-sm mb-24"
                    style={{ background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(248,250,252,1))' }}
                  >
                    <Grid item sm={6} xs={12}>
                      <SelectReactFormsy
                        id="fournisseur"
                        name="fournisseur"
                        value={fournisseur}
                        placeholder="Rechercher / Sélectionner un fournisseur"
                        textFieldProps={{
                          label: "Fournisseur",
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
                        placeholder="Filtrer optionnellement par catégorie"
                        textFieldProps={{
                          label: "Catégorie (Optionnel)",
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
                  <ContentLoader
                    viewBox="0 0 1360 900"
                    height={900}
                    width={1360}
                    speed={2}
                  >
                    <rect
                      x="30"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="30"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="30"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                    <rect
                      x="250"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="250"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="250"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                    <rect
                      x="470"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="470"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="470"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                    <rect
                      x="690"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="690"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="690"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                    <rect
                      x="910"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="910"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="910"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                    <rect
                      x="1130"
                      y="20"
                      rx="8"
                      ry="8"
                      width="200"
                      height="200"
                    />
                    <rect
                      x="1130"
                      y="250"
                      rx="0"
                      ry="0"
                      width="200"
                      height="18"
                    />
                    <rect
                      x="1130"
                      y="275"
                      rx="0"
                      ry="0"
                      width="120"
                      height="20"
                    />
                  </ContentLoader>
                ) : (
                  <Grid container spacing={2}>
                    {produit.products &&
                      produit.products.map((item, index) => (
                        <Grid item sm={3} xs={6} key={index}>
                          <Card 
                            className="flex flex-col h-full rounded-2xl transition-all duration-300"
                            style={{ 
                              boxShadow: produit.data.produit && produit.data.produit.id === item.id ? '0 10px 40px -10px rgba(60,80,224,0.3)' : '0 4px 20px -2px rgba(0,0,0,0.05)',
                              border: produit.data.produit && produit.data.produit.id === item.id ? '2px solid #3C50E0' : '2px solid transparent'
                            }}
                          >
                            <CardMedia
                              className={classes.media}
                              image={
                                item.featuredImageId
                                  ? URL_SITE + item.featuredImageId.url
                                  : "/assets/images/ecommerce/product-placeholder.jpg"
                              }
                              title={item.titre}
                            />
                            <CardContent className="flex-1">
                              <Typography
                                gutterBottom
                                variant="h6"
                                className="font-700 text-15 leading-tight"
                              >
                                {_.capitalize(
                                  _.truncate(item.titre, {
                                    length: 40,
                                  })
                                )}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-12 font-500 text-slate-500 mb-8 block"
                              >
                                Réf. {item.reference}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                                className="mb-16 mt-8 leading-relaxed"
                              >
                                {_.capitalize(
                                  _.truncate(item.description, {
                                    length: 100,
                                  })
                                )}
                              </Typography>
                              <div className="flex flex-wrap gap-4 mt-auto">
                                {item.images.length > 0 && (
                                  <Chip
                                    icon={<Icon className="text-16 mr-0">image</Icon>}
                                    label={item.images.length}
                                    classes={{ root: "h-24 bg-slate-100", label: "px-8 text-11 font-600 text-slate-600" }}
                                  />
                                )}
                                {item.videos && (
                                  <Chip
                                    icon={<Icon className="text-16 mr-0">videocam</Icon>}
                                    label="1"
                                    classes={{ root: "h-24 bg-slate-100", label: "px-8 text-11 font-600 text-slate-600" }}
                                  />
                                )}
                              </div>
                            </CardContent>
                            <CardActions className="flex justify-center p-16 pt-0 bg-transparent">
                              {produit.data.produit &&
                              produit.data.produit.id === item.id ? (
                                <Chip
                                  icon={<Icon className="text-16">check_circle</Icon>}
                                  label="Assigné au slot"
                                  className="w-full h-36 font-600 text-13"
                                  style={{ backgroundColor: '#10B981', color: 'white' }}
                                />
                              ) : (
                                <Button
                                  className="w-full h-36 rounded-xl font-600 transition-colors shadow-none hover:shadow-md"
                                  variant="contained"
                                  onClick={() => {
                                    dispatch(
                                      Actions.putFocusProduit(
                                        item["@id"],
                                        produit.data["@id"]
                                      )
                                    );
                                  }}
                                  style={{ backgroundColor: '#F1F5F9', color: '#3C50E0' }}
                                >
                                  Mettre en Focus
                                </Button>
                              )}
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                )}
              </div>
            )
          : ""
      }
      innerScroll
    />
  );
}

export default withReducer("focusProduitsApp", reducer)(FocusProduit);
