import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Tab,
  Tabs,
  InputAdornment,
  Icon,
  Typography,
  Divider,
  Grid,
  Avatar,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  FuseAnimate,
  FusePageCarded,
  URL_SITE,
  TextFieldFormsy,
  SelectReactFormsy,
  SelectFormsy,
} from "@fuse";
import { useForm } from "@fuse/hooks";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import _ from "@lodash";
import Formsy from "formsy-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import LinearProgress from "@material-ui/core/LinearProgress";
import clsx from "clsx";
import { Link } from "react-router-dom";

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
  acheteurImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  acheteurImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& $acheteurImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& $acheteurImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover $acheteurImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));
function Acheteur(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const acheteur = useSelector(({ acheteurApp }) => acheteurApp.acheteur);
  const Pays = useSelector(({ acheteurApp }) => acheteurApp.acheteur.pays);
  const Villes = useSelector(({ acheteurApp }) => acheteurApp.acheteur.villes);

  const formRef = useRef(null);
  const [showIce, setShowIce] = useState(false);
  const [ville, setVille] = useState(false);
  const [pays, setPays] = useState(false);
  const [secteur, setSecteur] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const { form, handleChange, setForm } = useForm(null);
  const params = props.match.params;
  const { acheteurId } = params;

  useEffect(() => {
    function updateAcheteurState() {
      dispatch(Actions.getAcheteur(acheteurId));
    }

    updateAcheteurState();
    return () => {
      dispatch(Actions.cleanUpAcheteur());
    };
  }, [dispatch, acheteurId]);

  //GET PAYS & SECTEURS

  useEffect(() => {
    dispatch(Actions.getPays());
    dispatch(Actions.getSecteurs());
  }, [dispatch]);

  //GET VILLE IF PAYS EXIST
  useEffect(() => {
    if (acheteur.data && !form) {
      if (acheteur.data.pays)
        dispatch(Actions.getVilles(acheteur.data.pays["@id"]));
    }
  }, [dispatch, acheteur.data, form]);

  //SET ERRORS IN INPUTS AFTER ERROR API
  useEffect(() => {
    if (
      acheteur.error &&
      (acheteur.error.societe ||
        acheteur.error.phone ||
        acheteur.error.firstName ||
        acheteur.error.lastName ||
        acheteur.error.pays ||
        acheteur.error.ville ||
        acheteur.error.adresse1 ||
        acheteur.error.adresse2 ||
        acheteur.error.website ||
        acheteur.error.fix ||
        acheteur.error.ice ||
        acheteur.error.description)
    ) {
      formRef.current.updateInputsWithError({
        ...acheteur.error,
      });
      disableButton();
    }
  }, [acheteur.error]);

  //SET FORM DATA
  useEffect(() => {
    if (
      (acheteur.data && !form) ||
      (acheteur.data && form && acheteur.data.id !== form.id)
    ) {
      if (acheteur.data.pays) {
        if (acheteur.data.pays.name === "Maroc") {
          setShowIce(true);
        }
      }
      setForm({ ...acheteur.data });
      acheteur.data.secteur &&
        setSecteur({
          value: acheteur.data.secteur["@id"],
          label: acheteur.data.secteur.name,
        });
      acheteur.data.ville &&
        setVille({
          value: acheteur.data.ville["@id"],
          label: acheteur.data.ville.name,
        });
      acheteur.data.pays &&
        setPays({
          value: acheteur.data.pays["@id"],
          label: acheteur.data.pays.name,
        });
    }
  }, [form, acheteur.data, setForm]);

  useEffect(() => {
    if (acheteur.data && acheteur.villeAdded) {
      setForm({ ...acheteur.data });
      setVille({
        value: acheteur.data.ville["@id"],
        label: acheteur.data.ville.name,
      });
      return () => {
        dispatch(Actions.cleanUpAddedVille());
      };
    }
  }, [form, acheteur.villeAdded, acheteur.data, setForm, dispatch]);
  useEffect(() => {
    if (acheteur.avatar) {
      setForm(_.set({ ...form }, "avatar", acheteur.avatar));
    }
  }, [form, acheteur.avatar, setForm]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  function handleChipChange(value, name) {
    if (name === "ville") {
      setForm(_.set({ ...form }, name, value));
      setVille(value);
    } else if (name === "secteur") {
      setForm(_.set({ ...form }, name, value));
      setSecteur(value);
    } else {
      form.ville = "";
      setPays(value);
      setForm(_.set({ ...form }, name, value));
      if (value.value) {
        dispatch(Actions.getVilles(value.value));
      }

      if (value.label === "Maroc") {
        setShowIce(true);
      } else {
        setShowIce(false);
      }
    }
  }

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    dispatch(Actions.uploadAvatar(file, form.id));
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmitInfoSociete(model) {
    dispatch(Actions.updateSocieteInfo(model, form.id));
  }

  function handleSubmitInfoPerso(model) {
    dispatch(Actions.updateUserInfo(model, form.id));
  }

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        !acheteur.requestAcheteur ? (
          form && (
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography
                    className="normal-case flex items-center sm:mb-12"
                    component={Link}
                    role="button"
                    to="/users/acheteurs"
                    color="inherit"
                  >
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Retour
                  </Typography>
                </FuseAnimate>
                <div className="flex items-center max-w-full">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    {form.avatar ? (
                      <Avatar
                        className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                        alt="user photo"
                        src={URL_SITE + form.avatar.url}
                      />
                    ) : (
                      <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded">
                        {form.firstName[0]}
                      </Avatar>
                    )}
                  </FuseAnimate>
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        {form.firstName && form.lastName
                          ? form.firstName + " " + form.lastName
                          : "NOM & Prénom"}
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">
                        {form.societe ? form.societe : "Société"}{" "}
                        {form.email ? " | " + form.email : ""}
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                {acheteur.data && acheteur.data.isactif ? (
                  <Button
                    className="whitespace-no-wrap"
                    variant="contained"
                    color="secondary"
                    disabled={acheteur.loading}
                    onClick={() => dispatch(Actions.etatAcheteur(form, false))}
                  >
                    Mettre ce compte invalide
                    {acheteur.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    className="whitespace-no-wrap"
                    variant="contained"
                    color="secondary"
                    disabled={acheteur.loading}
                    onClick={() => dispatch(Actions.etatAcheteur(form, true))}
                  >
                    Mettre ce compte valide
                    {acheteur.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                )}
              </FuseAnimate>
            </div>
          )
        ) : (
          <LinearProgress color="secondary" />
        )
      }
      contentToolbar={
        !acheteur.requestAcheteur ? (
          form && (
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64" }}
            >
              <Tab className="h-64 normal-case" label="Infos société" />
              <Tab className="h-64 normal-case" label="Infos utilisateur" />
              <Tab className="h-64 normal-case" label="Photo" />
            </Tabs>
          )
        ) : (
          <div className={classes.root}>
            <LinearProgress color="secondary" />
          </div>
        )
      }
      content={
        !acheteur.requestAcheteur
          ? form && (
            <div className=" sm:p-10 max-w-2xl">
              {tabValue === 0 && (
                <Formsy
                  onValidSubmit={handleSubmitInfoSociete}
                  onValid={enableButton}
                  onInvalid={disableButton}
                  ref={formRef}
                  className="flex pt-5 flex-col "
                >
                  <Grid container spacing={3} className="mb-5">
                    <Grid item xs={12} sm={8}>
                      <div className="flex">
                        <TextFieldFormsy
                          className=""
                          label="Raison sociale"
                          autoFocus
                          id="societe"
                          name="societe"
                          value={form.societe}
                          onChange={handleChange}
                          variant="outlined"
                          validations={{
                            matchRegexp: /^[a-z]|([a-z][0-9])|([0-9][a-z])|([a-z][0-9][a-z])+$/i,
                            minLength: 2,
                            maxLength: 40,
                          }}
                          validationErrors={{
                            minLength:
                              "Raison sociale doit dépasser 2 caractères alphanumériques",
                            maxLength:
                              "Raison sociale ne peut dépasser 40 caractères alphanumériques",
                            matchRegexp:
                              "Raison sociale doit contenir des caractères alphanumériques",
                          }}
                          required
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className="flex">
                        <TextFieldFormsy
                          className=""
                          type="text"
                          name="fix"
                          value={form.fix}
                          onChange={handleChange}
                          label="Fixe"
                          autoComplete="fix"
                          validations={{
                            minLength: 10,
                            maxLength: 13,
                          }}
                          validationErrors={{
                            minLength:
                              "La longueur minimale de caractère est 10",
                            maxLength:
                              "La longueur maximale de caractère est 13",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className="text-20" color="action">
                                  local_phone
                                </Icon>
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <SelectReactFormsy
                        id="secteur"
                        className=""
                        name="secteur"
                        value={secteur}
                        placeholder="Sélectionner votre secteur d'activité"
                        textFieldProps={{
                          label: "Secteur d'activité",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        options={acheteur.secteurs}
                        onChange={(value) =>
                          handleChipChange(value, "secteur")
                        }
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className="flex">
                        <TextFieldFormsy
                          className=""
                          type="text"
                          name="website"
                          value={form.website}
                          onChange={handleChange}
                          autoComplete="website"
                          label="Site Web"
                          validations="isUrl"
                          validationErrors={{
                            isUrl: "Exemple : http://www.exemple.com",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className="text-20" color="action">
                                  language
                                </Icon>
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                          variant="outlined"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <div className="flex">
                        {showIce ? (
                          <TextFieldFormsy
                            className=""
                            type="text"
                            name="ice"
                            value={form.ice}
                            onChange={handleChange}
                            label="ICE"
                            autoComplete="ice"
                            validations={{
                              minLength: 15,
                              maxLength: 15,
                              isNumeric: "isNumeric",
                              matchRegexp: /^(?!.*?(\w)\1{5}).*$/,
                            }}
                            validationErrors={{
                              minLength:
                                "La longueur minimale de caractère est 15",
                              maxLength:
                                "La longueur maximale de caractère est 15",
                              isNumeric: "Cette valeur doit être numérique. ",
                              matchRegexp: "ICE non valid. ",
                            }}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </Grid>
                  </Grid>
                  <Divider />

                  <Grid container spacing={3} className="mb-5">
                    <Grid item xs={12} sm={8}>
                      <div className="flex">
                        <TextFieldFormsy
                          className="mt-20"
                          type="text"
                          name="adresse1"
                          value={form.adresse1}
                          onChange={handleChange}
                          autoComplete="adresse"
                          label="Adresse 1"
                          validations={{
                            minLength: 10,
                          }}
                          validationErrors={{
                            minLength:
                              "La longueur minimale de caractère est 10",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className="text-20" color="action">
                                  location_on
                                </Icon>
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SelectReactFormsy
                        id="pays"
                        name="pays"
                        value={pays}
                        placeholder="Sélectionner une Pays"
                        textFieldProps={{
                          label: "Pays",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        className="mt-20"
                        options={Pays}
                        onChange={(value) => handleChipChange(value, "pays")}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className="flex">
                        <TextFieldFormsy
                          className=""
                          type="text"
                          name="adresse2"
                          value={form.adresse2}
                          onChange={handleChange}
                          autoComplete="adresse"
                          label="Adresse 2"
                          validations={{
                            minLength: 10,
                          }}
                          validationErrors={{
                            minLength:
                              "La longueur minimale de caractère est 10",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className="text-20" color="action">
                                  location_on
                                </Icon>
                              </InputAdornment>
                            ),
                          }}
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <div className="flex">
                        <TextFieldFormsy
                          className=""
                          type="number"
                          name="codepostal"
                          value={String(form.codepostal)}
                          onChange={handleChange}
                          autoComplete="codepostal"
                          label="Code Postal"
                          variant="outlined"
                          fullWidth
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <SelectReactFormsy
                        id="ville"
                        name="ville"
                        value={ville}
                        placeholder="Sélectionner une ville"
                        textFieldProps={{
                          label: "Ville",
                          InputLabelProps: {
                            shrink: true,
                          },
                          variant: "outlined",
                        }}
                        className=""
                        options={Villes}
                        onChange={(value) => handleChipChange(value, "ville")}
                        required
                      />

                      {(ville.label === "Autre" ||
                        ville.label === "autre") && (
                          <TextFieldFormsy
                            className="mb-5 mt-20  w-full"
                            type="text"
                            name="autreVille"
                            onChange={handleChange}
                            value={form.autreVille}
                            label="Autre ville"
                            InputProps={{
                              endAdornment: acheteur.loadingAddVille ? (
                                <CircularProgress color="secondary" />
                              ) : (
                                <InputAdornment position="end">
                                  <IconButton
                                    color="secondary"
                                    disabled={!form.autreVille}
                                    onClick={(ev) =>
                                      dispatch(
                                        Actions.addVille(
                                          form.autreVille,
                                          form.pays.id,
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
                          />
                        )}
                    </Grid>
                  </Grid>
                  <Divider />

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                      <TextFieldFormsy
                        className="mb-5 mt-20  w-full"
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        label="Présentation"
                        autoComplete="description"
                        validations={{
                          minLength: 10,
                        }}
                        validationErrors={{
                          minLength:
                            "La longueur minimale de caractère est 10",
                        }}
                        variant="outlined"
                        multiline
                        rows="8"
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-200 pr-auto mt-16 normal-case"
                    aria-label="Sauvegarder"
                    disabled={!isFormValid || acheteur.loading}
                    value="legacy"
                  >
                    Sauvegarder
                    {acheteur.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                </Formsy>
              )}
              {tabValue === 1 && (
                <Formsy
                  onValidSubmit={handleSubmitInfoPerso}
                  onValid={enableButton}
                  onInvalid={disableButton}
                  ref={formRef}
                  className="flex pt-5 flex-col "
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}>
                      <SelectFormsy
                        className="mb-16"
                        name="civilite"
                        label="Civilité"
                        onChange={handleChange}
                        value={form.civilite}
                        variant="outlined"
                        required
                        fullWidth
                      >
                        <MenuItem value="M.">M.</MenuItem>
                        <MenuItem value="Mme">Mme</MenuItem>
                        <MenuItem value="Mlle">Mlle</MenuItem>
                      </SelectFormsy>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        label="Nom"
                        validations={{
                          minLength: 4,
                        }}
                        validationErrors={{
                          minLength:
                            "La longueur minimale de caractère est 4",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                person
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextFieldFormsy
                        className="mb-16"
                        value={form.firstName}
                        onChange={handleChange}
                        type="text"
                        name="firstName"
                        label="Prénom"
                        validations={{
                          minLength: 4,
                        }}
                        validationErrors={{
                          minLength:
                            "La longueur minimale de caractère est 4",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                person
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Divider />

                  <Grid container spacing={3} className="mt-5">
                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        className="mb-16"
                        type="text"
                        name="email"
                        value={form.email}
                        label="Email"
                        variant="outlined"
                        disabled
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextFieldFormsy
                        className="mb-16"
                        value={form.phone}
                        onChange={handleChange}
                        type="text"
                        name="phone"
                        label="Téléphone"
                        validations={{
                          minLength: 10,
                          maxLength: 13,
                        }}
                        validationErrors={{
                          minLength:
                            "La longueur minimale de caractère est 10",
                          maxLength:
                            "La longueur maximale de caractère est 13",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                local_phone
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-200 pr-auto mt-16 normal-case"
                    aria-label="Sauvegarder"
                    disabled={!isFormValid || acheteur.loading}
                    value="legacy"
                  >
                    Sauvegarder
                    {acheteur.loading && (
                      <CircularProgress
                        size={24}
                        className={classes.buttonProgress}
                      />
                    )}
                  </Button>
                </Formsy>
              )}
              {tabValue === 2 && (
                <div>
                  <input
                    accept="image/jpeg,image/gif,image/png"
                    className="hidden"
                    id="button-file"
                    type="file"
                    disabled={acheteur.acheteurReqInProgress}
                    onChange={handleUploadChange}
                  />
                  <div className="flex justify-center sm:justify-start flex-wrap">
                    <label
                      htmlFor="button-file"
                      className={clsx(
                        classes.acheteurImageUpload,
                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                      )}
                    >
                      {acheteur.acheteurReqInProgress ? (
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

                    <div
                      className={clsx(
                        classes.acheteurImageItem,
                        "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5"
                      )}
                      onClick={
                        form.avatar
                          ? () =>
                            window.open(
                              URL_SITE + form.avatar.url,
                              "_blank"
                            )
                          : ""
                      }
                    >
                      {form.avatar ? (
                        <img
                          className="max-w-none w-auto h-full"
                          src={URL_SITE + form.avatar.url}
                          alt={form.societe}
                        />
                      ) : (
                        <img
                          className="max-w-none w-auto h-full"
                          src="assets/images/avatars/profile.jpg"
                          alt={form.societe}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
          : ""
      }
      innerScroll
    />
  );
}

export default withReducer("acheteurApp", reducer)(Acheteur);
