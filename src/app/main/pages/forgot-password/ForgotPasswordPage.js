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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from 'app/fuse-layouts/shared-components/LanguageSwitcher';
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import withReducer from "app/store/withReducer";

const useStyles = makeStyles((theme) => ({
    root: {
        background: '#ffffff',
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(8, 4),
        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(4, 2),
        },
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },
    backgroundArt: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 1,
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
    },
    megaCard: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 500,
        backgroundColor: '#ffffff',
        borderRadius: 40,
        boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        border: '1px solid #e2e8f0',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            borderRadius: 24,
            maxWidth: 480
        }
    },
    loginPane: {
        flex: 1,
        padding: theme.spacing(8),
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(6),
        },
        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(4),
        }
    },
    logo: {
        height: 60,
        width: 'auto',
        marginBottom: 32,
    },
    title: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '2rem',
        fontWeight: 900,
        color: '#0f172a',
        marginBottom: 8,
        letterSpacing: '-0.04em',
    },
    subtitle: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '0.925rem',
        fontWeight: 400,
        color: '#64748b',
        lineHeight: 1.5,
        marginBottom: 48,
    },
    footerLink: {
        fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 800,
        color: '#94a3b8',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: 32,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginRight: 24,
        '&:hover': {
            color: '#64748b'
        }
    },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  submitBtn: {
      padding: '12px 24px',
      borderRadius: 12,
      fontWeight: 800,
      fontSize: '1rem',
      textTransform: 'none',
      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
  }
}));

function ForgotPasswordPage(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
    <div className={classes.root}>
      <Helmet>
        <title>{t('forgotPassword.pageTitle', 'Mot de passe oublié | Boopursal')}</title>
        <meta
          name="description"
          content={t('forgotPassword.pageDesc', 'Modifier ou réinitialiser votre mot de passe')}
        />
      </Helmet>
      
      <div className={classes.backgroundArt} />

      <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <div className={classes.megaCard}>
              <div className={classes.loginPane}>
                  <img className={classes.logo} src="/assets/images/logos/icon.png" alt="Boopursal" />
                  <Typography className={classes.title}>{t('forgotPassword.title', 'Mot de passe oublié ?')}</Typography>
                  <Typography className={classes.subtitle}>
                      {t('forgotPassword.subtitle', 'Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.')}
                  </Typography>

                  <Formsy
                      onValidSubmit={handleSubmit}
                      onValid={enableButton}
                      onInvalid={disableButton}
                      ref={formRef}
                      className="flex flex-col justify-center w-full"
                  >
                      <TextFieldFormsy
                          className="mb-24"
                          type="email"
                          name="email"
                          label={t('forgotPassword.emailLabel', 'Adresse e-mail')}
                          validations="isEmail"
                          validationErrors={{
                              isEmail: t('forgotPassword.emailInvalid', "L'adresse email n'est pas valide"),
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
                          className={clsx(classes.submitBtn, "w-full")}
                          aria-label={t('forgotPassword.submitBtn', 'Envoyer le lien')}
                          disabled={!isFormValid || forgotpassword.loading}
                      >
                          {t('forgotPassword.submitBtn', 'Envoyer le lien')}
                          {forgotpassword.loading && (
                              <CircularProgress
                                  size={24}
                                  className={classes.buttonProgress}
                              />
                          )}
                      </Button>
                  </Formsy>

                  <div className="flex items-center justify-between mt-16">
                      <Link to="/login" className={classes.footerLink}>
                          <Icon className="text-16 mr-8">keyboard_backspace</Icon>
                          {t('forgotPassword.backToLogin', 'Retour à la connexion')}
                      </Link>
                  </div>
              </div>
          </div>
      </FuseAnimate>
    </div>
  );
}

export default withReducer("forgotpassword", reducer)(ForgotPasswordPage);
