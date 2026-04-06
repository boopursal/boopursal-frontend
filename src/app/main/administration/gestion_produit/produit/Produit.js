import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
  Icon,
  Typography,
  TextField,
  LinearProgress,
  Grid,
  CircularProgress,
  IconButton,
  Tooltip,
  InputAdornment,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { red, orange } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import {
  FuseAnimate,
  FusePageCarded,
  TextFieldFormsy,
  CheckboxFormsy,
} from "@fuse";
import { useForm } from "@fuse/hooks";
import { Link } from "react-router-dom";
import clsx from "clsx";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import Formsy from "formsy-react";
import moment from "moment";
import green from "@material-ui/core/colors/green";
import SelectReactFormsy from "@fuse/components/formsy/SelectReactFormsy";
import Link2 from "@material-ui/core/Link";
import YouTube from "react-youtube";
import ContentLoader from "react-content-loader";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { URL_SITE } from "@fuse/Constants";

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
  produitImageFeaturedStar2: {
    position: "absolute",
    top: 0,
    right: 0,
    color: red[400],
    opacity: 0,
  },
  produitImageFeaturedStar: {
    position: "absolute",
    top: 0,
    left: 0,
    color: orange[400],
    opacity: 0,
  },
  produitImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  select: {
    zIndex: 999,
  },
  produitImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& $produitImageFeaturedStar": {
        opacity: 0.8,
      },
      "& $produitImageFeaturedStar2": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      boxShadow: theme.shadows[3],
      "& $produitImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover $produitImageFeaturedStar": {
        opacity: 1,
      },
    },
  },

  error: {
    backgroundColor: theme.palette.error.dark,
  },

  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));
