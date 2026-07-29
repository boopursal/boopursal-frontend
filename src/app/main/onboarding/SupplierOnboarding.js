import React, { useState, useEffect, useRef } from 'react';
import { 
    Stepper, Step, StepLabel, Button, Typography, 
    Icon, CircularProgress, Grid, InputAdornment,
    TextField, Paper, MenuItem, Chip
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
import * as searchCategoriesActions from '../inscription/steps/step3/store/actions/searchCategories.actions';
import * as MessageActions from 'app/store/actions/fuse/message.actions';
import withReducer from 'app/store/withReducer';
import { useTranslation } from 'react-i18next';
import IceVerificationField from '../shared/IceVerificationField';
import { getIdConfigByCountry } from '../shared/countryIdConfig';

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
    const { t } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const user = useSelector(({ auth }) => auth.user);
    
    const appState = useSelector(state => state.supplierWizardApp);
    const pays = appState?.step2Module?.step2?.pays;
    const villes = appState?.step2Module?.step2?.villes;
    const currencies = appState?.step2Module?.step2?.currencies;
    const loading = appState?.step2Module?.step2?.loading;
    const searchCategories = appState?.step3Module?.searchCategories || { suggestions: [], searchText: '' };
    


    const [produitsSuggestion, setProduitsSuggestion] = useState([]);



    const steps = [
        t('onboarding.step_profile'),
        t('onboarding.step_catalog'),
        t('onboarding.step_finish')
    ];

    useEffect(() => {
        dispatch(Actions.getPays());
        dispatch(Actions.getCurrency());
    }, [dispatch]);

    const [isMaroc, setIsMaroc] = useState(false);
    const [idConfig, setIdConfig] = useState(null); // Config identifiant selon le pays
    const [iceValue, setIceValue] = useState('');
    const [iceData, setIceData] = useState(null);
    const formsyRef = useRef(null);

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
        const enrichedModel = iceData ? {
            ...model,
            ice: iceValue,
            typeIdentifiant: idConfig?.type || 'ICE',
            societe: model.societe || iceData.companyName || '',
            formeJuridique: iceData.legalForm || '',
            rc: iceData.rc || '',
            capitalSocial: iceData.capital || '',
            dateCreation: iceData.creationDate || '',
            activite: iceData.activity || '',
        } : {
            ...model,
            ice: isMaroc ? iceValue : (model.ice || ''),
            typeIdentifiant: idConfig?.type || 'FISCAL_ID',
        };

        const data = {
            ...enrichedModel,
            pays: model.pays?.value || model.pays,
            ville: model.ville?.value || model.ville,
            currency: model.currency?.value || model.currency,
            redirect: '/onboarding/fournisseur',
        };
        dispatch(Actions.setStep2(data, user.data.id, props.history));
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
        dispatch(Step3Actions.setStep3(data, user.data.id, props.history));
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
                                {t('onboarding.company_id')}
                            </Typography>

                            {/* Etape 1 : Pays en PREMIER pour déclencher le bon champ ICE */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <SelectReactFormsy
                                        name="pays"
                                        placeholder={t('onboarding.select_country')}
                                        textFieldProps={{
                                            label: t('onboarding.country_origin'),
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
                                        label={t('onboarding.company_name')}
                                        variant="outlined"
                                        fullWidth
                                        required
                                        value={iceData?.companyName || undefined}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><Icon color="action">business</Icon></InputAdornment>,
                                        }}
                                    />
                                </Grid>

                                {/* === CAS 1 : MAROC — IceVerificationField avec vérification auto === */}
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

                                {/* === CAS 2 : AUTRES PAYS — Champ texte adaptatif selon le pays === */}
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
                                            <Typography variant="caption" className="flex items-center mt-4">
                                                <Icon className="text-12 mr-4 text-blue-600">info</Icon>
                                                <a href={idConfig.helpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-600">
                                                    {idConfig.helpText}
                                                </a>
                                            </Typography>
                                        )}
                                    </Grid>
                                )}

                                {/* === CAS 3 : Aucun pays sélectionné — champ neutre === */}
                                {!idConfig && (
                                    <Grid item xs={12} sm={6}>
                                        <TextFieldFormsy
                                            name="ice"
                                            label={t('onboarding.fiscal_id')}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>
                                )}
                                
                                <Grid item xs={12} sm={6}>
                                    <SelectReactFormsy
                                        name="ville"
                                        placeholder={t('onboarding.select_city')}
                                        textFieldProps={{
                                            label: t('onboarding.city'),
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
                                        label={t('onboarding.headquarters')}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextFieldFormsy
                                        name="fix"
                                        label={t('onboarding.pro_phone')}
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <SelectReactFormsy
                                        name="currency"
                                        placeholder={t('onboarding.billing_currency')}
                                        textFieldProps={{
                                            label: t('onboarding.billing_currency'),
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
                                >
                                    Continuer vers le catalogue
                                    {loading ? <CircularProgress size={20} color="inherit" className="ml-8" /> : <Icon className="ml-8">arrow_forward</Icon>}
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

                        <div className="mb-32 relative">
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
                                    <div key={p.id || p['@id']} className="flex items-center bg-white border border-blue-500 rounded-full px-12 py-4 shadow-sm m-4">
                                        <Typography className="text-blue-700 font-500 text-13">{p.name || 'Produit sans nom'}</Typography>
                                        <Icon 
                                            className="text-16 ml-8 text-blue-500 cursor-pointer hover:text-red-500" 
                                            onClick={() => handleDeleteProduit(p.id)}
                                        >
                                            cancel
                                        </Icon>
                                    </div>
                                ))}
                                {produitsSuggestion.length === 0 && (
                                    <Typography className="text-gray-400 italic py-8">Aucun produit sélectionné pour le moment.</Typography>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between mt-40 pt-24 border-t">
                            <Button onClick={handleBack}>
                                <Icon className="mr-8">arrow_back</Icon>
                                Retour
                            </Button>
                            <Button
                                onClick={submitStep2}
                                variant="contained"
                                className="btn-primary-onboarding px-40"
                                disabled={produitsSuggestion.length === 0}
                            >
                                Finaliser mon inscription
                                <Icon className="ml-8">check_circle</Icon>
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

export default withReducer('supplierWizardApp', combinedReducer)(withRouter(SupplierOnboarding));

