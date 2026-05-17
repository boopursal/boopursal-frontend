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
import * as Actions from './store/actions';
import reducer from './store/reducers';
import withReducer from 'app/store/withReducer';
import { showMessage } from 'app/store/actions/fuse';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
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
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 p-24 md:flex-row md:p-0")}>

            <Helmet>
                <title>Réinitialiser votre mot de passe | Les Achats Industriels</title>
                <meta name="description" content="Modifier ou réinitialiser votre mot de passe" />
            </Helmet>
            <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">

                <FuseAnimate animation="transition.expandIn">
                    <img className="w-128 mb-32" src="/assets/images/logos/icon.png" alt="logo" />
                </FuseAnimate>

                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                    <Typography variant="h3" color="inherit" className="font-light">
                        LES ACHATS INDUSTRIELS
                    </Typography>
                </FuseAnimate>

                <FuseAnimate delay={400}>
                    <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
                        LA PLACE DE MARCHE B TO B N° 1 AU MAROC, DES ACHETEURS ET FOURNISSEURS AVERTIS.
                    </Typography>
                </FuseAnimate>
            </div>

            <FuseAnimate animation={{ translateX: [0, '100%'] }}>

                <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>

                    <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">

                        <Typography variant="h6" className="md:w-full mb-32 text-center">RÉINITIALISER VOTRE MOT DE PASSE</Typography>

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
                                label="Mot de passe"
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
                                className="mb-16"
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
                                className="w-full mx-auto mt-16 normal-case"
                                aria-label="LOG IN"
                                disabled={!isFormValid || resetpassword.loading}
                                value="legacy"
                            >
                                RÉINITIALISER
                                {resetpassword.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Button>

                        </Formsy>
                        <div className="flex flex-col items-center justify-center pt-32">

                            <Link className="font-medium text-blue" to="/login">Revenir à la page de connexion</Link>
                            <Link className="font-medium mt-8 flex items-end text-blue" to="/"><Icon className="mr-4">home</Icon> <span>Accueil</span></Link>
                        </div>

                        <div className="flex flex-col items-center justify-center pt-32 pb-24">
                        </div>

                    </CardContent>
                </Card>
            </FuseAnimate>
        </div>
    );
}

export default withReducer('resetpassword', reducer)(ResetPassword);
