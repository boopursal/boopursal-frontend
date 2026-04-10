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
import * as Actions from '../inscription/steps/step2/store/actions';
import withReducer from 'app/store/withReducer';
import reducer from '../inscription/steps/step2/store/reducers';
import { Helmet } from "react-helmet";
import clsx from 'clsx';
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
    const user = useSelector(({ auth }) => auth.user);
    const pays = useSelector(({ onboardingApp }) => onboardingApp?.step2?.pays);
    const villes = useSelector(({ onboardingApp }) => onboardingApp?.step2?.villes);
    const loading = useSelector(({ onboardingApp }) => onboardingApp?.step2?.loading);


    const steps = ['Coordonnées', 'Secteurs d\'achats', 'Finalisation'];

    useEffect(() => {
        dispatch(Actions.getPays());
    }, [dispatch]);

    const handleCountryChange = (val) => {
        if (val && val.value) {
            dispatch(Actions.getVilles(val.value));
        }
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const submitStep1 = (model) => {
        const data = {
            ...model,
            pays: model.pays?.value,
            ville: model.ville?.value,
            redirect: '/onboarding/acheteur',
        };
        // Utiliser l'action existante mais adaptée
        dispatch(Actions.setStep2(data, user.id, null));
        handleNext();
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
                                    label="Votre Pays"
                                    options={pays || []}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    onChange={handleCountryChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <SelectReactFormsy
                                    name="ville"
                                    label="Votre Ville"
                                    options={villes || []}
                                    variant="outlined"
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
                                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Icon>arrow_forward</Icon>}
                            >
                                Continuer
                            </Button>
                        </div>
                    </Formsy>
                );
            case 1:
                return <Typography className="text-center py-40">Définissez vos besoins d'achats (Bientôt disponible...)</Typography>;
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

export default withReducer('onboardingApp', { step2: reducer })(withRouter(BuyerOnboarding));
