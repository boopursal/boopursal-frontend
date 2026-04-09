import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  InputAdornment,
  Icon,
  Grid,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  DialogActions,
} from "@material-ui/core";
import { TextFieldFormsy, SelectFormsy } from "@fuse";
import Formsy from "formsy-react";
import * as authActions from "app/auth/store/actions";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "@material-ui/core/Link";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function FournisseurTab(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const register = useSelector(({ auth }) => auth.register);
  const [recaptcha, setRecaptcha] = useState('desactive_temporairement'); // TODO: Remettre à null quand le domaine sera validé
  const [open, setOpen] = useState(false);
  const [parentErreur, setParentErreur] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const [values, setValues] = useState({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (
      register.error &&
      (register.error.civilite ||
        register.error.firstName ||
        register.error.lastName ||
        register.error.societe ||
        register.error.phone ||
        register.error.email ||
        register.error.password ||
        register.error.confirmpassword)
    ) {
      formRef.current.updateInputsWithError({
        ...register.error,
      });
      disableButton();
    }
    if (register.error && register.error.Erreur) {
      if (register.error.Erreur.includes("existe déjà")) {
        setParentErreur(register.error.Erreur);
        setOpen(true);
        disableButton();
      }
    }
    return () => {
      dispatch(authActions.cleanUpErrors());
    };
  }, [dispatch, register.error]);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit(model) {
    dispatch(authActions.submitRegisterFournisseur(model, props.history));
  }

  function onChange(value) {
    if (value && value.trim().length > 0) setRecaptcha(value);
    else setRecaptcha(null);
  }
  return (
    <div className="w-full">
      <Helmet>
        <title>Inscription Fournisseur | Boopursal</title>
        <meta
          name="description"
          content="L'inscription sur notre site est gratuite ainsi que la réception des demandes de prix.
Afin de recevoir le maximum d'alertes, veuillez choisir le maximum de produits pour lesquelles vous souhaitez recevoir de demandes."
        />
      </Helmet>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-parent-existe"
      >
        <DialogTitle id="dialog-parent-existe" className="uppercase">
          inscription mise en attente{" "}
        </DialogTitle>
        <DialogContent className="mb-12 font-600">
          {parentErreur
            ? parentErreur
            : "Une erreur est survenue veuillez réessayer plus tard."}
          <p className="mt-16">
            {parentErreur &&
              "Si ce compte ne vous appartient pas, merci de nous contacter sur l'adresse mail suivante: adherent@boopursal.com"}
          </p>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        className="flex flex-col justify-center w-full"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={2}>
            <SelectFormsy
              className="mb-16"
              name="civilite"
              label="Civilité"
              value="M."
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
              fullWidth
              type="text"
              name="lastName"
              label="Nom"
              validations={{
                maxLength: 100,
                minLength: 2,
              }}
              validationErrors={{
                maxLength: "La longueur maximale de caractère est 100",
                minLength: "La longueur minimale de caractère est 2",
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
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextFieldFormsy
              className="mb-16"
              fullWidth
              type="text"
              name="firstName"
              label="Prénom"
              validations={{
                maxLength: 100,
                minLength: 2,
              }}
              validationErrors={{
                maxLength: "La longueur maximale de caractère est 100",
                minLength: "La longueur minimale de caractère est 2",
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
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextFieldFormsy
              className="mb-16"
              type="text"
              name="societe"
              label="Raison sociale"
              validations={{
                matchRegexp: /^[a-z]|([a-z][0-9])|([0-9][a-z])|([a-z][0-9][a-z])+$/i,
                minLength: 2,
                maxLength: 20,
              }}
              validationErrors={{
                minLength:
                  "Raison sociale doit dépasser 2 caractères alphanumériques",
                maxLength:
                  "Raison sociale ne peut dépasser 20 caractères alphanumériques",
                matchRegexp:
                  "Raison sociale doit contenir des caractères alphanumériques",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      work_outline
                    </Icon>
                  </InputAdornment>
                ),
              }}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextFieldFormsy
              className="mb-16"
              type="text"
              name="email"
              label="Email"
              validations="isEmail"
              validationErrors={{
                isEmail: "Veuillez saisir un e-mail valide",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      email
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextFieldFormsy
              className="mb-16"
              type="text"
              name="phone"
              label="Téléphone"
              validations={{
                minLength: 10,
                maxLength: 20,
              }}
              validationErrors={{
                minLength: "La longueur minimale de caractère est 10",
                maxLength: "La longueur maximale de caractère est 20",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      phone
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextFieldFormsy
              className="mb-16"
              type={values.showPassword ? "text" : "password"}
              name="password"
              label="Mot de passe"
              validations={{
                minLength: 6,
                matchRegexp: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/,
              }}
              validationErrors={{
                minLength: "La longueur minimale des caractères est de 6",
                matchRegexp:
                  "Le mot de passe doit être de 6 caractères minimum et contenir un lettre majuscules et des lettres minuscules et au moins un chiffre",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextFieldFormsy
              className="mb-16"
              type={values.showPassword ? "text" : "password"}
              name="confirmpassword"
              label="Confirmer le mot de passe"
              validations="equalsField:password"
              validationErrors={{
                equalsField: "les mots de passe saisis ne sont pas identiques",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
              fullWidth
            />
          </Grid>
        </Grid>
        {/* <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6LcimHwqAAAAAJgTB0sktkfNzYXWJFDndJIXOC_N"
            onChange={onChange}
          />
        </div> */}
        <p className="mt-16">
          En appuyant sur le bouton{" "}
          <span className="font-bold">"Enregistrer"</span>, vous acceptez les{" "}
          <Link href="/conditions" target="_blank" rel="noreferrer noopener">
            Conditions d'utilisation
          </Link>{" "}
          Politique de protection des données
        </p>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16 normal-case"
          aria-label="REGISTER"
          disabled={!isFormValid || !recaptcha || register.loading}
          value="legacy"
        >
          Enregistrer
          {register.loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </Formsy>
    </div>
  );
}

export default FournisseurTab;
