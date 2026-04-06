import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Tab,
  Tabs,
  InputAdornment,
  Icon,
  Typography,
  LinearProgress,
  Grid,
  CircularProgress,
  Divider,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/styles";
import {
  FuseAnimate,
  FusePageCarded,
  TextFieldFormsy,
  CheckboxFormsy,
} from "@fuse";
import { useForm } from "@fuse/hooks";
import { Link } from "react-router-dom";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import Formsy from "formsy-react";
import green from "@material-ui/core/colors/green";

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
  contactFournisseurImageFeaturedStar: {
    position: "absolute",
    top: 0,
    right: 0,
    color: red[400],
    opacity: 0,
  },
  contactFournisseurImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  select: {
    zIndex: 999,
  },
  contactFournisseurImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    "&:hover": {
      "& $contactFournisseurImageFeaturedStar": {
        opacity: 0.8,
      },
    },
    "&.featured": {
      pointerEvents: "none",
      boxShadow: theme.shadows[3],
      "& $contactFournisseurImageFeaturedStar": {
        opacity: 1,
      },
      "&:hover $contactFournisseurImageFeaturedStar": {
        opacity: 1,
      },
    },
  },
}));

function ContactFournisseur(props) {
  const dispatch = useDispatch();
  const contactFournisseur = useSelector(
    ({ contactsFournisseurApp }) => contactsFournisseurApp.contactFournisseur
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const { form, handleChange, setForm } = useForm();
  const classes = useStyles(props);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (
      contactFournisseur.error &&
      (contactFournisseur.error.statut ||
        contactFournisseur.error.email ||
        contactFournisseur.error.message ||
        contactFournisseur.error.contact ||
        contactFournisseur.error.phone)
    ) {
      formRef.current.updateInputsWithError({
        ...contactFournisseur.error,
      });
      disableButton();
      return () => {
        dispatch(Actions.cleanError());
      };
    }
  }, [dispatch, contactFournisseur.error]);

  useEffect(() => {
    function updateMessageState() {
      const params = props.match.params;
      const { messageId } = params;
      dispatch(Actions.getMessage(messageId));
    }

    updateMessageState();
  }, [dispatch, props.match.params]);

  useEffect(() => {
    if (
      (contactFournisseur.data && !form) ||
      (contactFournisseur.data &&
        form &&
        contactFournisseur.data.id !== form.id)
    ) {
      setForm({ ...contactFournisseur.data });
    }
  }, [form, contactFournisseur.data, setForm]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  function handleCheckBoxChange(e, name) {
    setForm(_.set({ ...form }, name, e.target.checked));
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit() {
    dispatch(Actions.putMessage(form, form.id, props.history));
  }

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        !contactFournisseur.loading
          ? form && (
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography
                    className="normal-case flex items-center sm:mb-12"
                    component={Link}
                    role="button"
                    to="/contact_fournisseur"
                    color="inherit"
                  >
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Retour
                  </Typography>
                </FuseAnimate>

                <div className="flex items-center max-w-full">
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate
                      animation="transition.slideLeftIn"
                      delay={300}
                    >
                      <Typography className="text-16 sm:text-20 truncate">
                        {form.fournisseur
                          ? "Message pour le fournisseur: " +
                          form.fournisseur.societe
                          : ""}
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate
                      animation="transition.slideLeftIn"
                      delay={300}
                    >
                      <Typography variant="caption">
                        Détails du message{" "}
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
              <FuseAnimate animation="transition.slideRightIn" delay={300}>
                <Button
                  className="whitespace-no-wrap"
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={!isFormValid || contactFournisseur.loading}
                  onClick={() => handleSubmit()}
                >
                  Sauvegarder
                  {contactFournisseur.loading && (
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
        contactFournisseur.loading ? (
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
            <Tab
              className="h-64 normal-case"
              label="Détails de la demande de devis"
            />
          </Tabs>
        )
      }
      content={
        !contactFournisseur.loading
          ? form && (
            <div className="p-10  sm:p-24 max-w-2xl">
              {tabValue === 0 && (
                <Formsy
                  onValidSubmit={handleSubmit}
                  onValid={enableButton}
                  onInvalid={disableButton}
                  ref={formRef}
                  className="flex pt-10 flex-col "
                >
                  {/* Information produit & fournisseur*/}
                  <Grid container spacing={3} className="mb-5">
                    <Grid item xs={12} sm={12}>
                      <TextFieldFormsy
                        label="Fournisseur"
                        id="fournisseur"
                        name="fournisseur"
                        value={
                          form.fournisseur ? form.fournisseur.societe : ""
                        }
                        variant="outlined"
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>

                  <Divider />

                  {/* Information contactFournisseurur*/}

                  <Grid container spacing={3} className="mt-5 mb-5">
                    <Grid item xs={12} sm={4}>
                      <TextFieldFormsy
                        type="text"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        label="NOM & Prénom"
                        disabled
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                person
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextFieldFormsy
                        type="text"
                        name="email"
                        label="Email"
                        value={form.email}
                        onChange={handleChange}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                email
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        disabled
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextFieldFormsy
                        className="mb-16"
                        value={form.phone}
                        onChange={handleChange}
                        type="text"
                        name="phone"
                        label="Téléphone"
                        disabled
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className="text-20" color="action">
                                local_phone
                              </Icon>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <TextFieldFormsy
                    className="mb-16  w-full"
                    type="text"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    label="Message"
                    validations={{
                      minLength: 10,
                    }}
                    validationErrors={{
                      minLength: "La longueur minimale de caractère est 10",
                    }}
                    variant="outlined"
                    multiline
                    rows="4"
                    required
                  />

                  <Grid container spacing={3} className="flex items-center">
                    <Grid item xs={12} sm={12} className="flex items-center">
                      <CheckboxFormsy
                        name="statut"
                        onChange={(e) => handleCheckBoxChange(e, "statut")}
                        label="Valider et alerter le fournisseur"
                        value={form.statut}
                      />
                      <Button
                        className="ml-4"
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={!isFormValid || contactFournisseur.loading}
                        onClick={() => handleSubmit()}
                      >
                        Sauvegarder
                        {contactFournisseur.loading && (
                          <CircularProgress
                            size={24}
                            className={classes.buttonProgress}
                          />
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Formsy>
              )}
            </div>
          )
          : ""
      }
      innerScroll
    />
  );
}

export default withReducer(
  "contactsFournisseurApp",
  reducer
)(ContactFournisseur);
