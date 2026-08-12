import React, { useEffect, useRef, useState } from 'react';
import { Button, InputAdornment, Icon, Grid, MenuItem, IconButton } from '@material-ui/core';
import { TextFieldFormsy, SelectFormsy } from '@fuse';
import Formsy from 'formsy-react';
import * as authActions from 'app/auth/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from 'app/store/actions';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Link from '@material-ui/core/Link';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Helmet } from "react-helmet";
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from "react-google-recaptcha";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        alignItems: 'center',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function AcheteurTab(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const register = useSelector(({ auth }) => auth.register);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const [values, setValues] = useState({
        showPassword: false,
    });
    const [captchaValid, setCaptchaValid] = useState(false);

    const onCaptchaChange = (value) => {
        setCaptchaValid(!!value);
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    useEffect(() => {
        if (register.error && (register.error.civilite || register.error.firstName || register.error.lastName || register.error.societe || register.error.phone || register.error.email || register.error.password || register.error.confirmpassword)) {
            formRef.current.updateInputsWithError({
                ...register.error
            });
            disableButton();
        }
        else if (register.error && register.error.Erreur) {
            dispatch(
                Actions.showMessage({
                    message: register.error.Erreur,//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }));
        }

    }, [register.error]);


    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        dispatch(authActions.submitRegisterAcheteur(model, props.history));
    }

    return (


        <div className="w-full">
            <Helmet>
                <title>Inscription Acheteur | Boopursal</title>
                <meta name="description" content="Inscrivez-vous en tant qu'ACHETEUR. Vous pouvez vous inscrire en même temps en tant que FOURNISSEUR, dans ce cas vous devez vous déconnecter et vous inscrire en cliquant sur le lien FOURNISSEUR." />
            </Helmet>
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
                            label={t('register.civility', 'Civilité')}
                            value="M."
                            variant="outlined"
                            required

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
                            label={t('register.lastName', 'Nom')}
                            validations={{
                                minLength: 2,
                                maxLength: 100,

                            }}
                            fullWidth
                            validationErrors={{
                                maxLength: t('register.maxLength100', 'La longueur maximale de caractère est 100'),
                                minLength: t('register.minLength2', 'La longueur minimale de caractère est 2'),
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
                            }}
                            variant="outlined"
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                        <TextFieldFormsy
                            className="mb-16"
                            type="text"
                            name="firstName"
                            label={t('register.firstName', 'Prénom')}
                            validations={{
                                minLength: 2,
                                maxLength: 100
                            }}
                            fullWidth
                            validationErrors={{
                                minLength: t('register.minLength2', 'La longueur minimale de caractère est 2'),
                                maxLength: t('register.maxLength100', 'La longueur maximale de caractère est 100'),
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
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
                            label={t('register.companyName', 'Raison sociale')}
                            validations={{
                                matchRegexp: /^[a-z]|([a-z][0-9])|([0-9][a-z])|([a-z][0-9][a-z])+$/i,
                                minLength: 2,
                                maxLength: 20
                            }}
                            validationErrors={{
                                minLength: t('register.companyMin', 'Raison sociale doit dépasser 2 caractères alphanumériques'),
                                maxLength: t('register.companyMax', 'Raison sociale ne peut dépasser 20 caractères alphanumériques'),
                                matchRegexp: t('register.companyAlpha', 'Raison sociale doit contenir des caractères alphanumériques')
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">work_outline</Icon></InputAdornment>
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
                            name="email"
                            label={t('register.email', 'Email')}
                            validations="isEmail"
                            validationErrors={{
                                isEmail: t('register.emailInvalid', 'Veuillez saisir un e-mail valide')
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>
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
                            label={t('register.phone', 'Téléphone')}
                            validations={{
                                minLength: 10,
                                maxLength: 20,
                            }}
                            validationErrors={{
                                minLength: t('register.minLength10', 'La longueur minimale de caractère est 10'),
                                maxLength: t('register.maxLength20', 'La longueur maximale de caractère est 20')
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">phone</Icon></InputAdornment>
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
                            name="password"
                            label={t('register.password', 'Mot de passe')}
                            type={values.showPassword ? 'text' : 'password'}
                            validations={{
                                minLength: 6,
                                matchRegexp: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/
                            }}
                            validationErrors={{
                                minLength: t('register.passwordMinLength', 'La longueur minimale des caractères est de 6'),
                                matchRegexp: t('register.passwordStrength', 'Le mot de passe doit contenir au moins 6 caractères, une majuscule, une minuscule et un chiffre')
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
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextFieldFormsy
                            className="mb-16"
                            type={values.showPassword ? 'text' : 'password'}
                            name="confirmpassword"
                            label={t('register.confirmPassword', 'Confirmer le mot de passe')}
                            validations="equalsField:password"
                            validationErrors={{
                                equalsField: t('register.passwordMismatch', 'Les mots de passe saisis ne sont pas identiques')
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
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <div className="flex justify-center mt-16">
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LdSWIAtAAAAAMhfBiaaEsve64dWwdBEzOkf5gDr"}
                        onChange={onCaptchaChange}
                    />
                </div>
                <p className="mt-16">
                    {t('register.legalPre', 'En appuyant sur le bouton')} <span className="font-bold">"{t('register.submitBtn', 'Enregistrer')}"</span>, {t('register.legalAccept', 'vous acceptez les')} <Link href='/conditions' target="_blank" rel="noreferrer noopener">{t('register.termsLink', "Conditions d'utilisation")}</Link> {t('register.legalPrivacy', 'Politique de protection des données')}
                </p>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16 normal-case"
                    aria-label="REGISTER"
                    disabled={!isFormValid || register.loading || !captchaValid}
                    value="legacy"
                >
                    {t('register.submitBtn', 'Enregistrer')}
                    {register.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>

            </Formsy>

        </div>



    );
}

export default AcheteurTab;
