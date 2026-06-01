import React, { useRef, useEffect, useState } from 'react';
import {
    Button, Tab, Tabs, Icon, Typography, LinearProgress,
    Chip, CircularProgress, IconButton, FormControlLabel,
    Radio, MenuItem, ListItemText, Paper
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import {
    FuseAnimate, FusePageCarded, URL_SITE,
    TextFieldFormsy, DatePickerFormsy, CheckboxFormsy,
    RadioGroupFormsy, SelectReactFormsy
} from '@fuse';
import AsyncSelect from 'react-select/lib/Async';
import agent from 'agent';
import { useForm } from '@fuse/hooks';
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
import SuggestionDialog from './SuggestionDialog';

const useStyles = makeStyles(theme => ({
    pageHeader: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important',
        color: '#ffffff !important',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08) !important',
        boxShadow: 'none !important',
    },
    backButton: {
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '6px 12px',
        color: 'rgba(255, 255, 255, 0.8)',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.12)',
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.25)',
        },
        '& .MuiIcon-root': {
            marginRight: 6,
            fontSize: 18,
        }
    },
    premiumCard: {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 10px -3px rgba(0, 0, 0, 0.02)',
        padding: '24px',
        marginBottom: 24,
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 15px -5px rgba(0, 0, 0, 0.03)',
            borderColor: 'rgba(60, 80, 224, 0.25)',
        }
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: '0.5px',
        color: '#1e293b',
        textTransform: 'uppercase',
    },
    cardIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        fontWeight: 'bold',
        backgroundColor: 'rgba(60, 80, 224, 0.1)',
        color: '#3c50e0',
    },
    sidebar: {
        width: 400,
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
        marginBottom: 24,
        padding: 24,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
        }
    },
    auditAlert: {
        display: 'flex',
        alignItems: 'flex-start',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 10,
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        transition: 'transform 0.2s ease',
        '&:hover': {
            transform: 'translateX(4px)',
        }
    },
    statusBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    statusValidated: {
        background: 'rgba(16, 185, 129, 0.12) !important',
        color: '#10b981 !important',
        border: '1px solid rgba(16, 185, 129, 0.2) !important',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.1) !important',
    },
    statusRejected: {
        background: 'rgba(239, 68, 68, 0.12) !important',
        color: '#ef4444 !important',
        border: '1px solid rgba(239, 68, 68, 0.2) !important',
        boxShadow: '0 0 12px rgba(239, 68, 68, 0.1) !important',
    },
    statusPending: {
        background: 'rgba(245, 158, 11, 0.12) !important',
        color: '#f59e0b !important',
        border: '1px solid rgba(245, 158, 11, 0.2) !important',
        boxShadow: '0 0 12px rgba(245, 158, 11, 0.1) !important',
    },
    decisionCard: {
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: 16,
        padding: 24,
        color: '#fff',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
        }
    },
    decisionOption: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 12,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.07)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
        }
    },
    decisionOptionActiveGreen: {
        background: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)',
    },
    decisionOptionActiveRed: {
        background: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        boxShadow: '0 0 15px rgba(239, 68, 68, 0.15)',
    },
    submitBtn: {
        background: 'linear-gradient(135deg, #3C50E0 0%, #5165f6 100%) !important',
        color: '#ffffff !important',
        borderRadius: '12px !important',
        padding: '12px 24px !important',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.5px',
        textTransform: 'none !important',
        boxShadow: '0 4px 14px rgba(60, 80, 224, 0.25) !important',
        transition: 'all 0.3s ease !important',
        '&:hover': {
            boxShadow: '0 6px 20px rgba(60, 80, 224, 0.4) !important',
            transform: 'translateY(-1px)',
        },
        '&:disabled': {
            background: 'rgba(255, 255, 255, 0.12) !important',
            color: 'rgba(255, 255, 255, 0.3) !important',
            boxShadow: 'none !important',
        }
    },
    optionRadio: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        borderRadius: 8,
        marginBottom: 6,
        transition: 'background 0.2s ease',
        '&:hover': {
            background: 'rgba(60, 80, 224, 0.04)',
        }
    },
    alertEmailBox: {
        background: 'rgba(60, 80, 224, 0.05)',
        border: '1px solid rgba(60, 80, 224, 0.15)',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        transition: 'all 0.2s ease',
        '&:hover': {
            background: 'rgba(60, 80, 224, 0.08)',
            borderColor: 'rgba(60, 80, 224, 0.25)',
        }
    },
    tabRoot: {
        minHeight: 64,
        textTransform: 'none',
        fontWeight: 700,
        fontSize: 14,
        fontFamily: "'Outfit', sans-serif",
        '&:hover': {
            color: '#3c50e0',
            opacity: 1,
        },
    },
    tabSelected: {
        color: '#3c50e0',
    },
    tabsRoot: {
        borderBottom: '1px solid #e2e8f0',
        background: '#ffffff',
    },
    tabsIndicator: {
        backgroundColor: '#3c50e0',
        height: 3,
        borderRadius: '3px 3px 0 0',
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
    suggestionChip: {
        background: '#ffffff',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        fontWeight: 600,
        fontSize: 12,
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease',
        '&:hover': {
            borderColor: 'rgba(60, 80, 224, 0.2)',
            boxShadow: '0 2px 6px rgba(60, 80, 224, 0.05)',
        }
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



function Demande(props) {
    const classes = useStyles(props);

    const [categories, setCategories] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const dispatch = useDispatch();
    const demande = useSelector(({ demandesAdminApp }) => demandesAdminApp.demande);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const { form, setForm } = useForm();

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
            setForm({ 
                ...demande.data,
                isPublic: demande.data.is_public,
                isAnonyme: demande.data.is_anonyme,
                sendEmail: demande.data.is_alerted,
                localisation: demande.data.localisation
                  ? (typeof demande.data.localisation === 'string'
                    ? demande.data.localisation.split(",")
                    : [demande.data.localisation])
                  : []
            });
        }
    }, [form, demande.data, setForm]);

    const zones = [
        { name: "Union Européenne", code: "EU" },
        { name: "ALENA (Canada, USA, Mexique)", code: "NAFTA" },
        { name: "ASEAN (Asie du Sud-Est)", code: "ASEAN" },
        { name: "MERCOSUR (Amérique du Sud)", code: "MERCOSUR" },
        { name: "Union Africaine", code: "UA" },
        { name: "Océanie", code: "OCE" },
    ];

    const getZoneName = (codeOrName) => {
        const found = zones.find(z => z.code === codeOrName || z.name === codeOrName);
        return found ? found.name : codeOrName;
    };

    const isLocale = !form || !form.localisation || form.localisation === 2 || form.localisation === "2" || 
                     (Array.isArray(form.localisation) && (form.localisation.length === 0 || form.localisation.includes("2") || form.localisation.includes(2)));

    const isInternationale = form && (
        form.localisation === 3 || form.localisation === "3" ||
        (Array.isArray(form.localisation) && form.localisation.length > 0 && (
            form.localisation.includes("Tout le monde") ||
            form.localisation.some(code => typeof code === "string" && code.length === 2 && !zones.some(z => z.code === code))
        ))
    );

    const isZone = form && (
        form.localisation === 4 || form.localisation === "4" ||
        (Array.isArray(form.localisation) && form.localisation.length === 1 && zones.some(z => z.code === form.localisation[0]))
    );

    useEffect(() => {
        if (demande.produit) {
            setCategories([...categories, demande.produit]);
            setSuggestions(_.reject(suggestions, i => i === demande.produit.name));
        }
    }, [demande.produit, categories, suggestions]);



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

    function handleSubmit(model) {
        const mergedForm = { ...form, ...model };
        dispatch(Actions.putDemande(mergedForm, sousSecteurs, suggestions, motif, form.id, props.history, categories));
    }

    if (!form) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 40 }}>
                <CircularProgress />
            </div>
        );
    }

    const acheteur = form.acheteur || demande.data?.acheteur;
    const report = demande.data?.validationReport;
    const isAutoValidated = form.statut === 1 && report?.autoValidatedByAI;
    const statusLabel = isAutoValidated ? '⚡ Auto-validée par IA' : (form.statut === 1 ? 'Validée' : form.statut === 2 ? 'Rejetée' : 'En attente');

    return (
        <>
            <FusePageCarded
                classes={{
                    toolbar: 'p-0',
                    header: clsx(classes.pageHeader, 'min-h-72 h-72 sm:h-136 sm:min-h-136'),
                    contentWrapper: 'p-0',
                    content: 'flex flex-col flex-1 relative',
                }}
                header={
                    <div className="flex flex-1 w-full items-center justify-between px-16 sm:px-24 py-16">
                        <div className="flex flex-col items-start min-w-0">
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <span className={classes.backButton} onClick={() => props.history.push('/demandes_admin')}>
                                    <Icon>arrow_back</Icon>
                                    Retour à la liste
                                </span>
                            </FuseAnimate>
                            <div className="flex items-center min-w-0 mt-8 sm:mt-12">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-xl flex items-center justify-center mr-12 sm:mr-16" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                        <Icon className="text-24 sm:text-28 text-blue-light">assignment</Icon>
                                    </div>
                                </FuseAnimate>
                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="h6" className="text-16 sm:text-20 truncate font-extrabold tracking-tight">
                                            {form.titre || 'Nouvelle Demande'}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <div className="flex flex-wrap items-center mt-4 gap-8">
                                            {form.reference && (
                                                <span className={classes.refBadge}>#{form.reference}</span>
                                            )}
                                            <span className={clsx(classes.statusBadge, 
                                                isAutoValidated ? '!bg-purple-100 !text-purple-700 !border-purple-300' :
                                                form.statut === 1 ? classes.statusValidated : 
                                                form.statut === 2 ? classes.statusRejected : 
                                                classes.statusPending
                                            )}>
                                                {statusLabel}
                                            </span>
                                        </div>
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
                        <div className={classes.tabsRoot}>
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
                                classes={{ root: 'min-h-64', indicator: classes.tabsIndicator }}
                            >
                                <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>assignment</Icon>Général</span>} />
                                <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>attach_file</Icon>Documents {form?.attachements?.length > 0 && <span style={{ marginLeft: 8, background: '#E3342F', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 11 }}>{form.attachements.length}</span>}</span>} />
                                <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>person</Icon>Acheteur</span>} />
                                {form?.diffusionsdemandes?.length > 0 && <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>send</Icon>Diffusion</span>} />}
                                {demande?.fournisseurs?.length > 0 && !form.isAnonyme && <Tab classes={{ root: classes.tabRoot, selected: classes.tabSelected }} label={<span style={{ display: 'flex', alignItems: 'center' }}><Icon style={{ marginRight: 8, fontSize: 18 }}>people</Icon>Participants</span>} />}
                            </Tabs>
                        </div>
                    )
                }
                content={
                    <div className="p-16 sm:p-24 w-full" style={{ maxWidth: 1200, margin: '0 auto' }}>
                        <Formsy onValidSubmit={handleSubmit} onValid={() => setIsFormValid(true)} onInvalid={() => setIsFormValid(false)} ref={formRef}>

                            {/* ── TAB 0 : GÉNÉRAL ── */}
                            {tabValue === 0 && (
                                <div className={classes.twoColLayout}>

                                    {/* COLONNE GAUCHE (Formulaire Principal) */}
                                    <div className={classes.mainCol}>

                                        {/* Identification */}
                                        <Paper className={classes.premiumCard}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardIcon}>
                                                    <Icon>edit</Icon>
                                                </div>
                                                Identification du besoin
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                                                <div>
                                                    <TextFieldFormsy name="titre" label="Objet de la demande *" value={form.titre} variant="outlined" required fullWidth />
                                                </div>
                                                <div>
                                                    <TextFieldFormsy name="reference" label="Référence interne" value={form.reference} variant="outlined" disabled fullWidth />
                                                </div>
                                                <div>
                                                    <TextFieldFormsy name="budget" label="Budget estimatif (MAD)" value={form.budget !== undefined && form.budget !== null ? String(form.budget) : ''} type="number" variant="outlined" fullWidth className="font-bold text-lg" />
                                                </div>
                                                <div>
                                                    <DatePickerFormsy name="dateExpiration" value={form.dateExpiration} label="Fin de validité" format="DD/MM/YYYY" variant="outlined" fullWidth />
                                                </div>
                                            </div>
                                        </Paper>

                                        {/* Description */}
                                        <Paper className={classes.premiumCard}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardIcon} style={{ color: '#8b5cf6', backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                                                    <Icon>description</Icon>
                                                </div>
                                                Cahier des charges
                                            </div>
                                            <div className="flex flex-col gap-16">
                                                <TextFieldFormsy name="description" label="Spécifications techniques détaillées *" value={form.description} multiline rows={6} variant="outlined" required fullWidth />
                                                
                                                {form.autre_categories && (
                                                    <div className="mt-16">
                                                        <TextFieldFormsy name="autre_categories" label="Autres catégories spécifiées" value={form.autre_categories} variant="outlined" disabled fullWidth />
                                                    </div>
                                                )}
                                            </div>
                                        </Paper>

                                        {/* Catégories */}
                                        <Paper className={classes.premiumCard}>
                                            <div className={classes.cardHeader}>
                                                <div className={classes.cardIcon} style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                                    <Icon>layers</Icon>
                                                </div>
                                                Classification partenaires
                                            </div>
                                            <div className="flex flex-col gap-16">
                                                <Typography variant="body2" className="font-bold text-gray-dark block mb-4">Secteurs d'activités cibles *</Typography>
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
                                                            borderColor: '#cbd5e1',
                                                            borderRadius: 12,
                                                            paddingLeft: 4,
                                                            boxShadow: 'none',
                                                            '&:hover': { borderColor: '#3c50e0' }
                                                        }),
                                                        multiValue: (base) => ({
                                                            ...base,
                                                            backgroundColor: 'rgba(60, 80, 224, 0.08)',
                                                            color: '#3c50e0',
                                                            borderRadius: 8,
                                                            fontWeight: 600,
                                                        }),
                                                        multiValueLabel: (base) => ({
                                                            ...base,
                                                            color: '#3c50e0',
                                                            paddingLeft: 8,
                                                            paddingRight: 8,
                                                        }),
                                                        multiValueRemove: (base) => ({
                                                            ...base,
                                                            color: '#3c50e0',
                                                            borderRadius: '0 8px 8px 0',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(60, 80, 224, 0.15)',
                                                                color: '#3c50e0',
                                                            }
                                                        })
                                                    }}
                                                />
                                                {suggestions.length > 0 && (
                                                    <div className="mt-16 p-16 bg-slate-50 border border-slate-100 rounded-xl">
                                                        <Typography variant="caption" className="font-bold text-slate-500 mb-12 block uppercase tracking-wider">
                                                            Suggestions de l'acheteur
                                                        </Typography>
                                                        <div className="flex flex-wrap gap-8">
                                                            {suggestions.map((item, i) => (
                                                                <Chip key={i} label={item} onDelete={() => handleRemoveSuggestion(item)} size="small" className={classes.suggestionChip} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Paper>

                                    </div>

                                    {/* COLONNE DROITE — SIDEBAR */}
                                    <div className={classes.sidebar}>

                                        {/* Audit IA */}
                                        {report && (
                                            <div className={classes.auditCard} style={{
                                                background: report.score >= 80 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : report.score >= 60 ? 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                                                borderColor: report.score >= 80 ? '#bbf7d0' : report.score >= 60 ? '#fef08a' : '#fecaca',
                                            }}>
                                                <div className="flex justify-between items-center text-slate-800 font-extrabold uppercase text-13 mb-16 pb-8 border-b border-black/5">
                                                    <span className="flex items-center"><Icon className="mr-8 text-20 text-slate-700">verified_user</Icon> Analyse IA</span>
                                                    <span className="text-20 font-black text-slate-900">{report.score}%</span>
                                                </div>
                                                <div>
                                                    <LinearProgress variant="determinate" value={report.score} style={{ height: 6, borderRadius: 3, marginBottom: 16, background: 'rgba(0,0,0,0.06)' }} />
                                                    {report.alerts.map((alert, idx) => (
                                                        <div key={idx} className={classes.auditAlert}>
                                                            <Icon className={`text-18 mr-12 mt-2 flex-shrink-0 ${alert.type === 'CRITICAL' ? 'text-red' : 'text-orange'}`}>
                                                                {alert.type === 'CRITICAL' ? 'report' : 'warning_amber'}
                                                            </Icon>
                                                            <div className="min-w-0">
                                                                <Typography variant="body2" className="font-bold text-slate-800 leading-tight mb-2">{alert.message}</Typography>
                                                                <Typography variant="caption" className="font-semibold text-slate-500 uppercase tracking-tight">{alert.detail}</Typography>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Paramètres & Diffusion */}
                                        <Paper className={classes.premiumCard} style={{ padding: 20 }}>
                                            <div className={classes.cardHeader} style={{ marginBottom: 16, paddingBottom: 12 }}>
                                                <div className={classes.cardIcon} style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                                    <Icon>settings</Icon>
                                                </div>
                                                Paramètres & Options
                                            </div>
                                            <div>
                                                <div className={classes.optionRow}>
                                                    <CheckboxFormsy name="isPublic" value={!!form.isPublic} label={<span className="font-bold text-14 text-slate-700">Publié sur le portail</span>} />
                                                </div>
                                                <div className={classes.optionRow}>
                                                    <CheckboxFormsy name="isAnonyme" value={!!form.isAnonyme} label={<span className="font-bold text-14 text-slate-700">Client masqué</span>} />
                                                </div>
                                                <div className={classes.alertEmailBox}>
                                                    <CheckboxFormsy name="sendEmail" value={!!form.sendEmail} label={<span className="font-bold text-14 text-blue-darker">Alerter les Partenaires par e-mail</span>} />
                                                </div>
                                                
                                                <div className="mt-24 pt-16 border-t border-slate-100">
                                                    <Typography variant="caption" className="font-bold text-slate-400 flex items-center uppercase mb-12 tracking-wider">
                                                        <Icon className="text-16 mr-6 text-slate-400">public</Icon> Couverture Géographique
                                                    </Typography>
                                                    <RadioGroupFormsy name="localisation" onChange={handleRadioLocalisation} className="flex flex-col gap-4">
                                                        <FormControlLabel value="2" checked={isLocale} disabled control={<Radio size="small" color="primary" />} label={<span className="font-bold text-13 text-slate-700">Locale</span>} />
                                                        
                                                        <FormControlLabel value="3" checked={isInternationale} disabled control={<Radio size="small" color="primary" />} label={
                                                            <span className="font-bold text-13 text-slate-700">
                                                                Internationale
                                                                {Array.isArray(form.localisation) && form.localisation.some(code => typeof code === "string" && code.length === 2 && !zones.some(z => z.code === code)) && (
                                                                    <>
                                                                        {" ("}
                                                                        {form.localisation
                                                                            .filter(code => typeof code === "string" && code.length === 2 && !zones.some(z => z.code === code))
                                                                            .map((countryCode, index) => (
                                                                                <span key={countryCode || index} style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginRight: "6px" }}>
                                                                                    <img src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`} alt={countryCode} style={{ width: "16px", height: "11px", borderRadius: "2px" }} />
                                                                                    {countryCode}
                                                                                </span>
                                                                            ))}
                                                                        {")"}
                                                                    </>
                                                                )}
                                                                {Array.isArray(form.localisation) && form.localisation.includes("Tout le monde") && (
                                                                    <span> (Tout le monde)</span>
                                                                )}
                                                            </span>
                                                        } />
                                                        
                                                        <FormControlLabel value="4" checked={isZone} disabled control={<Radio size="small" color="primary" />} label={
                                                            <span className="font-bold text-13 text-slate-700">
                                                                Zone
                                                                {isZone && Array.isArray(form.localisation) && form.localisation[0] && (
                                                                    <span> - {getZoneName(form.localisation[0])}</span>
                                                                )}
                                                            </span>
                                                        } />
                                                    </RadioGroupFormsy>
                                                </div>
                                            </div>
                                        </Paper>

                                        {/* Décision Admin */}
                                        <div className={classes.decisionCard}>
                                            <div className="flex items-center text-blue-light font-extrabold uppercase text-13 mb-20">
                                                <Icon className="mr-8 text-20 text-blue-400">gavel</Icon>
                                                Décision Modérateur
                                            </div>
                                            <div>
                                                <div 
                                                    className={clsx(classes.decisionOption, form.statut === 1 && classes.decisionOptionActiveGreen)}
                                                    onClick={() => handleRadioChange({ target: { value: '1' } })}
                                                >
                                                    <Radio 
                                                        size="small" 
                                                        checked={form.statut === 1} 
                                                        value="1" 
                                                        onChange={handleRadioChange}
                                                        style={{ color: '#10b981', padding: 4 }} 
                                                    />
                                                    <span className="font-bold text-13 text-emerald-400 ml-4">Approuver & Diffuser</span>
                                                </div>
                                                <div 
                                                    className={clsx(classes.decisionOption, form.statut === 2 && classes.decisionOptionActiveRed)}
                                                    onClick={() => handleRadioChange({ target: { value: '2' } })}
                                                >
                                                    <Radio 
                                                        size="small" 
                                                        checked={form.statut === 2} 
                                                        value="2" 
                                                        onChange={handleRadioChange}
                                                        style={{ color: '#ef4444', padding: 4 }} 
                                                    />
                                                    <span className="font-bold text-13 text-rose-400 ml-4">Rejeter la demande</span>
                                                </div>
                                                
                                                {form.statut === 2 && demande.motifs && (
                                                    <div className="mb-16 mt-8">
                                                        <SelectReactFormsy
                                                            id="motifRejet"
                                                            name="motifRejet"
                                                            value={motif}
                                                            options={_.map(demande.motifs, item => ({ value: item['@id'], label: item.name }))}
                                                            textFieldProps={{
                                                                label: 'Raison du rejet',
                                                                variant: 'outlined',
                                                                InputLabelProps: { shrink: true, style: { color: 'rgba(255,255,255,0.7)' } },
                                                                style: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 8 }
                                                            }}
                                                            onChange={val => setMotif(val)}
                                                        />
                                                    </div>
                                                )}
                                                <Button
                                                    className={clsx(classes.submitBtn, "w-full mt-12")}
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={!isFormValid || demande.loading || !categories.length}
                                                >
                                                    {demande.loading ? <CircularProgress size={22} color="secondary" /> : 'Enregistrer'}
                                                </Button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* ── TAB 1 : DOCUMENTS ── */}
                            {tabValue === 1 && (
                                <Paper className={classes.premiumCard}>
                                    <div className={classes.cardHeader}>
                                        <div className={classes.cardIcon} style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                            <Icon>cloud_upload</Icon>
                                        </div>
                                        Documents Source de l'Acheteur
                                    </div>
                                    <div>
                                        <Typography className="text-slate-500 mb-20 text-14">Fichiers techniques et appels d'offres originaux.</Typography>
                                        <div className="flex flex-wrap gap-16">
                                            {form.attachements?.length < 5 && (
                                                <div className="mb-8">
                                                    <label htmlFor="button-file" className="w-128 h-128 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-blue transition-all duration-200">
                                                        <input accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" id="button-file" type="file" onChange={handleUploadChange} />
                                                        <Icon className="text-32 text-slate-400 mb-8">add_circle_outline</Icon>
                                                        <Typography variant="caption" className="font-bold text-slate-500 uppercase tracking-wider">Ajouter</Typography>
                                                    </label>
                                                </div>
                                            )}
                                            {form.attachements?.map(media => (
                                                <div key={media.id} className="mb-8">
                                                    <div className="w-128 h-128 rounded-xl relative border border-slate-100 overflow-hidden bg-slate-50 group shadow-sm hover:shadow-md transition-all duration-200">
                                                        <IconButton size="small" className="absolute top-0 right-0 z-10 m-6 bg-white/80 backdrop-blur hover:bg-rose-500 hover:text-white transition-colors" 
                                                            style={{ padding: 4 }}
                                                            onClick={() => dispatch(Actions.deleteMedia(media))}>
                                                            <Icon className="text-16">delete</Icon>
                                                        </IconButton>
                                                        <div className="w-full h-full flex items-center justify-center cursor-pointer"
                                                            onClick={() => window.open(URL_SITE + '/attachement/demandeAchat/' + media.url, '_blank')}>
                                                            {media.type?.startsWith('image')
                                                                ? <img className="object-cover w-full h-full" src={URL_SITE + '/attachement/demandeAchat/' + media.url} alt="media" />
                                                                : <div className="text-center p-12">
                                                                    <Icon className="text-40 text-slate-400 block mb-6 mx-auto">insert_drive_file</Icon>
                                                                    <Typography variant="caption" className="font-bold text-slate-600 truncate block max-w-full px-4">{media.name || 'Document'}</Typography>
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
                                <div className="max-w-4xl mx-auto space-y-24">
                                    <Paper className={classes.premiumCard}>
                                        <div className={classes.cardHeader} style={{ color: '#10b981', borderBottomColor: 'rgba(16, 185, 129, 0.15)' }}>
                                            <div className={classes.cardIcon} style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                                <Icon>person</Icon>
                                            </div>
                                            Contact Privé — Acheteur
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
                                            <div>
                                                <TextField label="Nom complet" value={`${acheteur.user?.first_name || acheteur.first_name || ''} ${acheteur.user?.last_name || acheteur.last_name || ''}`.trim()} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">person</Icon> }} />
                                            </div>
                                            <div>
                                                <TextField label="Adresse Email" value={acheteur.user?.email || acheteur.email || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">email</Icon> }} />
                                            </div>
                                            <div>
                                                <TextField label="N° Téléphone" value={acheteur.user?.phone || acheteur.phone || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">phone</Icon> }} />
                                            </div>
                                        </div>
                                    </Paper>
                                    <Paper className={classes.premiumCard}>
                                        <div className={classes.cardHeader}>
                                            <div className={classes.cardIcon}>
                                                <Icon>business</Icon>
                                            </div>
                                            Données de l'Entreprise
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-24">
                                            <div className="md:col-span-2">
                                                <TextField label="Société" value={acheteur.societe || acheteur.nom_entreprise || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">business</Icon> }} />
                                            </div>
                                            <div>
                                                <TextField label="ICE / Id Fiscal" value={acheteur.ice || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">vpn_key</Icon> }} />
                                            </div>
                                            <div>
                                                <TextField label="Secteur" value={acheteur.secteur?.name || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">category</Icon> }} />
                                            </div>

                                            <div>
                                                <TextField label="Téléphone Fixe" value={acheteur.fix || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">settings_phone</Icon> }} />
                                            </div>
                                            <div className="md:col-span-3">
                                                <TextField label="Site Web" value={acheteur.website || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">language</Icon> }} />
                                            </div>
                                            
                                            <div className="md:col-span-2">
                                                <TextField label="Adresse 1" value={acheteur.user?.adresse1 || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">location_on</Icon> }} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <TextField label="Adresse 2" value={acheteur.user?.adresse2 || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">location_on</Icon> }} />
                                            </div>

                                            <div>
                                                <TextField label="Pays" value={acheteur.pays?.name || 'N/C'} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">flag</Icon> }} />
                                            </div>
                                            <div>
                                                <TextField label="Ville" value={acheteur.ville?.name || acheteur.autre_ville || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">location_city</Icon> }} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <TextField label="Code Postal" value={acheteur.user?.codepostal || ''} fullWidth variant="outlined" InputProps={{ readOnly: true, startAdornment: <Icon className="mr-8 text-slate-400">mail_outline</Icon> }} />
                                            </div>

                                            <div className="md:col-span-4">
                                                <TextField label="Présentation" value={acheteur.description || 'Aucune description fournie.'} fullWidth multiline rows={3} variant="outlined" InputProps={{ readOnly: true }} />
                                            </div>
                                        </div>
                                    </Paper>
                                </div>
                            )}

                            {/* ── TAB 3 & 4 : DIFFUSION / PARTICIPANTS ── */}
                            {(tabValue === 3 || tabValue === 4) && (
                                <Paper className={classes.premiumCard}>
                                    <div className={classes.cardHeader}>
                                        <div className={classes.cardIcon} style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                            <Icon>{tabValue === 3 ? 'send' : 'groups'}</Icon>
                                        </div>
                                        {tabValue === 3 ? 'Historique de Diffusion' : 'Réponses Fournisseurs'}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <ReactTable
                                            data={tabValue === 3 ? form.diffusionsdemandes : demande.fournisseurs}
                                            columns={[
                                                { Header: "Société", id: "societe", accessor: f => f.fournisseur?.societe || 'N/C', className: "font-bold text-slate-800" },
                                                { Header: "Contact", id: "contact", accessor: f => `${f.fournisseur?.firstName || ''} ${f.fournisseur?.lastName || ''}` },
                                                { Header: "Email", id: "email", accessor: f => f.fournisseur?.email || '' },
                                                { Header: "Date", id: "date", accessor: d => moment(d.dateDiffusion || d.created).format('DD/MM/YYYY HH:mm'), className: "font-bold text-blue-600" }
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
