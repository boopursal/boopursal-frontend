import React, { useRef, useEffect, useState } from 'react';
import {
    Button, Tab, Tabs, Icon, Typography, LinearProgress,
    Chip, CircularProgress, IconButton, FormControlLabel,
    Radio, MenuItem, ListItemText, Paper
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import {
    FuseAnimate, FusePageCarded, URL_SITE,
    TextFieldFormsy, DatePickerFormsy, CheckboxFormsy,
    RadioGroupFormsy, SelectReactFormsy, FuseChipSelect
} from '@fuse';
import AsyncSelect from 'react-select/lib/Async';
import agent from 'agent';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';
import moment from 'moment';
import green from '@material-ui/core/colors/green';
import ReactTable from "react-table";
import Autosuggest from 'react-autosuggest';
import Highlighter from "react-highlight-words";
import SuggestionDialog from './SuggestionDialog';

const useStyles = makeStyles(theme => ({
    headerRoot: {
        background: 'linear-gradient(135deg, #1a2744 0%, #2c3e6b 100%)',
        minHeight: 200,
    },
    card: {
        background: '#fff',
        borderRadius: 16,
        border: '1px solid #f0f0f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: 32,
        marginBottom: 24,
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid #f5f5f5',
        fontWeight: 900,
        fontSize: 13,
        letterSpacing: 1,
        color: '#1a2744',
        textTransform: 'uppercase',
    },
    cardIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        fontWeight: 'bold',
    },
    sidebar: {
        width: 320,
        flexShrink: 0,
        marginLeft: 32,
        '@media (max-width: 1279px)': {
            width: '100%',
            marginLeft: 0,
            marginTop: 24,
        },
    },
    sideCard: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
    },
    auditCard: {
        borderRadius: 16,
        marginBottom: 20,
        padding: 24,
    },
    auditAlert: {
        display: 'flex',
        alignItems: 'flex-start',
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 8,
        border: '1px solid rgba(255,255,255,0.5)',
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 12px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    decisionCard: {
        background: 'linear-gradient(135deg, #2779BD 0%, #1C3D5A 100%)',
        borderRadius: 16,
        padding: 28,
        color: '#fff',
        marginBottom: 20,
    },
    couvertureCard: {
        background: '#1a2744',
        borderRadius: 16,
        padding: 24,
        color: '#fff',
        marginBottom: 20,
    },
    budgetBox: {
        background: '#1a2744',
        borderRadius: 12,
        padding: 20,
        color: '#fff',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    twoColLayout: {
        display: 'flex',
        alignItems: 'flex-start',
        width: '100%',
        '@media (max-width: 1279px)': {
            flexDirection: 'column',
        },
    },
    mainCol: {
        flex: 1,
        minWidth: 0,
    },
    refBadge: {
        display: 'inline-block',
        padding: '2px 10px',
        borderRadius: 6,
        background: 'rgba(52,144,220,0.15)',
        color: '#2779BD',
        fontWeight: 900,
        fontSize: 11,
        marginRight: 8,
        border: '1px solid rgba(52,144,220,0.25)',
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        color: 'rgba(255,255,255,0.6)',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 20,
        '&:hover': { color: '#fff' },
    },
    suggestionChip: {
        margin: '4px 6px 4px 0',
        background: '#fff',
        border: '1px solid #e0e0e0',
        fontWeight: 700,
        borderRadius: 8,
    },
    optionRow: {
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        padding: '10px 16px',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        background: '#fafafa',
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

moment.defaultFormat = "DD/MM/YYYY HH:mm";

function renderSuggestion(suggestion, { query, isHighlighted }) {
    return (
        <MenuItem selected={isHighlighted} component="div" dense>
            <ListItemText primary={
                <Highlighter highlightClassName="YourHighlightClass" searchWords={[query]} autoEscape textToHighlight={suggestion.name} />
            } />
        </MenuItem>
    );
}

function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
        <TextField fullWidth InputProps={{ inputRef: node => { ref(node); inputRef(node); } }} {...other} />
    );
}

function Demande(props) {
    const classes = useStyles(props);
    const suggestionsNode = useRef(null);
    const popperNode = useRef(null);
    const searchCategories = useSelector(({ demandesAdminApp }) => demandesAdminApp.searchCategories);
    const [categories, setCategories] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const dispatch = useDispatch();
    const demande = useSelector(({ demandesAdminApp }) => demandesAdminApp.demande);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const { form, handleChange, setForm } = useForm();

    const [tabValue, setTabValue] = useState(0);
    const [sousSecteurs] = useState(null);
    const [motif, setMotif] = useState(null);
    const params = props.match.params;
    const { demandeId } = params;

    useEffect(() => {
        if (demandeId === 'new') {
            dispatch(Actions.newDemande());
        } else {
            dispatch(Actions.getDemande(demandeId));
            dispatch(Actions.getFournisseurParticipe(demandeId));
        }
        dispatch(Actions.getMotifs());
        dispatch(Actions.getSecteurs());
        return () => dispatch(Actions.cleanUpDemande());
    }, [dispatch, demandeId]);

    useEffect(() => {
        if (demande.attachement) {
            setForm(_.set({ ...form }, 'attachements', [demande.attachement, ...form.attachements]));
            demande.attachement = null;
        }
    }, [demande.attachement, form, setForm]);

    useEffect(() => {
        if (demande.error && (demande.error.reference || demande.error.statut || demande.error.motifRejet || demande.error.description || demande.error.dateExpiration)) {
            formRef.current && formRef.current.updateInputsWithError({ ...demande.error });
            setIsFormValid(false);
            demande.error = null;
        }
    }, [demande.error]);

    useEffect(() => {
        if (demande.attachement_deleted) {
            setForm(_.set({ ...form }, 'attachements', _.pullAllBy(form.attachements, [{ 'id': demande.attachement_deleted }], 'id')));
            demande.attachement_deleted = null;
        }
    }, [demande.attachement_deleted, form, setForm]);

    useEffect(() => {
        if ((demande.data && !form) || (demande.data && form && demande.data.id !== form.id)) {
            if (demande.data.categories) setCategories(demande.data.categories.map(item => item));
            if (demande.data.motifRejet) setMotif({ value: demande.data.motifRejet['@id'], label: demande.data.motifRejet.name });
            if (demande.data.autreCategories) setSuggestions(_.split(demande.data.autreCategories, ','));
            setForm({ ...demande.data });
        }
    }, [form, demande.data, setForm]);

    useEffect(() => {
        if (demande.produit) {
            setCategories([...categories, demande.produit]);
            setSuggestions(_.reject(suggestions, i => i === demande.produit.name));
        }
    }, [demande.produit, categories, suggestions]);

    function handleSuggestionsFetchRequested({ value, reason }) {
        if (reason === 'input-changed') {
            value && value.trim().length > 1 && dispatch(Actions.loadSuggestions(value.trim()));
        }
    }
    function handleSuggestionsClearRequested() {}

    function handleUploadChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        dispatch(Actions.uploadAttachement(file));
    }

    function handleRadioChange(e) {
        if (parseInt(e.target.value) === 2) form.isPublic = false;
        setForm(_.set({ ...form }, 'statut', parseInt(e.target.value)));
    }

    function handleRadioLocalisation(e) {
        setForm(_.set({ ...form }, 'localisation', parseInt(e.target.value)));
    }

    const loadCategoryOptions = (inputValue, callback) => {
        if (!inputValue || inputValue.length < 2) {
            callback([]);
            return;
        }
        agent.get(`/api/categories?name=${inputValue}&del=false&props[]=id&props[]=name`)
            .then(res => {
                const results = res.data['hydra:member'] || [];
                const opts = results.map(item => ({
                    value: item.id,
                    label: item.name,
                    '@id': `/api/categories/${item.id}`
                }));
                callback(opts);
            })
            .catch(() => callback([]));
    };

    function handleAsyncCategoriesChange(selected) {
        if (selected && Array.isArray(selected)) {
            setCategories(selected.map(s => ({
                id: s.value,
                name: s.label,
                '@id': s['@id'] || `/api/categories/${s.value}`
            })));
        } else {
            setCategories([]);
        }
    }

    function handleRemoveSuggestion(item) {
        setSuggestions(_.reject(suggestions, s => s === item));
    }

    function handleSubmit() {
        dispatch(Actions.putDemande(form, sousSecteurs, suggestions, motif, form.id, props.history, categories));
    }

    if (!form) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 40 }}>
                <CircularProgress />
            </div>
        );
    }

    const acheteur = form.acheteur || demande.data?.acheteur;
    const statusLabel = form.statut === 1 ? 'Validée' : form.statut === 2 ? 'Rejetée' : 'En attente';
    const statusColor = form.statut === 1 ? '#1F9D55' : form.statut === 2 ? '#CC1F1A' : '#DE751F';
    const report = demande.data?.validationReport;

    return (
        <>
            <FusePageCarded
                classes={{
                    toolbar: 'p-0',
                    header: 'min-h-72 h-72 sm:h-136 sm:min-h-136 bg-blue-darkest text-white',
                    contentWrapper: 'p-0',
                    content: 'flex flex-col flex-1 relative',
                }}
                header={
                    <div className="flex flex-1 w-full items-center justify-between px-24 py-16">
                        <div className="flex flex-col items-start min-w-0">
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Typography className="normal-case flex items-center sm:mb-12 cursor-pointer font-bold" onClick={() => props.history.push('/demandes_admin')}>
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    Retour à la liste
                                </Typography>
                            </FuseAnimate>
                            <div className="flex items-center min-w-0">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-lg flex items-center justify-center mr-16" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                        <Icon className="text-32 text-blue-light">assignment</Icon>
                                    </div>
                                </FuseAnimate>
                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="h5" className="truncate font-bold">
                                            {form.titre || 'Nouvelle Demande'}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption" className="flex items-center mt-4">
                                            {form.reference && (
                                                <span className="font-bold mr-8 tracking-wide">#{form.reference}</span>
                                            )}
                                            {statusLabel && <span className="font-bold" style={{ color: statusColor }}>• {statusLabel}</span>}
                                        </Typography>
                                    </FuseAnimate>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                contentToolbar={
                    demande.loading ? (
                        <div className="w-full"><LinearProgress color="secondary" /></div>
                    ) : (
                        <div style={{ borderBottom: '1px solid #f0f0f0', background: '#fff', paddingLeft: 16 }}>
                            <Tabs
                                value={(() => {
                                    const t = [0, 1, 2];
                                    if (form?.diffusionsdemandes?.length > 0) t.push(3);
                                    if (demande?.fournisseurs?.length > 0 && !form.isAnonyme) t.push(4);
                                    const idx = t.indexOf(tabValue);
                                    return idx !== -1 ? idx : 0;
                                })()}
                                onChange={(e, n) => {
                                    const t = [0, 1, 2];
                                    if (form?.diffusionsdemandes?.length > 0) t.push(3);
                                    if (demande?.fournisseurs?.length > 0 && !form.isAnonyme) t.push(4);
                                    setTabValue(t[n]);
                                }}
                                variant="scrollable"
                                classes={{ root: 'min-h-72', indicator: 'bg-blue h-4' }}
                            >
                                <Tab className="min-h-72 font-700 text-14" label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>assignment</Icon>Général</span>} />
                                <Tab className="min-h-72 font-700 text-14" label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>attach_file</Icon>Documents {form?.attachements?.length > 0 && <span style={{ marginLeft: 8, background: '#E3342F', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 11 }}>{form.attachements.length}</span>}</span>} />
                                <Tab className="min-h-72 font-700 text-14" label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>person</Icon>Acheteur</span>} />
                                {form?.diffusionsdemandes?.length > 0 && <Tab className="min-h-72 font-700 text-14" label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>send</Icon>Diffusion</span>} />}
                                {demande?.fournisseurs?.length > 0 && !form.isAnonyme && <Tab className="min-h-72 font-700 text-14" label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>people</Icon>Participants</span>} />}
                            </Tabs>
                        </div>
                    )
                }
                content={
                    <div className="p-16 sm:p-24 w-full" style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Formsy onValidSubmit={handleSubmit} onValid={() => setIsFormValid(true)} onInvalid={() => setIsFormValid(false)} ref={formRef}>

                            {/* ── TAB 0 : GÉNÉRAL ── */}
                            {tabValue === 0 && (
                                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-center w-full">

                                    {/* COLONNE GAUCHE (Formulaire Principal) */}
                                    <div className="flex-1 min-w-0 pr-0 xl:pr-24">

                                        {/* Identification */}
                                        <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                            <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                                <Icon className="text-blue mr-8 text-20">edit</Icon>
                                                Identification du besoin
                                            </div>
                                            <div className="p-16 sm:p-24 flex flex-col sm:flex-row flex-wrap -mx-8">
                                                <div className="w-full sm:w-1/2 px-8 mb-16 sm:mb-0">
                                                    <TextFieldFormsy name="titre" label="Objet de la demande *" value={form.titre} variant="outlined" required fullWidth />
                                                </div>
                                                <div className="w-full sm:w-1/2 px-8">
                                                    <TextFieldFormsy name="reference" label="Référence interne" value={form.reference} variant="outlined" disabled fullWidth />
                                                </div>
                                                <div className="w-full sm:w-1/2 px-8 mt-16">
                                                    <TextFieldFormsy name="budget" label="Budget estimatif (MAD)" value={form.budget !== undefined && form.budget !== null ? String(form.budget) : ''} type="number" variant="outlined" fullWidth className="font-bold text-lg" />
                                                </div>
                                                <div className="w-full sm:w-1/2 px-8 mt-16">
                                                    <DatePickerFormsy name="dateExpiration" value={form.dateExpiration} label="Fin de validité" format="DD/MM/YYYY" variant="outlined" fullWidth />
                                                </div>
                                            </div>
                                        </Paper>

                                        {/* Description */}
                                        <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                            <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                                <Icon className="text-purple mr-8 text-20">description</Icon>
                                                Cahier des charges
                                            </div>
                                            <div className="p-16 sm:p-24">
                                                <TextFieldFormsy name="description" label="Spécifications techniques détaillées *" value={form.description} multiline rows={6} variant="outlined" required fullWidth />
                                                
                                                {form.autre_categories && (
                                                    <div className="mt-16">
                                                        <TextFieldFormsy name="autre_categories" label="Autres catégories spécifiées" value={form.autre_categories} variant="outlined" disabled fullWidth />
                                                    </div>
                                                )}
                                            </div>
                                        </Paper>

                                        {/* Catégories */}
                                        <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                            <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                                <Icon className="text-orange mr-8 text-20">layers</Icon>
                                                Classification partenaires
                                            </div>
                                            <div className="p-16 sm:p-24">
                                                <Typography variant="body2" className="font-bold text-gray-dark block mb-8">Secteurs d'activités cibles *</Typography>
                                                <AsyncSelect
                                                    cacheOptions
                                                    defaultOptions={categories.map(c => ({ value: c.id, label: c.name, '@id': c['@id'] }))}
                                                    loadOptions={loadCategoryOptions}
                                                    value={categories.map(c => ({ value: c.id, label: c.name, '@id': c['@id'] }))}
                                                    onChange={handleAsyncCategoriesChange}
                                                    placeholder="Lancer une recherche par mot-clé (ex: Informatique, Acier...)"
                                                    isMulti
                                                    noOptionsMessage={() => "Aucun résultat"}
                                                    loadingMessage={() => "Recherche..."}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            minHeight: 48,
                                                            borderColor: '#e2e8f0',
                                                            '&:hover': { borderColor: '#cbd5e1' }
                                                        })
                                                    }}
                                                />
                                                {suggestions.length > 0 && (
                                                    <div className="mt-16 p-12 bg-gray-lightest border border-gray-lighter rounded-md">
                                                        <Typography variant="caption" className="font-bold text-gray-dark mb-8 block uppercase tracking-wide">
                                                            Suggestions de l'acheteur
                                                        </Typography>
                                                        <div className="flex flex-wrap">
                                                            {suggestions.map((item, i) => (
                                                                <Chip key={i} label={item} onDelete={() => handleRemoveSuggestion(item)} size="small" className="mr-8 mb-4 bg-white border border-gray-light font-bold" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Paper>

                                    </div>

                                    {/* COLONNE DROITE — SIDEBAR */}
                                    <div className="w-full xl:w-320 flex-shrink-0 mt-24 xl:mt-0">

                                        {/* Audit IA */}
                                        {report && (
                                            <Paper className="mb-24 rounded-lg shadow-sm border" style={{
                                                background: report.score >= 80 ? '#E3FCEC' : report.score >= 60 ? '#FFF9C2' : '#FCEBEA',
                                                borderColor: report.score >= 80 ? '#51D88A' : report.score >= 60 ? '#F2D024' : '#EF5753',
                                            }}>
                                                <div className="p-16 pb-8 border-b border-transparent flex justify-between items-center text-gray-darkest font-extrabold uppercase text-13">
                                                    <span className="flex items-center"><Icon className="mr-8 text-20">verified_user</Icon> Analyse IA</span>
                                                    <span className="text-20 font-black">{report.score}%</span>
                                                </div>
                                                <div className="px-16 pb-16">
                                                    <LinearProgress variant="determinate" value={report.score} style={{ height: 6, borderRadius: 3, marginBottom: 16, background: 'rgba(0,0,0,0.1)' }} />
                                                    {report.alerts.map((alert, idx) => (
                                                        <div key={idx} className="flex items-start bg-white bg-opacity-75 rounded p-8 mb-8 border border-white border-opacity-50">
                                                            <Icon className={`text-18 mr-8 mt-2 flex-shrink-0 ${alert.type === 'CRITICAL' ? 'text-red' : 'text-orange'}`}>
                                                                {alert.type === 'CRITICAL' ? 'report' : 'warning_amber'}
                                                            </Icon>
                                                            <div>
                                                                <Typography variant="body2" className="font-bold text-gray-darkest leading-tight">{alert.message}</Typography>
                                                                <Typography variant="caption" className="font-bold text-gray-dark uppercase tracking-tight">{alert.detail}</Typography>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Paper>
                                        )}

                                        {/* Paramètres & Diffusion */}
                                        <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                            <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                                <Icon className="text-blue mr-8 text-20">settings</Icon>
                                                Paramètres & Options
                                            </div>
                                            <div className="p-16">
                                                <div className="mb-16 border-b border-gray-lighter pb-12"><CheckboxFormsy name="isPublic" value={!!form.isPublic} label={<span className="font-bold text-14">Publié sur le portail</span>} /></div>
                                                <div className="mb-16 border-b border-gray-lighter pb-12"><CheckboxFormsy name="isAnonyme" value={!!form.isAnonyme} label={<span className="font-bold text-14">Client masqué</span>} /></div>
                                                <div className="p-12 mt-12 bg-blue-lightest border border-blue-lighter rounded-lg"><CheckboxFormsy name="sendEmail" value={!!form.sendEmail} label={<span className="font-bold text-14 text-blue-darker">Alerter les Partenaires par e-mail</span>} /></div>
                                                
                                                <div className="mt-20 pt-16 border-t border-gray-lighter">
                                                    <Typography variant="caption" className="font-bold text-gray flex items-center uppercase mb-12"><Icon className="text-16 mr-4">public</Icon> Couverture Géographique</Typography>
                                                    <RadioGroupFormsy name="localisation" onChange={handleRadioLocalisation} className="flex-col">
                                                        <FormControlLabel value="2" checked={form.localisation === 2} control={<Radio size="small" color="primary" />} label={<span className="font-bold text-13">Locale (Maroc)</span>} />
                                                        <FormControlLabel value="3" checked={form.localisation === 3} control={<Radio size="small" color="primary" />} label={<span className="font-bold text-13">Internationale</span>} />
                                                        <FormControlLabel value="1" checked={form.localisation === 1} control={<Radio size="small" color="primary" />} label={<span className="font-bold text-13">Global (Les deux)</span>} />
                                                    </RadioGroupFormsy>
                                                </div>
                                            </div>
                                        </Paper>

                                        {/* Décision Admin */}
                                        <Paper className="rounded-lg shadow-sm bg-blue-darkest border border-blue-darkest text-white">
                                            <div className="p-16 border-b border-transparent flex items-center text-blue-light font-extrabold uppercase text-13">
                                                <Icon className="mr-8 text-20">gavel</Icon>
                                                Décision Modérateur
                                            </div>
                                            <div className="p-16 pt-0">
                                                <div className="bg-white bg-opacity-10 rounded p-8 mb-16">
                                                    <RadioGroupFormsy name="statut" onChange={handleRadioChange} className="flex-col">
                                                        <FormControlLabel value="1" checked={form.statut === 1} control={<Radio size="small" style={{ color: '#51D88A' }} />} label={<span className="font-bold text-13 text-green-light">Approuver & Diffuser</span>} />
                                                        <FormControlLabel value="2" checked={form.statut === 2} control={<Radio size="small" style={{ color: '#F9ACAA' }} />} label={<span className="font-bold text-13 text-red-lighter">Rejeter la demande</span>} />
                                                    </RadioGroupFormsy>
                                                </div>
                                                {form.statut === 2 && demande.motifs && (
                                                    <div className="mb-16">
                                                        <SelectReactFormsy
                                                            id="motifRejet"
                                                            name="motifRejet"
                                                            value={motif}
                                                            options={_.map(demande.motifs, item => ({ value: item['@id'], label: item.name }))}
                                                            textFieldProps={{
                                                                label: 'Raison du rejet',
                                                                variant: 'outlined',
                                                                InputLabelProps: { shrink: true, style: { color: 'rgba(255,255,255,0.7)' } },
                                                                style: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 4 }
                                                            }}
                                                            onChange={val => setMotif(val)}
                                                        />
                                                    </div>
                                                )}
                                                <Button
                                                    className="w-full whitespace-no-wrap bg-white text-blue-darker font-bold py-12 rounded mt-8"
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={!isFormValid || demande.loading || !categories.length}
                                                >
                                                    {demande.loading ? <CircularProgress size={22} color="secondary" /> : 'Enregistrer'}
                                                </Button>
                                            </div>
                                        </Paper>

                                    </div>
                                </div>
                            )}

                            {/* ── TAB 1 : DOCUMENTS ── */}
                            {tabValue === 1 && (
                                <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                    <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                        <Icon className="text-blue mr-8 text-20">cloud_upload</Icon>
                                        Documents Source de l'Acheteur
                                    </div>
                                    <div className="p-16 sm:p-24">
                                        <Typography className="text-gray-dark mb-16">Fichiers techniques et appels d'offres originaux.</Typography>
                                        <div className="flex flex-wrap -mx-8">
                                        {form.attachements?.length < 5 && (
                                            <div className="px-8 mb-16">
                                                <label htmlFor="button-file" className="w-128 h-128 border-2 border-dashed border-gray-light rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-lightest transition-colors">
                                                    <input accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" id="button-file" type="file" onChange={handleUploadChange} />
                                                    <Icon className="text-32 text-gray mb-8">add_circle_outline</Icon>
                                                    <Typography variant="caption" className="font-bold text-gray uppercase tracking-wide">Ajouter</Typography>
                                                </label>
                                            </div>
                                        )}
                                        {form.attachements?.map(media => (
                                            <div key={media.id} className="px-8 mb-16">
                                                <div className="w-128 h-128 rounded relative border border-gray-lighter overflow-hidden bg-gray-lightest group shadow-sm hover:shadow transition-shadow">
                                                    <IconButton size="small" className="absolute top-0 right-0 z-10 m-4 bg-white hover:bg-red hover:text-white transition-colors" 
                                                        style={{ padding: 4 }}
                                                        onClick={() => dispatch(Actions.deleteMedia(media))}>
                                                        <Icon className="text-16">delete</Icon>
                                                    </IconButton>
                                                    <div className="w-full h-full flex items-center justify-center cursor-pointer"
                                                        onClick={() => window.open(URL_SITE + '/attachement/demandeAchat/' + media.url, '_blank')}>
                                                        {media.type.startsWith('image')
                                                            ? <img className="object-cover w-full h-full" src={URL_SITE + '/attachement/demandeAchat/' + media.url} alt="media" />
                                                            : <div className="text-center p-8">
                                                                <Icon className="text-40 text-gray block mb-4 mx-auto">insert_drive_file</Icon>
                                                                <Typography variant="caption" className="font-bold text-gray-dark truncate block max-w-full px-4">{media.name || 'Document'}</Typography>
                                                              </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                </Paper>
                            )}

                            {/* ── TAB 2 : ACHETEUR (confidentiel) ── */}
                            {tabValue === 2 && acheteur && (
                                <div className="max-w-4xl mx-auto">
                                    <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                        <div className="p-16 border-b border-gray-lighter flex items-center text-green-darker font-bold uppercase text-13">
                                            <Icon className="text-green mr-8 text-20">person</Icon>
                                            Contact Privé — Acheteur
                                        </div>
                                        <div className="p-16 sm:p-24 flex flex-col sm:flex-row flex-wrap -mx-8">
                                            <div className="w-full sm:w-1/3 px-8 mb-16 sm:mb-0">
                                                <TextField label="Nom complet" value={`${acheteur.user?.first_name || acheteur.first_name || ''} ${acheteur.user?.last_name || acheteur.last_name || ''}`.trim()} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/3 px-8 mb-16 sm:mb-0">
                                                <TextField label="Adresse Email" value={acheteur.user?.email || acheteur.email || ''} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/3 px-8">
                                                <TextField label="N° Téléphone" value={acheteur.user?.phone || acheteur.phone || ''} fullWidth variant="outlined" InputProps={{ readOnly: true }} />
                                            </div>
                                        </div>
                                    </Paper>
                                    <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                        <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                            <Icon className="text-blue mr-8 text-20">business</Icon>
                                            Données de l'Entreprise
                                        </div>
                                        <div className="p-16 sm:p-24 flex flex-col sm:flex-row flex-wrap -mx-8 mt-8">
                                            <div className="w-full sm:w-1/2 px-8 mb-20">
                                                <TextField label="Société" value={acheteur.societe || acheteur.nom_entreprise || ''} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/4 px-8 mb-20">
                                                <TextField label="ICE / Id Fiscal" value={acheteur.ice || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/4 px-8 mb-20">
                                                <TextField label="Secteur" value={acheteur.secteur?.name || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>

                                            <div className="w-full sm:w-1/3 px-8 mb-20">
                                                <TextField label="Téléphone Fixe" value={acheteur.fix || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-2/3 px-8 mb-20">
                                                <TextField label="Site Web" value={acheteur.website || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            
                                            <div className="w-full sm:w-1/2 px-8 mb-20">
                                                <TextField label="Adresse 1" value={acheteur.user?.adresse1 || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/2 px-8 mb-20">
                                                <TextField label="Adresse 2" value={acheteur.user?.adresse2 || ''} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>

                                            <div className="w-full sm:w-1/3 px-8 mb-20">
                                                <TextField label="Pays" value={acheteur.pays?.name || 'N/C'} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/3 px-8 mb-20">
                                                <TextField label="Ville" value={acheteur.ville?.name || acheteur.autre_ville || ''} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                            <div className="w-full sm:w-1/3 px-8 mb-20">
                                                <TextField label="Code Postal" value={acheteur.user?.codepostal || ''} fullWidth variant="outlined" size="small" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>

                                            <div className="w-full px-8">
                                                <TextField label="Présentation" value={acheteur.description || 'Aucune description fournie.'} fullWidth multiline minRows={3} variant="outlined" InputProps={{ readOnly: true }} InputLabelProps={{ shrink: true }} />
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            )}

                            {/* ── TAB 3 & 4 : DIFFUSION / PARTICIPANTS ── */}
                            {(tabValue === 3 || tabValue === 4) && (
                                <Paper className="mb-24 rounded-lg shadow-sm border border-gray-lighter">
                                    <div className="p-16 border-b border-gray-lighter flex items-center text-blue-darker font-bold uppercase text-13">
                                        <Icon className="text-blue mr-8 text-20">{tabValue === 3 ? 'send' : 'groups'}</Icon>
                                        {tabValue === 3 ? 'Historique de Diffusion' : 'Réponses Fournisseurs'}
                                    </div>
                                    <div className="p-16">
                                    <ReactTable
                                        data={tabValue === 3 ? form.diffusionsdemandes : demande.fournisseurs}
                                        columns={[
                                            { Header: "Société", id: "societe", accessor: f => f.fournisseur?.societe || 'N/C', className: "font-700" },
                                            { Header: "Contact", id: "contact", accessor: f => `${f.fournisseur?.firstName || ''} ${f.fournisseur?.lastName || ''}` },
                                            { Header: "Email", id: "email", accessor: f => f.fournisseur?.email || '' },
                                            { Header: "Date", id: "date", accessor: d => moment(d.dateDiffusion || d.created).format('DD/MM/YYYY HH:mm'), className: "font-700 text-blue-dark" }
                                        ]}
                                        defaultPageSize={10}
                                        className="-striped -highlight"
                                        style={{ border: 'none' }}
                                    />
                                    </div>
                                </Paper>
                            )}

                        </Formsy>
                    </div>
                }
                innerScroll
            />
            <SuggestionDialog />
        </>
    );
}

export default withReducer('demandesAdminApp', reducer)(Demande);
