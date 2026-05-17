import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Icon,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { FuseAnimate, TextFieldFormsy } from "@fuse";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Formsy from "formsy-react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import withReducer from "app/store/withReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      darken(theme.palette.primary.dark, 0.5) +
      " 100%)",
    color: theme.palette.primary.contrastText,
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function ForgotPasswordPage(props) {
  const dispatch = useDispatch();
  const forgotpassword = useSelector(
    ({ forgotpassword }) => forgotpassword.forgotpassword
  );

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const classes = useStyles();
  useEffect(() => {
    if (
      forgotpassword.error &&
      (forgotpassword.error.email || forgotpassword.error.Erreur)
    ) {
      formRef.current.updateInputsWithError({
        email: forgotpassword.error.email
          ? forgotpassword.error.email
          : "Adresse email incorrecte ou inexistante",
      });

      disableButton();
    }
  }, [forgotpassword.error]);
  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    dispatch(Actions.forgotPassword(model, props.history));
    disableButton();
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0"
      )}
    >
      <Helmet>
        <title>Mot de passe oublié | Les Achats Industriels</title>
        <meta
          name="description"
          content="Modifier ou réinitialiser votre mot de passe"
        />
      </Helmet>
      <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
        <FuseAnimate animation="transition.expandIn">
          <img
            className="w-128 mb-32"
            src="/assets/images/logos/icon.png"
            alt="logo"
          />
        </FuseAnimate>

        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <Typography variant="h3" color="inherit" className="font-light">
            LES ACHATS INDUSTRIELS
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={400}>
          <Typography
            variant="subtitle1"
            color="inherit"
            className="max-w-512 mt-16"
          >
            LA PLACE DE MARCHE B TO B N° 1 AU MAROC, DES ACHETEURS ET
            FOURNISSEURS AVERTIS.
          </Typography>
        </FuseAnimate>
      </div>

      <FuseAnimate animation={{ translateX: [0, "100%"] }}>
        <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
          <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
            <Typography variant="h6" className="md:w-full mb-32 text-center">
              RECUPEREZ VOTRE MOT DE PASSE
            </Typography>

            <Formsy
              onValidSubmit={handleSubmit}
              onValid={enableButton}
              onInvalid={disableButton}
              ref={formRef}
              className="flex flex-col justify-center w-full"
            >
              <TextFieldFormsy
                className="mb-16"
                type="email"
                name="email"
                label="Email"
                validations="isEmail"
                validationErrors={{
                  isEmail: "L'adresse email n'est pas valide",
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
              />

              <Button
                type="submit"
                variant="contained"
                name="submit"
                color="primary"
                className="w-full mx-auto mt-16 normal-case"
                aria-label="LOG IN"
                disabled={!isFormValid || forgotpassword.loading}
                value="legacy"
              >
                RÉINITIALISER
                {forgotpassword.loading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
              </Button>
            </Formsy>
            <div className="flex flex-col items-center justify-center pt-32">
              <Link className="font-medium" to="/login">
                Revenir à la page de connexion
              </Link>
              <Link className="font-medium mt-8 flex items-end" to="/">
                <Icon className="mr-4">home</Icon> <span>Accueil</span>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center pt-32 pb-24"></div>
          </CardContent>
        </Card>
      </FuseAnimate>
    </div>
  );
}

export default withReducer("forgotpassword", reducer)(ForgotPasswordPage);
