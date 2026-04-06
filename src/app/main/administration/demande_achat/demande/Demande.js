import React, { useRef, useEffect, useState } from 'react';
import { Button, Tab, Tabs, InputAdornment, Icon, Typography, LinearProgress, Popper, Chip, Grid, CircularProgress, IconButton, Tooltip, FormControlLabel, Radio, MenuItem, ListItemText, DialogTitle, DialogContent, DialogActions, DialogContentText, Divider } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy, DatePickerFormsy, CheckboxFormsy, RadioGroupFormsy, SelectReactFormsy } from '@fuse';
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
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Highlighter from "react-highlight-words";
import SuggestionDialog from './SuggestionDialog';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    chip2: {
        marginLeft: theme.spacing(1),
        padding: 2,
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20
    },
    chipOrange: {
        marginLeft: theme.spacing(1),
        padding: 2,
        background: '#ff9800',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20

    },
    chips: {
        flex: 1,
        display: 'flex',
        flexWrap: 'wrap',
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    demandeImageFeaturedStar: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: red[400],
        opacity: 0
    },
    demandeImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    select: {
        zIndex: 999,
    },
    demandeImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $demandeImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $demandeImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $demandeImageFeaturedStar': {
                opacity: 1
            }
        }
    }
}));
moment.defaultFormat = "DD/MM/YYYY HH:mm";
function renderSuggestion(suggestion, { query, isHighlighted }) {
    return (

        <MenuItem selected={isHighlighted} component="div" className="z-999" dense={true}>
            <ListItemText
                className="pl-0 "
                primary={
                    <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[query]}
                        autoEscape={true}
                        textToHighlight={suggestion.name}
                    />
                }
            />
        </MenuItem>

    );

}
function renderInputComponent(inputProps) {
    const { classes, inputRef = () => { }, ref, ...other } = inputProps;
    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}

