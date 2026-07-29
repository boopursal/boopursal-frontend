import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, CardContent, Typography, Icon, InputAdornment, CircularProgress, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate, TextFieldFormsy } from '@fuse';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import Formsy from 'formsy-react';
import { useDispatch, useSelector } from 'react-redux';
import LanguageSwitcher from 'app/fuse-layouts/shared-components/LanguageSwitcher';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import withReducer from 'app/store/withReducer';
import { showMessage } from 'app/store/actions/fuse';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
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
        '&:hover': {
            color: '#64748b'
        }
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
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

function ResetPassword(props) {
    const dispatch = useDispatch();
    const resetpassword = useSelector(({ resetpassword }) => resetpassword.resetpassword);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const classes = useStyles();
    const params = props.match.params;
    const { token } = params;
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
        if (resetpassword.error && (resetpassword.error.password)) {
            formRef.current.updateInputsWithError({
                ...resetpassword.error
            });

            disableButton();
        }
        if (resetpassword.error && (resetpassword.error.Erreur)) {
            dispatch(
                showMessage({
                    message: 'Token invalide',//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }));
            disableButton();
        }

    }, [resetpassword.error]);
    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(Actions.resetPassword(model, token, props.history));
        disableButton();
    }

    return (
        <div className={classes.root}>
            <Helmet>
                <title>Réinitialiser votre mot de passe | Boopursal</title>
                <meta name="description" content="Modifier ou réinitialiser votre mot de passe" />
            </Helmet>

            <div className={classes.backgroundArt} />

            <FuseAnimate animation="transition.slideUpIn" delay={100}>
                <div className={classes.megaCard}>
                    <div className={classes.loginPane}>
                        <img className={classes.logo} src="/assets/images/logos/icon.png" alt="Boopursal" />
                        <Typography className={classes.title}>Nouveau mot de passe</Typography>
                        <Typography className={classes.subtitle}>
                            Veuillez définir votre nouveau mot de passe pour accéder à votre compte.
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
                                name="password"
                                type={values.showPassword ? 'text' : 'password'}
                                label="Nouveau mot de passe"
                                validations={{
                                    minLength: 6,
                                    matchRegexp: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/
                                }}
                                validationErrors={{
                                    minLength: 'La longueur minimale des caractères est de 6',
                                    matchRegexp: 'Le mot de passe doit être de 6 caractères minimum et contenir un lettre majuscules et des lettres minuscules et au moins un chiffre'
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                                variant="outlined"
                                required
                            />

                            <TextFieldFormsy
                                className="mb-24"
                                type={values.showPassword ? 'text' : 'password'}
                                name="confirmpassword"
                                label="Confirmer le mot de passe"
                                validations="equalsField:password"
                                validationErrors={{
                                    equalsField: 'les mots de passe saisis ne sont pas identiques'
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
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
                                aria-label="RÉINITIALISER"
                                disabled={!isFormValid || resetpassword.loading}
                            >
                                Enregistrer le mot de passe
                                {resetpassword.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Button>
                        </Formsy>

                        <div className="flex items-center justify-between mt-16">
                            <Link to="/login" className={classes.footerLink}>
                                <Icon className="text-16 mr-8">keyboard_backspace</Icon>
                                Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}

export default withReducer('resetpassword', reducer)(ResetPassword);
