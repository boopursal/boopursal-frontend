import React, { useState, useEffect } from 'react';
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
import * as Actions from '../inscription/steps/step4/store/actions';
import withReducer from 'app/store/withReducer';
import step4ModuleReducer from '../inscription/steps/step4/store/reducers';
import { Helmet } from "react-helmet";
import { combineReducers } from 'redux';
import clsx from 'clsx';
import IceVerificationField from '../shared/IceVerificationField';
import { getIdConfigByCountry } from '../shared/countryIdConfig';
import './ModernOnboarding.css';

const useStyles = makeStyles(theme => ({
    stepContent: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}));

function BuyerOnboarding(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
    const user = useSelector(({ auth }) => auth.user);
    
    // Accès aux données via les réducteurs combinés imbriqués
    const onboardingApp = useSelector(({ onboardingApp }) => onboardingApp);
    const pays = onboardingApp?.step4Module?.step4?.pays;
    const villes = onboardingApp?.step4Module?.step4?.villes;
    const secteurs = onboardingApp?.step4Module?.step4?.secteurs;
    const currencies = onboardingApp?.step4Module?.step4?.currencies;
    const loading = onboardingApp?.step4Module?.step4?.loading;

    const steps = ['Coordonnées', 'Secteurs d\'achats', 'Finalisation'];

    useEffect(() => {
        dispatch(Actions.getPays());
        dispatch(Actions.getSecteurs());
        dispatch(Actions.getCurrency());
    }, [dispatch]);

    const [isMaroc, setIsMaroc] = useState(false);
    const [idConfig, setIdConfig] = useState(null); // Config identifiant selon le pays
    const [iceValue, setIceValue] = useState('');
    const [iceData, setIceData] = useState(null);

    const handleIceSuccess = (data) => {
        setIceData(data);
    };

    const handleCountryChange = (val) => {
        if (val && val.value) {
            dispatch(Actions.getVilles(val.value));
            const countryLabel = val.label || "";
            const isM = countryLabel.toLowerCase().includes("maroc");
            setIsMaroc(isM);
            setIdConfig(getIdConfigByCountry(countryLabel));
            // Reset ICE si on change de pays
            setIceValue('');
            setIceData(null);
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const submitStep1 = (model) => {
        setFormData(prev => ({
            ...prev,
            ...model,
        }));
        handleNext();
    };

    const submitStep2 = (model) => {
        const mergedData = {
            ...formData,
            ...model,
        };
        setFormData(mergedData);
        handleNext();
    };

    const handleFinalSubmit = () => {
        // Envoi final au backend
        dispatch(Actions.setStep4(formData, user.id, props.history));
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Formsy onValidSubmit={submitStep1} className="flex flex-col">
                        <Typography variant="h6" className="mb-24 font-800 text-blue-900">
                            Où vous situez-vous ?
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="pays"
                                    placeholder="Votre Pays"
                                    textFieldProps={{
                                        label: 'Votre Pays',
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
                                <TextFieldFormsy
                                    name="societe"
                                    label="Raison sociale"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={iceData?.companyName || undefined}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Icon color="action">business</Icon></InputAdornment>,
                                    }}
                                />
                            </Grid>

                            {idConfig && isMaroc && (
                                <Grid item xs={12}>
                                    <div style={{ padding: '16px', background: '#f0f7ff', border: '1px solid #bfdbfe', borderRadius: 12, marginBottom: 4 }}>
                                        <Typography variant="caption" style={{ color: '#1d4ed8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                                            <Icon style={{ fontSize: 16 }}>verified</Icon>
                                            ICE — Identifiant Commun de l'Entreprise · Vérification automatique disponible 🇲🇦
                                        </Typography>
                                        <IceVerificationField
                                            value={iceValue}
                                            onChange={(val) => setIceValue(val)}
                                            onVerifySuccess={handleIceSuccess}
                                        />
                                        <input type="hidden" name="ice" value={iceValue} />
                                    </div>
                                    {iceData && (
                                        <div style={{ marginTop: 8, padding: '10px 16px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Icon style={{ color: '#16a34a', fontSize: 20 }}>check_circle</Icon>
                                            <Typography variant="caption" style={{ color: '#15803d', fontWeight: 600 }}>
                                                ✅ <strong>{iceData.companyName}</strong> — Données auto-remplies et prêtes à être sauvegardées.
                                            </Typography>
                                        </div>
                                    )}
                                </Grid>
                            )}

                            {idConfig && !isMaroc && (
                                <Grid item xs={12} sm={6}>
                                    <TextFieldFormsy
                                        name="ice"
                                        label={idConfig.label}
                                        placeholder={idConfig.placeholder}
                                        variant="outlined"
                                        fullWidth
                                        inputProps={{ maxLength: idConfig.maxLength }}
                                    />
                                    {idConfig.helpUrl && (
                                        <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 4 }}>
                                            <a href={idConfig.helpUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                                Besoin d'aide pour trouver cet identifiant ?
                                            </a>
                                        </Typography>
                                    )}
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="ville"
                                    placeholder="Votre Ville"
                                    textFieldProps={{
                                        label: 'Votre Ville',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={villes || []}
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextFieldFormsy
                                    name="adresse1"
                                    label="Adresse physique"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><Icon color="action">place</Icon></InputAdornment>,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <div className="flex justify-end mt-40 pt-24 border-t">
                            <Button
                                type="submit"
                                variant="contained"
                                className="btn-primary-onboarding"
                            >
                                Continuer
                                <Icon className="ml-8">arrow_forward</Icon>
                            </Button>
                        </div>
                    </Formsy>
                );
            case 1:
                return (
                    <Formsy onValidSubmit={submitStep2} className="flex flex-col">
                        <Typography variant="h6" className="mb-24 font-800 text-blue-900">
                            Vos préférences d'achats
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="secteur"
                                    placeholder="Votre secteur principal"
                                    textFieldProps={{
                                        label: 'Secteur principal',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={secteurs || []}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="currency"
                                    placeholder="Devise préférée"
                                    textFieldProps={{
                                        label: 'Devise',
                                        InputLabelProps: { shrink: true },
                                        variant: 'outlined',
                                        required: true
                                    }}
                                    options={currencies || []}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        </Grid>
                        <div className="flex justify-between mt-40 pt-24 border-t">
                            <Button
                                onClick={handleBack}
                                className="font-600 text-slate-500"
                            >
                                Retour
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className="btn-primary-onboarding"
                            >
                                Continuer
                                <Icon className="ml-8">arrow_forward</Icon>
                            </Button>
                        </div>
                    </Formsy>
                );
            case 2:
                return (
                    <div className="flex flex-col items-center py-20 text-center">
                        <Icon style={{ fontSize: 60 }} className="text-emerald-500 mb-16 animate-bounce">check_circle</Icon>
                        <Typography variant="h6" className="mb-8 font-800 text-blue-900">
                            Prêt à commencer !
                        </Typography>
                        <Typography className="text-slate-600 max-w-400 mb-32">
                            Votre profil d'acheteur est configuré avec succès. Cliquez ci-dessous pour accéder directement à votre tableau de bord et publier vos demandes d'achats.
                        </Typography>
                        <div className="flex justify-between w-full mt-40 pt-24 border-t">
                            <Button
                                onClick={handleBack}
                                className="font-600 text-slate-500"
                                disabled={loading}
                            >
                                Retour
                            </Button>
                            <Button
                                onClick={handleFinalSubmit}
                                variant="contained"
                                className="btn-primary-onboarding"
                                disabled={loading}
                            >
                                Terminer
                                {loading ? <CircularProgress size={20} color="inherit" className="ml-8" /> : <Icon className="ml-8">done_all</Icon>}
                            </Button>
                        </div>
                    </div>
                );
            default:
                return 'Inconnu';
        }
    };

    return (
        <div className="modern-onboarding-container">
            <Helmet>
                <title>Onboarding Acheteur | Boopursal</title>
            </Helmet>
            
            <div className="onboarding-card">
                <div className="onboarding-header">
                    <Typography className="onboarding-title">Bienvenue Acheteur</Typography>
                    <Typography className="onboarding-subtitle">Optimisons votre expérience de sourcing industriel.</Typography>
                </div>

                <div className="onboarding-content">
                    <Stepper activeStep={activeStep} alternativeLabel className="stepper-custom">
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>
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
    step4Module: step4ModuleReducer,
});

export default withReducer('onboardingApp', combinedReducer)(withRouter(BuyerOnboarding));