function Demande(props) {
    const suggestionsNode = useRef(null);
    const popperNode = useRef(null);
    const searchCategories = useSelector(({ demandesAdminApp }) => demandesAdminApp.searchCategories);
    const [categories, setCategories] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const dispatch = useDispatch();
    const demande = useSelector(({ demandesAdminApp }) => demandesAdminApp.demande);

    const [isFormValid, setIsFormValid] = useState(false);
    const [showDiffusion, setShowDiffusion] = useState(false);
    const formRef = useRef(null);
    const { form, handleChange, setForm } = useForm();

    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);
    const [sousSecteurs] = useState(null);
    const [motif, setMotif] = useState(null);
    const params = props.match.params;
    const { demandeId } = params;
    useEffect(() => {
        function updateDemandeState() {
            if (demandeId === 'new') {
                dispatch(Actions.newDemande());
            }
            else {
                dispatch(Actions.getDemande(demandeId));
                dispatch(Actions.getFournisseurParticipe(demandeId));
            }
            dispatch(Actions.getMotifs());
            dispatch(Actions.getSecteurs());
        }

        updateDemandeState();
        return () => {
            dispatch(Actions.cleanUpDemande())
        }
    }, [dispatch, demandeId]);


    useEffect(() => {

        if (demande.attachement) {
            setForm(_.set({ ...form }, 'attachements', [
                demande.attachement,
                ...form.attachements
            ]));
            demande.attachement = null;
        }

    }, [demande.attachement, form, setForm]);


    useEffect(() => {
        if (demande.error && (demande.error.reference || demande.error.statut || demande.error.motifRejet || demande.error.description || demande.error.dateExpiration || demande.error.isPublic || demande.error.isAnonyme || demande.error.sousSecteurs || demande.error.budget)) {

            formRef.current.updateInputsWithError({
                ...demande.error
            });

            disableButton();
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
        if (
            (demande.data && !form) ||
            (demande.data && form && demande.data.id !== form.id)
        ) {

            if (demande.data.categories) {
                setCategories(demande.data.categories.map(item => item));
            }
            if (demande.data.motifRejet)
                setMotif({
                    value: demande.data.motifRejet['@id'],
                    label: demande.data.motifRejet.name,
                });
            if (demande.data.autreCategories) {
                setSuggestions(_.split(demande.data.autreCategories, ','))
            }
            setForm({ ...demande.data });

        }
    }, [form, demande.data, setForm]);

    useEffect(() => {
        if (demande.produit) {
            setCategories([...categories, demande.produit]);
            setSuggestions(_.reject(suggestions, function (i) { return i === demande.produit.name }))
        }
    }, [demande.produit, categories, suggestions]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleUploadChange(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        dispatch(Actions.uploadAttachement(file));
    }

    function handleDateChange(value, name) {
        setForm(_.set({ ...form }, name, moment(value).format('YYYY-MM-DDTHH:mm:ssZ')));
    }

    function handleChipChange2(value, name) {
        setForm(_.set({ ...form }, name, value));
        setMotif(value)
    }

    function handleRadioChange(e) {
        if (parseInt(e.target.value) === 2) {
            form.isPublic = false;
        }
        setForm(_.set({ ...form }, 'statut', parseInt(e.target.value)));

    }
    function handleRadioLocalisation(e) {

        setForm(_.set({ ...form }, 'localisation', parseInt(e.target.value)));
    }
    function handleCheckBoxChange(e, name) {

        setForm(_.set({ ...form }, name, e.target.checked));
    }

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }


    function handleChangeSearch(event) {
        dispatch(Actions.setGlobalSearchText(event))
    }
    function showSearch() {
        dispatch(Actions.showSearch());
        document.addEventListener("keydown", escFunction, false);
    }

    function escFunction(event) {
        if (event.keyCode === 27) {
            hideSearch();
            dispatch(Actions.cleanUp());
        }

    }

    function hideSearch() {
        dispatch(Actions.hideSearch());
        document.removeEventListener("keydown", escFunction, false);

    }


    function handleSuggestionsFetchRequested({ value, reason }) {

        if (reason === 'input-changed') {
            value && value.trim().length > 1 && dispatch(Actions.loadSuggestions(value.trim()));
            // Fake an AJAX call
        }

    }
    function handleSuggestionsClearRequested() {
        //dispatch(Actions.hideSearch());

    }
    const autosuggestProps = {
        renderInputComponent,
        //alwaysRenderSuggestions: true,
        suggestions: searchCategories.suggestions,
        focusInputOnSuggestionClick: false,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        renderSuggestion
    };

    function handleDelete(id) {
        setCategories(_.reject(categories, function (o) { return o.id === id; }))
    }
    function handleDeleteSuggestion(item) {
        setSuggestions(_.reject(suggestions, function (i) { return i === item }))

    }

    function handleSubmit() {
        dispatch(Actions.putDemande(form, sousSecteurs, suggestions, motif, form.id, props.history, categories));
    }

    return (
        <>
            <FusePageCarded
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    !demande.loading
                        ?

                        form && (
                            <div className="flex flex-1 w-full items-center justify-between">

                                <div className="flex flex-col items-start max-w-full">

                                    <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                        <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/demandes_admin" color="inherit">
                                            <Icon className="mr-4 text-20">arrow_back</Icon>
                                            Retour
                                        </Typography>
                                    </FuseAnimate>

                                    <div className="flex items-center max-w-full">

                                        <div className="flex flex-col min-w-0">
                                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                <Typography className="text-16 sm:text-20 truncate">
                                                    {form.titre ? form.titre : 'Nouvelle Demande'}
                                                </Typography>
                                            </FuseAnimate>
                                            {form.reference &&
                                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                    <Typography variant="caption">RFQ-{form.reference}</Typography>
                                                </FuseAnimate>
                                            }

                                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                <Typography variant="caption">Détails de la demande</Typography>
                                            </FuseAnimate>
                                        </div>
                                    </div>
                                </div>
                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        type="submit"
                                        disabled={!isFormValid || demande.loading || !categories.length}
                                        onClick={() => handleSubmit()}
                                    >
                                        Sauvegarder
                                        {demande.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </Button>
                                </FuseAnimate>

                            </div>
                        )
                        :
                        ''
                }
                contentToolbar={
                    demande.loading ?
                        <div className={classes.root}>
                            <LinearProgress color="secondary" />
                        </div>
                        :
                        <Tabs
                            value={tabValue}
                            onChange={handleChangeTab}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                            classes={{ root: "w-full h-64" }}
                        >
                            <Tab className="h-64 normal-case" label="Infos générales" />
                            <Tab className="h-64 normal-case"
                                label={
                                    form && form.attachements && form.attachements.length > 0
                                        ? "Pièce(s) jointe(s) (" + form.attachements.length + ")"
                                        : "Pièce(s) jointe(s)"}
                            />
                            <Tab className="h-64 normal-case" label="Infos Acheteur" />

                            {form && form.diffusionsdemandes && form.diffusionsdemandes.length > 0 ?
                                <Tab className="h-64 normal-case" label={"Diffuser (" + form.diffusionsdemandes.length + " fois)"} />
                                : ''}
                            {demande && demande.fournisseurs && demande.fournisseurs.length > 0 && demande.data && !demande.data.isAnonyme ?
                                <Tab className={clsx("h-64 normal-case text-orange", demande.data.statut === 3 ? "text-green" : "text-orange")} label=
                                    {
                                        demande.data && demande.data.statut === 3 ?
                                            'Adjugée' :
                                            (demande.fournisseurs ? demande.fournisseurs.length : 0) + " fournisseur(s) participant(s)"
                                    } />
                                : ''}

                        </Tabs>

                }
                content={
                    !demande.loading ?

                        form && (
                            <div className="p-10  sm:p-24 max-w-2xl">
                                {tabValue === 0 &&
                                    (
                                        <Formsy
                                            onValidSubmit={handleSubmit}
                                            onValid={enableButton}
                                            onInvalid={disableButton}
                                            ref={formRef}
                                            className="flex pt-10 flex-col ">
                                            <Grid container spacing={3} >
                                                <Grid item xs={12} sm={8}>
                                                    <TextFieldFormsy
                                                        className="mb-24"
                                                        label="Designation"
                                                        autoFocus
                                                        id="titre"
                                                        name="titre"
                                                        value={form.titre}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        validations={{
                                                            minLength: 4,
                                                            maxLength: 255,
                                                        }}
                                                        validationErrors={{
                                                            minLength: 'Min character length is 4',
                                                            maxLength: 'Max character length is 255'
                                                        }}
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <TextFieldFormsy
                                                        className="mb-24"
                                                        label="Référence"
                                                        id="reference"
                                                        name="reference"
                                                        value={form.reference ? form.reference : 'En attente'}
                                                        variant="outlined"
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">RFQ-</InputAdornment>,
                                                        }}
                                                        disabled
                                                        fullWidth
                                                    />
                                                </Grid>


                                            </Grid>
                                            <Grid container spacing={3} >

                                                <Grid item xs={12} sm={6}>


                                                    <DatePickerFormsy
                                                        className="mb-24"
                                                        label="Date d'expiration"
                                                        id="dateExpiration"
                                                        name="dateExpiration"
                                                        value={form.dateExpiration}
                                                        onChange={(value) => handleDateChange(value, 'dateExpiration')}
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <TextFieldFormsy
                                                        className="mb-24"
                                                        label="Budget"
                                                        id="budget"
                                                        type="number"
                                                        name="budget"
                                                        value={_.toString(form.budget)}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        validations={{
                                                            isNumeric: true,
                                                        }}
                                                        validationErrors={{
                                                            isNumeric: 'Numeric value required',
                                                        }}
                                                        step='any'
                                                        required
                                                        fullWidth
                                                    />
                                                </Grid>
                                            </Grid>

                                            <div ref={popperNode} >
                                                <Autosuggest
                                                    {...autosuggestProps}
                                                    getSuggestionValue={suggestion => searchCategories.searchText}
                                                    onSuggestionSelected={(event, { suggestion, method }) => {
                                                        if (method === "enter") {
                                                            event.preventDefault();
                                                        }
                                                        !_.find(categories, ['name', suggestion.name]) &&
                                                            setCategories([suggestion, ...categories]);
                                                        //setForm(_.set({ ...form }, 'categories', suggestion['@id']))
                                                        //hideSearch();
                                                        popperNode.current.focus();
                                                    }}
                                                    required
                                                    inputProps={{
                                                        classes,
                                                        label: 'Activités',
                                                        placeholder: "Activité (ex: Rayonnage lourd)",
                                                        value: searchCategories.searchText,
                                                        variant: "outlined",
                                                        name: "categories",
                                                        onChange: handleChangeSearch,
                                                        onFocus: showSearch,
                                                        InputLabelProps: {
                                                            shrink: true,
                                                        }

                                                    }}
                                                    theme={{
                                                        container: classes.container,
                                                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                                        suggestionsList: classes.suggestionsList,
                                                        suggestion: classes.suggestion,
                                                    }}
                                                    renderSuggestionsContainer={options => (
                                                        <Popper
                                                            anchorEl={popperNode.current}
                                                            open={Boolean(options.children) || searchCategories.noSuggestions || searchCategories.loading}
                                                            popperOptions={{ positionFixed: true }}
                                                            className="z-9999 mb-8"
                                                        >
                                                            <div ref={suggestionsNode}>
                                                                <Paper
                                                                    elevation={1}
                                                                    square
                                                                    {...options.containerProps}
                                                                    style={{ width: popperNode.current ? popperNode.current.clientWidth : null }}
                                                                >
                                                                    {options.children}
                                                                    {searchCategories.noSuggestions && (
                                                                        <Typography className="px-16 py-12">
                                                                            Aucun résultat..
                                                                        </Typography>
                                                                    )}
                                                                    {searchCategories.loading && (
                                                                        <div className="px-16 py-12 text-center">
                                                                            <CircularProgress color="secondary" /> <br /> Chargement ...
                                                                        </div>
                                                                    )}
                                                                </Paper>
                                                            </div>
                                                        </Popper>
                                                    )}
                                                />
                                            </div>
                                            <div className={clsx(classes.chips)}>
                                                {
                                                    categories && categories.length > 0 &&
                                                    categories.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={item.name}
                                                            onDelete={(ev) => {
                                                                ev.stopPropagation();
                                                                dispatch(Actions.openDialog({
                                                                    children: (
                                                                        <React.Fragment>
                                                                            <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                                            <DialogContent>
                                                                                <DialogContentText id="alert-dialog-description">
                                                                                    Voulez vous vraiment supprimer ce produit ?
                                                                                </DialogContentText>
                                                                            </DialogContent>
                                                                            <DialogActions>
                                                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                                                    Non
                                                                                </Button>
                                                                                <Button onClick={(ev) => {
                                                                                    handleDelete(item.id);
                                                                                    dispatch(Actions.closeDialog())
                                                                                }} color="primary" autoFocus>
                                                                                    Oui
                                                                                </Button>

                                                                            </DialogActions>
                                                                        </React.Fragment>
                                                                    )
                                                                }))
                                                            }}
                                                            className="mt-8 mr-8"
                                                        />
                                                    ))
                                                }
                                                {
                                                    suggestions && suggestions.length > 0 &&
                                                    suggestions.map((item, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={'Suggestion : ' + item}
                                                            color="secondary"
                                                            onClick={(ev) => {
                                                                dispatch(Actions.openSuggestionDialog({ name: item }))
                                                            }}
                                                            onDelete={(ev) => {
                                                                ev.stopPropagation();
                                                                dispatch(Actions.openDialog({
                                                                    children: (
                                                                        <React.Fragment>
                                                                            <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                                            <DialogContent>
                                                                                <DialogContentText id="alert-dialog-description">
                                                                                    Voulez vous vraiment supprimer cette suggestion ?
                                                                                </DialogContentText>
                                                                            </DialogContent>
                                                                            <DialogActions>
                                                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                                                    Non
                                                                                </Button>
                                                                                <Button onClick={(ev) => {
                                                                                    handleDeleteSuggestion(item);
                                                                                    dispatch(Actions.closeDialog())
                                                                                }} color="primary" autoFocus>
                                                                                    Oui
                                                                                </Button>

                                                                            </DialogActions>
                                                                        </React.Fragment>
                                                                    )
                                                                }))
                                                            }}
                                                            className="mt-8 mr-8"
                                                        />
                                                    ))


                                                }
                                            </div>



                                            <TextFieldFormsy
                                                className="mb-16 mt-16  w-full"
                                                type="text"
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                label="Description"
                                                autoComplete="description"
                                                validations={{
                                                    minLength: 10,
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 10',
                                                }}

                                                variant="outlined"
                                                multiline
                                                rows="4"
                                                required

                                            />


                                            <Grid container spacing={3} >

                                                <Grid item xs={12} sm={3}>

                                                    <RadioGroupFormsy
                                                        className="inline"
                                                        name="statut"
                                                        onChange={handleRadioChange}
                                                    >
                                                        <FormControlLabel value="1" checked={form.statut === 1} control={<Radio />} label="Valider" />
                                                        <FormControlLabel disabled={form.reference !== null} value="2" checked={form.statut === 2} control={<Radio />} label="Rejeter" />

                                                    </RadioGroupFormsy>

                                                </Grid>
                                                <Grid item xs={12} sm={3} className="flex flex-col">
                                                    <CheckboxFormsy
                                                        name="sendEmail"
                                                        disabled={form.statut !== 1 || !form.isPublic}
                                                        onChange={(e) => handleCheckBoxChange(e, 'sendEmail')}
                                                        label={"Alerter Fournisseurs"}
                                                        value={form.sendEmail}
                                                    />
                                                    {
                                                        form.diffusionsdemandes.length && <span style={{ color: 'red' }}> ( déjà diffusée ) </span>
                                                    }
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <CheckboxFormsy
                                                        name="isPublic"
                                                        value={form.isPublic}
                                                        disabled={form.statut === 2}
                                                        onChange={(e) => handleCheckBoxChange(e, 'isPublic')}
                                                        label="Mettre en ligne"
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={3}>
                                                    <CheckboxFormsy
                                                        disabled={form.statut !== 1}
                                                        name="isAnonyme"
                                                        value={form.isAnonyme}
                                                        onChange={(e) => handleCheckBoxChange(e, 'isAnonyme')}
                                                        label="Mettre la demande anonyme"
                                                    />
                                                </Grid>
                                                {(form.statut === 2 || form.motifRejet)
                                                    ?
                                                    <Grid item xs={12}>
                                                        <SelectReactFormsy

                                                            id="motifRejet"
                                                            name="motifRejet"
                                                            className="MuiFormControl-fullWidth MuiTextField-root"
                                                            value={

                                                                motif


                                                            }
                                                            onChange={(value) => handleChipChange2(value, 'motifRejet')}
                                                            placeholder="Sélectionner le motif du rejet"
                                                            textFieldProps={{
                                                                label: 'Motif du rejet',
                                                                InputLabelProps: {
                                                                    shrink: true
                                                                },
                                                                variant: 'outlined'
                                                            }}
                                                            options={demande.motifs}
                                                            fullWidth
                                                            required
                                                        />
                                                    </Grid>
                                                    :
                                                    ''}
                                                <Grid item xs={12} sm={6} className="flex items-center">
                                                    <RadioGroupFormsy
                                                        className="inline"
                                                        name="statut"
                                                        label="Diffuser à l'échelle"
                                                        onChange={handleRadioLocalisation}
                                                    >
                                                        <FormControlLabel value="2" disabled={!showDiffusion} checked={form.localisation === 2} control={<Radio />} label="Locale" />
                                                        <FormControlLabel value="3" disabled={!showDiffusion} checked={form.localisation === 3} control={<Radio />} label="Internationale" />
                                                        <FormControlLabel value="1" disabled={!showDiffusion} checked={form.localisation === 1} control={<Radio />} label="Les deux" />


                                                    </RadioGroupFormsy>
                                                    <IconButton onClick={() => setShowDiffusion(!showDiffusion)}>
                                                        <Icon color="secondary">
                                                            {
                                                                showDiffusion ? 'visibility_off' : 'visibility'
                                                            }
                                                        </Icon>
                                                    </IconButton>
                                                </Grid>

                                                <Grid item sm={6} xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="secondary"
                                                        className="w-200 pr-auto mt-16 normal-case"
                                                        aria-label="Suivant"
                                                        disabled={!isFormValid || demande.loading}
                                                        value="legacy"
                                                    >
                                                        Sauvegarder
                                                        {demande.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                    </Button>
                                                </Grid>

                                            </Grid>


                                        </Formsy>
                                    )}
                                {tabValue === 1 && (
                                    <div>
                                        <input
                                            accept="text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,image/jpeg,image/gif,image/png,application/pdf,"
                                            className="hidden"
                                            id="button-file"
                                            type="file"
                                            disabled={demande.attachementReqInProgress}
                                            onChange={handleUploadChange}
                                        />
                                        <div className="flex justify-center sm:justify-start flex-wrap">
                                            <label
                                                htmlFor="button-file"

                                                className={
                                                    clsx(
                                                        classes.demandeImageUpload,
                                                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                                                        (form.attachements.length === 5) && 'hidden'
                                                    )}
                                            >
                                                {
                                                    demande.attachementReqInProgress ?
                                                        <CircularProgress size={24} className={classes.buttonProgress} />
                                                        :
                                                        <Icon fontSize="large" color="action">arrow_upward</Icon>

                                                }
                                            </label>


                                            {form.attachements && form.attachements.map(media => (
                                                <div
                                                    className={
                                                        clsx(
                                                            classes.demandeImageItem,
                                                            "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5")
                                                    }
                                                    key={media.id}
                                                    onClick={() => window.open(URL_SITE + media.url, "_blank")}
                                                >
                                                    <Tooltip title="Supprimer" >
                                                        <IconButton
                                                            className="text-red text-20"
                                                            onClick={(ev) => {
                                                                ev.stopPropagation();
                                                                dispatch(
                                                                    Actions.openDialog({
                                                                        children: (
                                                                            <>
                                                                                <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                                                <DialogContent>
                                                                                    <DialogContentText id="alert-dialog-description">
                                                                                        Voulez-vous vraiment supprimer ce média ?
                                                                                    </DialogContentText>
                                                                                </DialogContent>
                                                                                <DialogActions>
                                                                                    <Button
                                                                                        variant="contained"
                                                                                        onClick={() => dispatch(Actions.closeDialog())}
                                                                                        color="primary"
                                                                                    >
                                                                                        Non
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={() => {
                                                                                            dispatch(Actions.deleteMedia(media));
                                                                                            dispatch(Actions.closeDialog());
                                                                                        }}
                                                                                        color="primary"
                                                                                        autoFocus
                                                                                    >
                                                                                        Oui
                                                                                    </Button>
                                                                                </DialogActions>
                                                                            </>
                                                                        ),
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            <Icon>delete</Icon>
                                                        </IconButton>
                                                    </Tooltip>

                                                    {_.split(media.type, '/', 1)[0] === 'image' ?
                                                        <img className="max-w-none w-auto h-full"
                                                            src={URL_SITE + media.url}
                                                            alt="demande" />
                                                        :
                                                        <Icon color="secondary" style={{ fontSize: 80 }}>insert_drive_file</Icon>
                                                    }
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}
                                {tabValue === 2 && (
                                    <Formsy
                                        className="flex flex-col">

                                        <Grid container spacing={3} className="mb-5">

                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="fullname"
                                                        value={form.acheteur.civilite + ' ' + form.acheteur.firstName + ' ' + form.acheteur.lastName}
                                                        label="Nom complet"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        name="email"
                                                        value={form.acheteur.email}
                                                        label="Email"
                                                        fullWidth
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>

                                                        }}

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextFieldFormsy
                                                    className=""
                                                    type="text"
                                                    name="phonep"
                                                    id="phonep"
                                                    value={form.acheteur.phone}
                                                    label="Téléphone"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>

                                        </Grid>
                                        <Divider />
                                        <Grid container spacing={3} className="mb-5">

                                            <Grid item xs={12} sm={8}>
                                                <div className="flex">

                                                    <TextFieldFormsy
                                                        className="mt-20"
                                                        label="Raison sociale"
                                                        id="societe"
                                                        name="societe"
                                                        value={form.acheteur.societe}
                                                        fullWidth
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                    />
                                                </div>


                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className="mt-20"
                                                        name="fix"
                                                        value={form.acheteur.fix}
                                                        label="Fixe"
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                        }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>


                                                <TextFieldFormsy
                                                    id="secteur"
                                                    className=""
                                                    name="secteur"
                                                    label="Secteur"
                                                    value={form.acheteur.secteur ? form.acheteur.secteur.name : ''}
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />


                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        id="website"
                                                        className=""
                                                        type="text"
                                                        name="website"
                                                        value={form.acheteur.website}
                                                        label="Site Web"
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">language</Icon></InputAdornment>
                                                        }}
                                                        fullWidth
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <div className="flex">
                                                    {
                                                        form.acheteur.ice ?
                                                            <TextFieldFormsy
                                                                className=""
                                                                type="text"
                                                                name="ice"
                                                                id="ice"
                                                                value={form.acheteur.ice}
                                                                label="ICE"
                                                                fullWidth
                                                                InputProps={{
                                                                    readOnly: true,
                                                                }}
                                                            />
                                                            :
                                                            ''
                                                    }

                                                </div>

                                            </Grid>


                                        </Grid>
                                        <Divider />


                                        <Grid container spacing={3} className="mb-5">

                                            <Grid item xs={12} sm={8}>
                                                <div className="flex">

                                                    <TextFieldFormsy
                                                        className="mt-20"
                                                        type="text"
                                                        name="adresse1"
                                                        id="adresse1"
                                                        value={form.acheteur.adresse1}
                                                        label="Adresse 1"
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                        }}
                                                        fullWidth

                                                    />
                                                </div>

                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextFieldFormsy
                                                    className="mt-20"
                                                    type="text"
                                                    name="pays"
                                                    id="pays"
                                                    value={form.acheteur.pays ? form.acheteur.pays.name : ''}
                                                    label="Pays"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="adresse2"
                                                        value={form.acheteur.adresse2}
                                                        label="Adresse 2"
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                        }}
                                                        fullWidth

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        name="codepostal"
                                                        value={String(form.acheteur.codepostal)}
                                                        label="Code Postal"
                                                        fullWidth
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <TextFieldFormsy
                                                    className=""
                                                    type="text"
                                                    name="ville"
                                                    id="ville"
                                                    value={form.acheteur.ville ? form.acheteur.ville.name : ''}
                                                    label="Ville"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>

                                        </Grid>
                                        <Divider />

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={12}>

                                                <TextFieldFormsy
                                                    className="mb-5 mt-20  w-full"
                                                    type="text"
                                                    name="description"
                                                    value={form.acheteur.description}
                                                    label="Présentation"
                                                    multiline
                                                    rows="8"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}

                                                />

                                            </Grid>

                                        </Grid>
                                    </Formsy>
                                )
                                }
                                {tabValue === 3 && (
                                    <div className="w-full flex flex-col">

                                        <FuseAnimate animation="transition.slideUpIn" delay={300}>
                                            <ReactTable
                                                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                                data={form.diffusionsdemandes}
                                                columns={[
                                                    {
                                                        Header: "Code frs",
                                                        className: "font-bold",
                                                        id: "codeClient",
                                                        accessor: f => f.fournisseur.codeClient
                                                    },
                                                    {
                                                        Header: "Société",
                                                        className: "font-bold",
                                                        id: "fournisseur",
                                                        accessor: f => <Link target="_blank" to={'/users/fournisseurs/' + f.fournisseur.id}> {f.fournisseur.societe}</Link>,
                                                    },
                                                    {
                                                        Header: "NOM & Prénom",
                                                        id: "fz",
                                                        accessor: f => f.fournisseur.firstName + ' ' + f.fournisseur.lastName,
                                                    },
                                                    {
                                                        Header: "Téléphone",
                                                        id: "fs",
                                                        accessor: f => f.fournisseur.phone,
                                                    },
                                                    {
                                                        Header: "Email",
                                                        id: "fe",
                                                        accessor: f => f.fournisseur.email,
                                                    },
                                                    {
                                                        Header: "Date de diffusion",
                                                        id: "dateDiffusion",
                                                        accessor: d => moment(d.dateDiffusion).format('DD/MM/YYYY HH:mm'),
                                                    },
                                                ]}
                                                defaultPageSize={10}
                                                ofText='sur'
                                            />
                                        </FuseAnimate>




                                    </div>
                                )}
                                {tabValue === 4 && (
                                    <div className="w-full flex flex-col">
                                        {
                                            <div>


                                                <div className="flex flex-1 items-center justify-between mb-10">
                                                    <Typography variant="h6" className={clsx("mb-8 ml-2", classes.titre)}>
                                                        Fournisseurs participants ( {demande.fournisseurs.length} )
                                                    </Typography>

                                                    <div>
                                                        {
                                                            demande.data && demande.data.statut === 3 ?
                                                                <Chip className={classes.chip2} label={'Adjugée par : ' + (demande.data.fournisseurGagne ? demande.data.fournisseurGagne.societe : "Fournisseur hors site")} />
                                                                :
                                                                <Chip className={classes.chipOrange} label='En cours' />
                                                        }

                                                    </div>

                                                </div>
                                                <ReactTable
                                                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                                    data={demande.fournisseurs}

                                                    columns={[


                                                        {
                                                            Header: "Code frs",
                                                            className: "font-bold",
                                                            id: "codeClient",
                                                            accessor: f => f.fournisseur.codeClient
                                                        },
                                                        {
                                                            Header: "Société",
                                                            className: "font-bold",
                                                            id: "fournisseur",
                                                            accessor: f => <Link target="_blank" to={'/users/fournisseurs/' + f.fournisseur.id}> {f.fournisseur.societe}</Link>,
                                                        },
                                                        {
                                                            Header: "NOM & Prénom",
                                                            id: "fz",
                                                            accessor: f => f.fournisseur.firstName + ' ' + f.fournisseur.lastName,
                                                        },
                                                        {
                                                            Header: "Téléphone",
                                                            id: "fs",
                                                            accessor: f => f.fournisseur.phone,
                                                        },
                                                        {
                                                            Header: "Email",
                                                            id: "fe",
                                                            accessor: f => f.fournisseur.email,
                                                        },
                                                        {
                                                            Header: "Date",
                                                            id: "dateDiffusion",
                                                            accessor: d => moment(d.created).format('DD/MM/YYYY HH:mm'),
                                                        },


                                                    ]}
                                                    defaultPageSize={demande.fournisseurs.length < 10 ? demande.fournisseurs.length : 10}
                                                    ofText='sur'
                                                />
                                            </div>


                                        }

                                    </div>
                                )}


                            </div>
                        )
                        : ''
                }
                innerScroll
            />
            <SuggestionDialog />
        </>
    )
}

export default withReducer('demandesAdminApp', reducer)(Demande);
