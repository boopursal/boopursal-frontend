import React, { useState, useEffect, useRef } from 'react';
import { 
    Stepper, Step, StepLabel, Button, Typography, 
    Icon, CircularProgress, Grid, InputAdornment,
    TextField, Paper, MenuItem, Chip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '@fuse';
import SelectReactFormsy from '@fuse/components/formsy/SelectReactFormsy';
import { useForm } from '@fuse/hooks';
import * as Actions from '../inscription/steps/step2/store/actions';
import * as Step3Actions from '../inscription/steps/step3/store/actions';
import * as searchCategoriesActions from '../inscription/steps/step3/store/actions/searchCategories.actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import withReducer from 'app/store/withReducer';

import step2ModuleReducer from '../inscription/steps/step2/store/reducers';
import step3ModuleReducer from '../inscription/steps/step3/store/reducers';
import { Helmet } from "react-helmet";
import { combineReducers } from 'redux';
import Highlighter from "react-highlight-words";
import _ from "@lodash";
import clsx from 'clsx';
import './ModernOnboarding.css';

const useStyles = makeStyles(theme => ({
    stepContent: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
    },
}));

function SupplierOnboarding(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const user = useSelector(({ auth }) => auth.user);
    
    const onboardingApp = useSelector(({ onboardingApp }) => onboardingApp);
    const pays = onboardingApp?.step2Module?.step2?.pays;
    const villes = onboardingApp?.step2Module?.step2?.villes;
    const currencies = onboardingApp?.step2Module?.step2?.currencies;
    const loading = onboardingApp?.step2Module?.step2?.loading;
    const [produitsSuggestion, setProduitsSuggestion] = useState([]);

    const steps = ['Profil Société', 'Catalogue / Produits', 'Finalisation'];

    useEffect(() => {
        dispatch(Actions.getPays());
        dispatch(Actions.getCurrency());
    }, [dispatch]);

    const searchCategories = useSelector(({ onboardingApp }) => onboardingApp?.step3Module?.searchCategories);
    
    const [isMaroc, setIsMaroc] = useState(false);

    const handleCountryChange = (val) => {
        if (val && val.value) {
            dispatch(Actions.getVilles(val.value));
            // Vérification si c'est le Maroc (ID 144 ou label Maroc)
            const countryLabel = val.label || "";
            setIsMaroc(countryLabel.toLowerCase().includes("maroc"));
        }
    };

    const [isFormValid, setIsFormValid] = useState(false);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        window.scrollTo(0, 0);
    };

    const enableButton = () => setIsFormValid(true);
    const disableButton = () => setIsFormValid(false);

    const handleInvalidSubmit = (errors) => {
        console.warn("[ONBOARDING] Form Validation Errors:", errors);
        dispatch(MessageActions.showMessage({
            message: "Le formulaire est incomplet ou contient des erreurs. Veuillez vérifier les champs soulignés en rouge.",
            variant: 'error'
        }));
    };

    const submitStep1 = (model) => {
        console.log("[ONBOARDING] Submitting Step 1 (Valid):", model);
        const data = {
            ...model,
            pays: model.pays?.value || model.pays,
            ville: model.ville?.value || model.ville,
            currency: model.currency?.value || model.currency,
            redirect: '/onboarding/fournisseur',
        };
        dispatch(Actions.setStep2(data, user.id, history));
        handleNext();
    };


    const handleAddProduit = (suggestion) => {
        if (!_.find(produitsSuggestion, ["id", suggestion.id])) {
            setProduitsSuggestion([...produitsSuggestion, suggestion]);
        }
    };

    const handleDeleteProduit = (id) => {
        setProduitsSuggestion(produitsSuggestion.filter(p => p.id !== id));
    };

    const submitStep2 = () => {
        const categories = produitsSuggestion.map(p => p['@id']);
        const data = {
            categories: categories,
            redirect: '/dashboard'
        };
        dispatch(Step3Actions.setStep3(data, user.id, history));
        handleNext();
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                        <Formsy 
                            onValidSubmit={submitStep1} 
                            onInvalidSubmit={handleInvalidSubmit}
                            onValid={enableButton}
                            onInvalid={disableButton}
                            className="flex flex-col"
                        >
                            <Typography variant="h6" className="mb-24 font-800 text-blue-900 border-b pb-8">
                                Identification de votre structure
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextFieldFormsy
                                        name="societe"
                                        label="Raison sociale"
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
                                        label={isMaroc ? "ICE (15 chiffres)" : "Identifiant Fiscal / No. Enregistrement"}
                                        variant="outlined"
                                        fullWidth
                                        validations={isMaroc ? {
                                            isNumeric: true,
                                            minLength: 15,
                                            maxLength: 15
                                        } : {}}
                                        validationErrors={{
                                            isNumeric: 'L\'ICE doit être composé uniquement de chiffres',
                                            minLength: '15 chiffres requis',
                                            maxLength: '15 chiffres requis'
                                        }}
                                    />
                                    <Typography variant="caption" className="flex items-center mt-4">
                                        <Icon className="text-12 mr-4 text-blue-600">info</Icon>
                                        <a 
                                            href={isMaroc ? "https://ice.marocfacture.com/" : "https://www.google.com/search?q=business+registry"} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-600"
                                        >
                                            {isMaroc ? "Vérifier l'ICE sur MarocFacture" : "Aide à l'identification fiscale"}
                                        </a>
                                    </Typography>
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
                                            required: (villes && villes.length > 0)
                                        }}
                                        options={villes || []}
                                        fullWidth
                                        required={(villes && villes.length > 0)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextFieldFormsy
                                        name="adresse1"
                                        label="Siège social"
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
                                 <Grid item xs={12} sm={6}>
                                    <TextFieldFormsy
                                        name="website"
                                        label="Site Internet (Optionnel)"
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextFieldFormsy
                                        name="description"
                                        label="Présentation de votre activité"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <div className="flex justify-end mt-40 pt-24 border-t">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="btn-primary-onboarding px-40"
                                    disabled={!isFormValid || loading}
                                    endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Icon>arrow_forward</Icon>}
                                >
                                    Continuer vers le catalogue
                                </Button>
                            </div>
                        </Formsy>

                );
            case 1:
                return (
                    <div className="flex flex-col">
                        <Typography variant="h6" className="mb-8 font-800 text-blue-900">
                            Votre catalogue produits
                        </Typography>
                        <Typography className="mb-24 text-gray-600">
                            Sélectionnez les produits et services que vous proposez pour recevoir des demandes d'achats ciblées.
                        </Typography>

                        <div className="mb-32">
                             <TextField
                                label="Rechercher un produit ou un service..."
                                variant="outlined"
                                fullWidth
                                onChange={(ev) => dispatch(searchCategoriesActions.getResults(ev.target.value))}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Icon color="action">search</Icon></InputAdornment>,
                                }}
                            />
                            {searchCategories?.suggestions && searchCategories.suggestions.length > 0 && (
                                <Paper className="absolute left-0 right-0 mt-8 shadow-lg max-h-300 overflow-auto z-50">
                                    {searchCategories.suggestions.map(item => (
                                        <MenuItem key={item.id} onClick={() => {
                                            handleAddProduit(item);
                                            dispatch(searchCategoriesActions.cleanUp());
                                        }}>
                                            <Highlighter
                                                highlightClassName="bg-yellow-200"
                                                searchWords={[searchCategories.searchText || ""]}
                                                autoEscape={true}
                                                textToHighlight={item.name}
                                            />
                                        </MenuItem>
                                    ))}
                                </Paper>
                            )}

                        </div>

                        <div className="bg-gray-50 p-24 rounded-16 border border-dashed border-gray-300">
                            <Typography className="mb-16 font-700 text-gray-700 flex items-center">
                                <Icon className="mr-8 text-blue-600">inventory_2</Icon>
                                {produitsSuggestion.length} produit(s) sélectionné(s)
                            </Typography>
                            <div className="flex flex-wrap gap-8">
                                {produitsSuggestion.map(p => (
                                    <Chip 
                                        key={p.id} 
                                        label={p.name} 
                                        onDelete={() => handleDeleteProduit(p.id)}
                                        className="bg-white shadow-sm"
                                        color="primary"
                                        variant="outlined"
                                    />
                                ))}
                                {produitsSuggestion.length === 0 && (
                                    <Typography className="text-gray-400 italic py-8">Aucun produit sélectionné pour le moment.</Typography>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-40 pt-24 border-t">
                            <Button onClick={handleBack} startIcon={<Icon>arrow_back</Icon>}>
                                Retour
                            </Button>
                            <Button
                                onClick={submitStep2}
                                variant="contained"
                                className="btn-primary-onboarding px-40"
                                disabled={produitsSuggestion.length === 0}
                                endIcon={<Icon>check_circle</Icon>}
                            >
                                Finaliser mon inscription
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                 return (
                    <div className="flex flex-col items-center py-40 text-center">
                        <Icon className="text-72 text-green-500 mb-24">task_alt</Icon>
                        <Typography variant="h4" className="font-800 text-blue-900 mb-16">Félicitations !</Typography>
                        <Typography className="max-w-400 text-gray-600 mb-32">
                            Votre profil fournisseur est maintenant complet. Vous allez être redirigé vers votre tableau de bord.
                        </Typography>
                        <CircularProgress />
                    </div>
                );
            default:
                return null;
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
    step2Module: step2ModuleReducer,
    step3Module: step3ModuleReducer
});

export default withReducer('onboardingApp', combinedReducer)(withRouter(SupplierOnboarding));

