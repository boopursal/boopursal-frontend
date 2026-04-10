import React, { useState, useEffect, useRef } from 'react';
import { 
    Stepper, Step, StepLabel, Button, Typography, 
    Icon, CircularProgress, Grid, InputAdornment 
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse';
import SelectReactFormsy from '@fuse/components/formsy/SelectReactFormsy';
import { useForm } from '@fuse/hooks';
import * as Actions from '../inscription/steps/step2/store/actions';
import * as Step3Actions from '../inscription/steps/step3/store/actions';
import withReducer from 'app/store/withReducer';
import reducer from '../inscription/steps/step2/store/reducers';
import step3Reducer from '../inscription/steps/step3/store/reducers';
import { combineReducers } from 'redux';
import { Helmet } from "react-helmet";
import clsx from 'clsx';
import './ModernOnboarding.css';

const useStyles = makeStyles(theme => ({
    stepContent: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
}));

function SupplierOnboarding(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const user = useSelector(({ auth }) => auth.user);
    const pays = useSelector(({ onboardingApp }) => onboardingApp?.step2?.pays);
    const villes = useSelector(({ onboardingApp }) => onboardingApp?.step2?.villes);
    const currencies = useSelector(({ onboardingApp }) => onboardingApp?.step2?.currencies);
    const loading = useSelector(({ onboardingApp }) => onboardingApp?.step2?.loading);


    const [formState, setFormState] = useState({
        pays: null,
        ville: null,
        currency: null,
        ice: '',
    });

    const steps = ['Profil Société', 'Catalogue & Produits', 'Finalisation'];

    useEffect(() => {
        dispatch(Actions.getPays());
        dispatch(Actions.getCurrency());
    }, [dispatch]);

    const handleCountryChange = (val) => {
        if (val && val.value) {
            dispatch(Actions.getVilles(val.value));
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const submitStep1 = (model) => {
        // Normalisation pour le backend
        const data = {
            ...model,
            pays: model.pays?.value,
            ville: model.ville?.value,
            currency: model.currency?.value,
            redirect: '/onboarding/fournisseur', // Nouveau point de redirection
        };
        dispatch(Actions.setStep2(data, user.id, null));
        handleNext();
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Formsy onValidSubmit={submitStep1} className="flex flex-col">
                        <Typography variant="h6" className="mb-24 font-800 text-blue-900">
                            Identification de votre structure
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextFieldFormsy
                                    name="societe"
                                    label="Nom commercial / Raison sociale"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Icon color="action">business</Icon></InputAdornment>,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextFieldFormsy
                                    name="ice"
                                    label="ICE (Identifiant Commun de l'Entreprise)"
                                    variant="outlined"
                                    fullWidth
                                    validations={{
                                        isNumeric: true,
                                        minLength: 15,
                                        maxLength: 15
                                    }}
                                    validationErrors={{
                                        isNumeric: 'L\'ICE doit être composé uniquement de chiffres',
                                        minLength: 'L\'ICE doit faire exactement 15 chiffres',
                                        maxLength: 'L\'ICE doit faire exactement 15 chiffres'
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="pays"
                                    placeholder="Sélectionner un pays"
                                    textFieldProps={{
                                        label: 'Pays d\'origine',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={pays || []}
                                    fullWidth
                                    required
                                    onChange={handleCountryChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="ville"
                                    placeholder="Sélectionner une ville"
                                    textFieldProps={{
                                        label: 'Ville',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={villes || []}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextFieldFormsy
                                    name="adresse1"
                                    label="Siège social (Ligne 1)"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextFieldFormsy
                                    name="fix"
                                    label="Téléphone Professionnel"
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>
                             <Grid item xs={12} sm={6}>
                                <TextFieldFormsy
                                    name="website"
                                    label="Site Internet"
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="currency"
                                    placeholder="Devise de facturation"
                                    textFieldProps={{
                                        label: 'Devise de facturation',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={currencies || []}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    name="description"
                                    label="Présentation courte de votre entreprise"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    required
                                />
                            </Grid>
                        </Grid>
                        <div className="flex justify-end mt-40 pt-24 border-t">
                            <Button
                                type="submit"
                                variant="contained"
                                className="btn-primary-onboarding"
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Icon>arrow_forward</Icon>}
                            >
                                Continuer vers le catalogue
                            </Button>
                        </div>
                    </Formsy>
                );

            case 1:
                return <Typography>Étape 2 : Produits (En cours d'intégration...)</Typography>;
            default:
                return 'Inconnu';
        }
    };

    return (
        <div className="modern-onboarding-container">
            <Helmet>
                <title>Onboarding Fournisseur | Boopursal</title>
            </Helmet>
            
            <div className="onboarding-card">
                <div className="onboarding-header">
                    <Typography className="onboarding-title">Bienvenue sur Boopursal</Typography>
                    <Typography className="onboarding-subtitle">Configurons votre espace professionnel en quelques secondes.</Typography>
                </div>

                <div className="onboarding-content">
                    <Stepper activeStep={activeStep} alternativeLabel className="stepper-custom">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel StepIconProps={{ classes: { root: 'step-icon-custom' } }}>
                                    <span className="step-label-custom">{label}</span>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <div className={classes.stepContent}>
                        {renderStepContent(activeStep)}
                    </div>
                </div>
            </div>
        </div>
    );
}

const combinedReducer = combineReducers({
    step2: reducer,
    step3: step3Reducer
});

export default withReducer('onboardingApp', combinedReducer)(withRouter(SupplierOnboarding));