moment.defaultFormat = "DD/MM/YYYY HH:mm";
function Produit(props) {
  const dispatch = useDispatch();
  const produit = useSelector(({ produitsApp }) => produitsApp.produit);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const { form, handleChange, setForm } = useForm(null);
  const classes = useStyles(props);
  const [tabValue, setTabValue] = useState(0);
  const [secteur, setSecteur] = useState(null);
  const [sousSecteur, setSousSecteur] = useState(null);
  const [categorie, setCategorie] = useState(null);
  const [videoId, setVideoId] = useState("");
  const [showErrorVideo, setShowErrorVideo] = useState(false);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);

  const opts = {
    width: "460",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      showinfo: 0,
      fs: 0,
      modestbranding: 1,
      rel: 0,
    },
  };
  // Effect upload fiche technique
  useEffect(() => {
    if (produit.fiche) {
      setForm(_.set({ ...form }, "ficheTechnique", produit.fiche));
    }
    return () => {
      dispatch(Actions.cleanImage());
    };
  }, [form, setForm, produit.fiche, dispatch]);

  // Effect Video
  useEffect(() => {
    if (produit.videoExist === 1) {
      setForm(_.set({ ...form }, "videos", videoId));
      setShowErrorVideo(false);
    } else if (produit.videoExist === 2) {
      setForm(_.set({ ...form }, "videos", null));
      setShowErrorVideo(true);
    }
    produit.videoExist = 0;
  }, [form, setForm, produit.videoExist, videoId]);

  // Effect Get Secteurs
  useEffect(() => {
    dispatch(Actions.getSecteurs());
  }, [dispatch]);

  // Effect handle errors
  useEffect(() => {
    if (
      produit.error &&
      (produit.error.reference ||
        produit.error.titre ||
        produit.error.description ||
        produit.error.pu ||
        produit.error.secteur ||
        produit.error.sousSecteurs)
    ) {
      formRef.current.updateInputsWithError({
        ...produit.error,
      });
      disableButton();
    }
    return () => {
      dispatch(Actions.cleanError());
    };
  }, [produit.error, dispatch]);

  // Effect redirection and clean state
  useEffect(() => {
    if (produit.success) {
      produit.success = false;
      produit.data = null;
      dispatch(Actions.cleanError());
      dispatch(Actions.cleanImage());
      dispatch(Actions.cleanDeleteImage());
      props.history.push("/products");
    }
  }, [produit.success, dispatch, props.history, produit.data]);

  // Effect upload images
  useEffect(() => {
    if (produit.image) {
      setForm(_.set({ ...form }, "images", [produit.image, ...form.images]));
      setImages([...images, URL_SITE + produit.image.url]);
    }
    return () => {
      dispatch(Actions.cleanImage());
    };
  }, [form, setForm, produit.image, dispatch, images]);
  // Effect delete image & fiche technique
  useEffect(() => {
    if (produit.image_deleted) {
      if (produit.image_deleted["@type"] === "ImageProduit") {
        setForm(
          _.set(
            { ...form },
            "images",
            _.pullAllBy(form.images, [{ id: produit.image_deleted.id }], "id")
          )
        );
        setImages(
          _.reject(images, function (i) {
            return i === URL_SITE + produit.image_deleted.url;
          })
        );
      } else {
        setForm(_.set({ ...form }, "ficheTechnique", null));
      }
      //
    }
    return () => {
      dispatch(Actions.cleanDeleteImage());
    };
  }, [produit.image_deleted, dispatch, form, setForm, images]);

  useEffect(() => {
    function updateProduitState() {
      const params = props.match.params;
      const { produitId } = params;
      dispatch(Actions.getProduit(produitId));
    }
    updateProduitState();
  }, [dispatch, props.match.params]);

  // SECTEUR ADDED SUCCESS
  useEffect(() => {
    if (produit.data && produit.secteurAdded) {
      setForm({ ...produit.data });
      setSecteur({
        value: produit.data.secteur["@id"],
        label: produit.data.secteur.name,
      });
      return () => {
        dispatch(Actions.cleanUpAddedSecteur());
      };
    }
  }, [form, produit.secteurAdded, produit.data, setForm, dispatch]);

  // ACTIVITE ADDED SUCCESS
  useEffect(() => {
    if (produit.data && produit.sousSecteurAdded) {
      setForm({ ...produit.data });
      setSousSecteur({
        value: produit.data.sousSecteurs["@id"],
        label: produit.data.sousSecteurs.name,
      });
      return () => {
        dispatch(Actions.cleanUpAddedSousSecteur());
      };
    }
  }, [form, produit.sousSecteurAdded, produit.data, setForm, dispatch]);

  // CATEGORIE ADDED SUCCESS
  useEffect(() => {
    if (produit.data && produit.CategorieAdded) {
      setForm({ ...produit.data });
      setCategorie({
        value: produit.data.categorie["@id"],
        label: produit.data.categorie.name,
      });
      return () => {
        dispatch(Actions.cleanUpAddedCategorie());
      };
    }
  }, [form, produit.CategorieAdded, produit.data, setForm, dispatch]);

  useEffect(() => {
    if (
      (produit.data && !form) ||
      (produit.data && form && produit.data.id !== form.id)
    ) {
      if (produit.data.secteur) {
        dispatch(Actions.getSousSecteurs(produit.data.secteur["@id"]));
        setSecteur({
          value: produit.data.secteur["@id"],
          label: produit.data.secteur.name,
        });
      }
      if (produit.data.sousSecteurs) {
        dispatch(Actions.getCategories(produit.data.sousSecteurs["@id"]));
        setSousSecteur({
          value: produit.data.sousSecteurs["@id"],
          label: produit.data.sousSecteurs.name,
        });
      }
      if (produit.data.images) {
        setImages(produit.data.images.map((item) => URL_SITE + item.url));
      }

      if (produit.data.categorie) {
        setCategorie({
          value: produit.data.categorie["@id"],
          label: produit.data.categorie.name,
        });
      }
      setForm({ ...produit.data });
    }
  }, [form, produit.data, setForm, dispatch]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  function handleCheckBoxChange(e, name) {
    setForm(_.set({ ...form }, name, e.target.checked));
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    dispatch(Actions.uploadImage(file));
  }

  function handleUploadFicheChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    dispatch(Actions.uploadFiche(file));
  }

  function handleChipChange(value, name) {
    setForm(_.set({ ...form }, name, value));

    if (name === "secteur") {
      if (value.value) {
        dispatch(Actions.getSousSecteurs(value.value));
        setSecteur(value);
      }
    }
    if (name === "sousSecteurs") {
      if (value.value) {
        dispatch(Actions.getCategories(value.value));
        setSousSecteur(value);
      }
    }
    if (name === "categorie") {
      setCategorie(value);
    }
  }

  function setFeaturedImage(id) {
    setForm(_.set({ ...form }, "featuredImageId", id));
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(form) {
    //event.preventDefault();
    const params = props.match.params;
    const { produitId } = params;

    if (produitId === "new") {
      dispatch(Actions.saveProduit(form, secteur, sousSecteur, categorie));
    } else {
      dispatch(
        Actions.putProduit(form, form.id, secteur, sousSecteur, categorie)
      );
    }
  }

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        !produit.loading
          ? form && (
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography
                    className="normal-case flex items-center sm:mb-12"
                    component={Link}
                    role="button"
                    to="/products"
                    color="inherit"
                  >
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Retour
                  </Typography>
                </FuseAnimate>

                <div className="flex items-center max-w-full">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    {form.images.length > 0 && form.featuredImageId ? (
                      <img
                        className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                        src={URL_SITE + form.featuredImageId.url}
                        alt={form.reference}
                      />
                    ) : (
                      <img
                        className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                        src="assets/images/ecommerce/product-image-placeholder.png"
                        alt={form.reference}
                      />
                    )}
                  </FuseAnimate>
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate
                      animation="transition.slideLeftIn"
                      delay={300}
                    >
                      <Typography className="text-16 sm:text-20 truncate">
                        {form.reference ? form.reference : "Nouveau produit"}
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate
                      animation="transition.slideLeftIn"
                      delay={300}
                    >
                      <Typography variant="caption">
                        Détails du produit
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-no-wrap"
                  variant="contained"
                  disabled={!isFormValid || produit.loading}
                  onClick={() => handleSubmit(form)}
                >
                  Sauvegarder
                  {produit.loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </Button>
              </FuseAnimate>
            </div>
          )
          : ""
      }
      contentToolbar={
        produit.loading ? (
          <div className={classes.root}>
            <LinearProgress color="secondary" />
          </div>
        ) : (
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="Infos générales" />
            <Tab
              className="h-64 normal-case"
              label={
                form && form.images.length > 0
                  ? "Image(s) (" + form.images.length + ")"
                  : "Image(s)"
              }
            />
            <Tab
              className="h-64 normal-case"
              label={
                form && form.ficheTechnique
                  ? "Fiche technique (1)"
                  : "Fiche technique"
              }
            />
            <Tab
              className="h-64 normal-case"
              label={form && form.videos ? "Vidéo (1)" : "Vidéo"}
            />
          </Tabs>
        )
      }
      content={
        !produit.loading
          ? form && (
            <div className="p-10  sm:p-24 max-w-2xl">
              {tabValue === 0 && (
                <Formsy
                  onValidSubmit={handleSubmit}
                  onValid={enableButton}
                  onInvalid={disableButton}
                  ref={formRef}
                  className="flex flex-col "
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <SelectReactFormsy
                        id="secteur"
                        name="secteur"
                        className="MuiFormControl-fullWidth MuiTextField-root "
                        value={secteur}
                        onChange={(value) =>
                          handleChipChange(value, "secteur")
                        }
                        placeholder="Sélectionner un secteur"
                        textFieldProps={{
                          label: "Secteurs",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        options={produit.secteurs}
                        fullWidth
                        required
                      />
                      {(secteur && (secteur.label === "Autre" ||
                        secteur.label === "autre")) && (
                          <TextFieldFormsy
                            className="mt-16 w-full"
                            type="text"
                            name="autreSecteur"
                            value={form.autreSecteur}
                            onChange={handleChange}
                            label="Autre Secteur"
                            validations={{
                              minLength: 2,
                              maxLength: 50,
                            }}
                            validationErrors={{
                              minLength:
                                "La longueur minimale de caractère est 2",
                              maxLength:
                                "La longueur maximale de caractère est 50",
                            }}
                            InputProps={{
                              endAdornment: produit.loadingAddSecteur ? (
                                <CircularProgress color="secondary" />
                              ) : (
                                <InputAdornment position="end">
                                  <IconButton
                                    color="secondary"
                                    disabled={!form.autreSecteur}
                                    onClick={(ev) =>
                                      dispatch(
                                        Actions.addSecteur(
                                          form.autreSecteur,
                                          form.id
                                        )
                                      )
                                    }
                                  >
                                    <Icon>add_circle</Icon>
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            variant="outlined"
                            required
                          />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <SelectReactFormsy
                        id="sousSecteurs"
                        name="sousSecteurs"
                        className="MuiFormControl-fullWidth MuiTextField-root"
                        value={sousSecteur}
                        onChange={(value) =>
                          handleChipChange(value, "sousSecteurs")
                        }
                        placeholder="Sélectionner une activité"
                        textFieldProps={{
                          label: "Activités",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        options={produit.sousSecteurs}
                        fullWidth
                        required
                      />
                      {sousSecteur &&
                        (sousSecteur.label === "Autre" ||
                          sousSecteur.label === "autre") && (
                          <TextFieldFormsy
                            className="mt-16 w-full"
                            type="text"
                            name="autreActivite"
                            value={form.autreActivite}
                            onChange={handleChange}
                            label="Autre Activité"
                            validations={{
                              minLength: 2,
                              maxLength: 50,
                            }}
                            validationErrors={{
                              minLength:
                                "La longueur minimale de caractère est 2",
                              maxLength:
                                "La longueur maximale de caractère est 50",
                            }}
                            variant="outlined"
                            InputProps={{
                              endAdornment: produit.loadingAddSousSecteur ? (
                                <CircularProgress color="secondary" />
                              ) : (
                                <InputAdornment position="end">
                                  <IconButton
                                    color="secondary"
                                    disabled={
                                      !form.autreActivite ||
                                      secteur.label === "Autre" ||
                                      secteur.label === "autre"
                                    }
                                    onClick={(ev) =>
                                      dispatch(
                                        Actions.addSousSecteur(
                                          form.autreActivite,
                                          secteur.value,
                                          form.id
                                        )
                                      )
                                    }
                                  >
                                    <Icon>add_circle</Icon>
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                            required
                          />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <SelectReactFormsy
                        id="categorie"
                        name="categorie"
                        className="MuiFormControl-fullWidth MuiTextField-root"
                        value={categorie}
                        onChange={(value) =>
                          handleChipChange(value, "categorie")
                        }
                        placeholder="Sélectionner un produit"
                        textFieldProps={{
                          label: "Produits",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        options={produit.categories}
                        fullWidth
                      />
                      {categorie &&
                        (categorie.label === "Autre" ||
                          categorie.label === "autre") && (
                          <TextFieldFormsy
                            className="mt-16 w-full"
                            type="text"
                            name="autreProduit"
                            value={form.autreProduit}
                            onChange={handleChange}
                            label="Autre Produit"
                            validations={{
                              minLength: 2,
                              maxLength: 50,
                            }}
                            validationErrors={{
                              minLength:
                                "La longueur minimale de caractère est 2",
                              maxLength:
                                "La longueur maximale de caractère est 50",
                            }}
                            variant="outlined"
                            required
                            InputProps={{
                              endAdornment: produit.loadingAddCategorie ? (
                                <CircularProgress color="secondary" />
                              ) : (
                                <InputAdornment position="end">
                                  <IconButton
                                    color="secondary"
                                    disabled={
                                      !form.autreProduit ||
                                      sousSecteur.label === "Autre" ||
                                      sousSecteur.label === "autre"
                                    }
                                    onClick={(ev) =>
                                      dispatch(
                                        Actions.addCategorie(
                                          form.autreProduit,
                                          sousSecteur.value,
                                          form.id
                                        )
                                      )
                                    }
                                  >
                                    <Icon>add_circle</Icon>
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                    </Grid>
                  </Grid>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextFieldFormsy
                        label="Titre"
                        id="titre"
                        name="titre"
                        value={form.titre}
                        onChange={handleChange}
                        variant="outlined"
                        validations={{
                          minLength: 6,
                        }}
                        validationErrors={{
                          minLength:
                            "La longueur minimale des caractères est de 6",
                        }}
                        className="mt-16"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        className="mb-24"
                        label="Référence"
                        id="reference"
                        name="reference"
                        value={form.reference}
                        onChange={handleChange}
                        variant="outlined"
                        validations={{
                          minLength: 4,
                        }}
                        validationErrors={{
                          minLength: "Min character length is 4",
                        }}
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        className="mb-24"
                        label="Prix Unitaire du produit"
                        type="number"
                        step="any"
                        id="pu"
                        name="pu"
                        value={String(form.pu)}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextFieldFormsy
                    className="mb-16  w-full"
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    label="Description"
                    autoComplete="description"
                    validations={{
                      minLength: 10,
                    }}
                    validationErrors={{
                      minLength: "La longueur minimale de caractère est 10",
                    }}
                    required
                    variant="outlined"
                    multiline
                    rows="4"
                  />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <CheckboxFormsy
                        className="mb-10"
                        name="isValid"
                        onChange={(e) => handleCheckBoxChange(e, "isValid")}
                        label="Valider"
                        value={form.isValid}
                      />
                    </Grid>
                  </Grid>
                </Formsy>
              )}
              {tabValue === 1 && (
                <div>
                  <input
                    accept="text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,image/jpeg,image/gif,image/png,application/pdf,"
                    className="hidden"
                    id="button-file"
                    type="file"
                    disabled={produit.imageReqInProgress}
                    onChange={handleUploadChange}
                  />
                  <div className="flex justify-center sm:justify-start flex-wrap">
                    <label
                      htmlFor="button-file"
                      className={clsx(
                        classes.produitImageUpload,
                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                        form.images.length === 5 && "hidden"
                      )}
                    >
                      {produit.imageReqInProgress ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                        <Icon fontSize="large" color="action">
                          arrow_upward
                        </Icon>
                      )}
                    </label>

                    {form.images.map((media) => (
                      <div
                        className={clsx(
                          classes.produitImageItem,
                          "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5",
                          media.id ===
                          (form.featuredImageId
                            ? form.featuredImageId.id
                            : null) && "featured"
                        )}
                        key={media.id}
                        onClick={() => {
                          setIsOpen(true);
                        }}
                      //onClick={() => window.open(URL_SITE + media.url, "_blank")}
                      >
                        <Tooltip title="Image en vedette">
                          <IconButton
                            className={classes.produitImageFeaturedStar}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              setFeaturedImage(media);
                            }}
                          >
                            <Icon>star</Icon>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            className="text-red text-20"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              dispatch(
                                Actions.openDialog({
                                  children: (
                                    <>
                                      <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                      <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                          Voulez-vous vraiment supprimer ce média ?
                                        </DialogContentText>
                                      </DialogContent>
                                      <DialogActions>
                                        <Button
                                          variant="contained"
                                          onClick={() => dispatch(Actions.closeDialog())}
                                          color="primary"
                                        >
                                          Non
                                        </Button>
                                        <Button
                                          onClick={() => {
                                            dispatch(Actions.deleteMedia(media));
                                            dispatch(Actions.closeDialog());
                                          }}
                                          color="primary"
                                          autoFocus
                                        >
                                          Oui
                                        </Button>
                                      </DialogActions>
                                    </>
                                  ),
                                })
                              );
                            }}
                          >
                            <Icon>delete</Icon>
                          </IconButton>
                        </Tooltip>
                        <img
                          className="max-w-none w-auto h-full"
                          src={URL_SITE + media.url}
                          alt="produit"
                        />
                        {isOpen && (
                          <Lightbox
                            mainSrc={images[photoIndex]}
                            nextSrc={images[(photoIndex + 1) % images.length]}
                            prevSrc={
                              images[
                              (photoIndex + images.length - 1) %
                              images.length
                              ]
                            }
                            onCloseRequest={() => setIsOpen(false)}
                            onMovePrevRequest={() =>
                              setPhotoIndex(
                                (photoIndex + images.length - 1) %
                                images.length
                              )
                            }
                            onMoveNextRequest={() =>
                              setPhotoIndex((photoIndex + 1) % images.length)
                            }
                          />
                        )}
                      </div>
                    ))}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption">
                          - Taille maximale par fichier : 2 Mb <br />- 5
                          fichiers à télécharger
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}
              {tabValue === 2 && (
                <div>
                  <input
                    accept="text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,image/jpeg,image/gif,image/png,application/pdf,"
                    className="hidden"
                    id="button-file"
                    type="file"
                    disabled={produit.ficheReqInProgress}
                    onChange={handleUploadFicheChange}
                  />
                  <div className="flex justify-center sm:justify-start flex-wrap">
                    <label
                      htmlFor="button-file"
                      className={clsx(
                        classes.produitImageUpload,
                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                        form.ficheTechnique && "hidden"
                      )}
                    >
                      {produit.ficheReqInProgress ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                        <Icon fontSize="large" color="action">
                          arrow_upward
                        </Icon>
                      )}
                    </label>

                    {form.ficheTechnique ? (
                      <div
                        className={clsx(
                          classes.produitImageItem,
                          "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5"
                        )}
                        key={form.ficheTechnique.id}
                        onClick={() =>
                          window.open(
                            URL_SITE + form.ficheTechnique.url,
                            "_blank"
                          )
                        }
                      >
                        <Tooltip title="Supprimer">
                          <IconButton
                            className={classes.produitImageFeaturedStar}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              dispatch(
                                Actions.deleteMedia(form.ficheTechnique)
                              );
                            }}
                          >
                            <Icon>delete</Icon>
                          </IconButton>
                        </Tooltip>
                        {_.split(form.ficheTechnique, "/", 1)[0] ===
                          "image" ? (
                          <img
                            className="max-w-none w-auto h-full"
                            src={URL_SITE + form.ficheTechnique.url}
                            alt="fiche"
                          />
                        ) : (
                          <Icon color="secondary" style={{ fontSize: 80 }}>
                            insert_drive_file
                          </Icon>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption">
                          - Taille maximale de fichier : 3 Mo
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}
              {tabValue === 3 && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="ID vidéo Youtube"
                      id="video"
                      name="video"
                      variant="outlined"
                      onChange={(e) => {
                        setVideoId(e.target.value);
                      }}
                      fullWidth
                    />
                    <Button
                      className="whitespace-no-wrap mt-10 mb-10"
                      variant="contained"
                      fullWidth
                      size="large"
                      color="secondary"
                      disabled={produit.loadingRechercheVideo || !videoId}
                      onClick={() => {
                        dispatch(Actions.getVideoYoutubeById(videoId));
                      }}
                    >
                      Rechercher
                      {produit.loadingRechercheVideo && (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      )}
                    </Button>

                    <Typography variant="h6" className="mb-10">
                      <Icon color="secondary">info</Icon> COMMENT OBTENIR L'ID
                      DE LA VIDÉO YOUTUBE?{" "}
                    </Typography>
                    <Typography className="mb-10">
                      Il n'est pas difficile d'obtenir l'ID vidéo Youtube dans
                      le navigateur ou via l'application. Suivez ces étapes:
                    </Typography>
                    <Typography variant="h6" className="mb-10">
                      TROUVEZ L'ID DE LA VIDÉO YOUTUBE VIA LE NAVIGATEUR
                    </Typography>
                    <Typography className="mb-10">
                      <ol>
                        <li>Accédez à votre vidéo Youtube préférée</li>
                        <li>
                          Vérifiez l'URL dans le navigateur Web, par exemple.
                          https://www.youtube.com/watch?v=JGwWNGJdvx8
                        </li>
                        <li>
                          L'ID vidéo est la partie entre "? V =" et "&", dans
                          ce cas "JGwWNGJdvx8"
                        </li>
                        <li>
                          Parfois, l'URL de la vidéo YouTube ressemble à
                          "https://youtube.be/JGwWNGJdvx"
                        </li>
                        <li>
                          Dans ce cas, l'url de la vidéo fait partie de la
                          dernière barre oblique "/" et "&"
                        </li>
                      </ol>
                    </Typography>

                    <Typography className="mb-10" variant="h6">
                      TROUVER UN ID VIDEO YOUTUBE DANS L'APPLICATION YOUTUBE
                    </Typography>
                    <Typography className="mb-10">
                      <ol>
                        <li>Ouvrez l'application Youtube</li>
                        <li>
                          Ouvrez la vidéo dont vous souhaitez l'ID vidéo
                        </li>
                        <li>
                          Cliquez sur le bouton Partager et choisissez le lien
                        </li>
                        <li>
                          Le lien est copié dans votre presse-papiers et vous
                          pouvez le coller n'importe où
                        </li>
                        <li>
                          Le lien ressemble à https://youtube.be/JGwWNGJdvx8
                        </li>
                        <li>
                          La vidéo est la partie entre la dernière barre
                          oblique "/" et "&", dans ce cas "JGwWNGJdvx8".
                        </li>
                      </ol>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {!produit.loadingRechercheVideo ? (
                      form.videos ? (
                        <>
                          <YouTube videoId={form.videos} opts={opts} />
                          <Link2
                            component="button"
                            variant="body2"
                            className="text-red"
                            onClick={() =>
                              setForm(_.set({ ...form }, "videos", null))
                            }
                          >
                            X Supprimer cette vidéo
                          </Link2>
                        </>
                      ) : showErrorVideo ? (
                        "ID vidéo n'existe pas dans la base de données YouTube"
                      ) : (
                        ""
                      )
                    ) : (
                      <ContentLoader height={250} width={320} speed={2}>
                        <rect
                          x="0"
                          y="0"
                          rx="3"
                          ry="3"
                          width="320"
                          height="250"
                        />
                      </ContentLoader>
                    )}
                  </Grid>
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

export default withReducer("produitsApp", reducer)(Produit);
