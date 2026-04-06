import React, { useEffect, useState, useRef } from 'react';
import { Button, Tab, Tabs, InputAdornment, ListItemText, Popper, Icon, Typography, Divider, Grid, Avatar, MenuItem, Chip, IconButton, DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy, SelectReactFormsy, SelectFormsy } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import _ from '@lodash';
import Formsy from 'formsy-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Highlighter from "react-highlight-words";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
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
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    fournisseurImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },

    fournisseurImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
}));

/**
 * 
 * Suugestion
 */
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
/**
 * 
 * FIN Suugestion
 */

function Fournisseur(props) {

    const suggestionsNode = useRef(null);
    const popperNode = useRef(null);
    const searchCategories = useSelector(({ fournisseurApp }) => fournisseurApp.searchCategories);
    const [categories, setCategories] = useState([]);

    const dispatch = useDispatch();
    const classes = useStyles();
    const fournisseur = useSelector(({ fournisseurApp }) => fournisseurApp.fournisseur);
    const Pays = useSelector(({ fournisseurApp }) => fournisseurApp.fournisseur.pays);
    const Villes = useSelector(({ fournisseurApp }) => fournisseurApp.fournisseur.villes);
    const [secteur, setSecteur] = useState(null);
    const [sousSecteur, setSousSecteur] = useState(null);
    const formRef = useRef(null);
    const [showIce, setShowIce] = useState(false);
    const [ville, setVille] = useState(false);
    const [pays, setPays] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [nouveauSecteur, setNouveauSecteur] = useState('');
    const [nouvelleActivite, setNouvelleActivite] = useState('');

    const [tabValue, setTabValue] = useState(0);
    const { form, handleChange, setForm } = useForm(null);
    const params = props.match.params;
    const { fournisseurId } = params;

    //Nouveau secteur
    const [openSecteur, setOpenSecteur] = useState(false);
    function handleClickOpenSecteur() {
        setOpenSecteur(true);
    }

    function handleCloseSecteur() {
        setOpenSecteur(false);
    }
    function handleAddNouveauSecteur() {
        dispatch(Actions.addSecteur(nouveauSecteur));
        handleCloseSecteur();
    }

    //Fin Nouveau Secteur

    //Nouveau produit
    const [produit, setProduit] = useState('');
    useEffect(() => {
        if (fournisseur.produit && !_.find(categories, ['name', fournisseur.produit.name])) {
            setCategories([fournisseur.produit, ...categories]);
            setProduit('')
        }
    }, [fournisseur.produit, categories]);


    //Fin Nouveau produit

    //Nouvelle Activité
    const [openActivite, setOpenActivite] = useState(false);
    function handleClickOpenActivite() {
        setOpenActivite(true);
    }

    function handleCloseActivite() {
        setOpenActivite(false);
    }
    function handleAddNouveauActivite() {
        dispatch(Actions.addActivite(secteur.value, nouvelleActivite));
        handleCloseActivite();
    }

    //Fin Nouvelle Activité



    useEffect(() => {

        function updateFournisseurState() {
            dispatch(Actions.getFournisseur(fournisseurId));
        }
        updateFournisseurState();
        return () => {
            dispatch(Actions.cleanUpFournisseur())
        }
    }, [dispatch, fournisseurId]);


    //GET PAYS & SECTEURS

    useEffect(() => {
        dispatch(Actions.getPays());
        dispatch(Actions.getSecteurs());

    }, [dispatch]);

    //GET VILLE IF PAYS EXIST
    useEffect(() => {
        if (fournisseur.data && !form) {
            if (fournisseur.data.pays)
                dispatch(Actions.getVilles(fournisseur.data.pays['@id']));
        }

    }, [dispatch, fournisseur.data, form]);

    //SET ERRORS IN INPUTS AFTER ERROR API
    useEffect(() => {
        if (fournisseur.error && (
            fournisseur.error.societe ||
            fournisseur.error.phone ||
            fournisseur.error.firstName ||
            fournisseur.error.lastName ||
            fournisseur.error.pays ||
            fournisseur.error.ville ||
            fournisseur.error.adresse1 ||
            fournisseur.error.adresse2 ||
            fournisseur.error.website ||
            fournisseur.error.fix ||
            fournisseur.error.ice ||
            fournisseur.error.description)) {
            formRef.current.updateInputsWithError({
                ...fournisseur.error
            });

            disableButton();
        }
    }, [fournisseur.error]);

    //SET FORM DATA
    useEffect(() => {
        if (
            (fournisseur.data && !form) ||
            (fournisseur.data && form && fournisseur.data.id !== form.id)
        ) {
            if (fournisseur.data.pays) {
                if (fournisseur.data.pays.name === 'Maroc') {
                    setShowIce(true);
                }

            }
            setForm({ ...fournisseur.data });
            setCategories((fournisseur.data.categories || []).map(item => item));
            fournisseur.data.ville &&
                setVille({
                    value: fournisseur.data.ville['@id'],
                    label: fournisseur.data.ville.name,
                });
            fournisseur.data.pays &&
                setPays({
                    value: fournisseur.data.pays['@id'],
                    label: fournisseur.data.pays.name,
                });


        }

    }, [form, fournisseur.data, setForm]);

    useEffect(() => {
        if (fournisseur.data && fournisseur.villeAdded) {
            setForm({ ...fournisseur.data });
            setVille({
                value: fournisseur.data.ville['@id'],
                label: fournisseur.data.ville.name,
            });
            return () => {
                dispatch(Actions.cleanUpAddedVille())
            }
        }

    }, [dispatch, form, fournisseur.villeAdded, fournisseur.data, setForm]);

    useEffect(() => {

        if (fournisseur.avatar) {
            setForm(_.set({ ...form }, 'avatar', fournisseur.avatar));
        }

    }, [form, fournisseur.avatar, setForm]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleChipChange(value, name) {

        if (name === 'categories') {
            if (!_.some(value, 'value')) {
                setForm(_.set({ ...form }, name, ''));
                setCategories(null);
            }
            else {
                setForm(_.set({ ...form }, name, value));
                setCategories(value);
            }
        }
        else if (name === 'ville') {
            setForm(_.set({ ...form }, name, value));
            setVille(value);
        }
        else {
            form.ville = '';
            setForm(_.set({ ...form }, name, value));
            setPays(value);
            if (value.value) {
                dispatch(Actions.getVilles(value.value));
            }

            if (value.label === 'Maroc') {
                setShowIce(true)
            }
            else {
                setShowIce(false)
            }
        }

    }

    function handleChipSuggestionChange(value, name) {
        if (name === 'secteur') {
            if (value.value) {
                dispatch(Actions.getSousSecteurs(value.value));
                setSousSecteur(null)
                setSecteur(value)
            }
        }
        if (name === 'sousSecteurs') {
            if (value.value) {
                setSousSecteur(value)
            }
        }

    }

    function handleUploadChange(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        dispatch(Actions.uploadAvatar(file, form.id));
    }


    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmitInfoSociete(model) {
        dispatch(Actions.updateSocieteInfo(model, form.id));
    }

    function handleSubmitSousSecteurs() {
        dispatch(Actions.updateSocieteSousSecteurs(categories, form.id));
    }

    function handleSubmitInfoPerso(model) {
        dispatch(Actions.updateUserInfo(model, form.id));
    }

    /** 
     * ===============> AUTO SUGGESTION <====================
     */
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



    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !fournisseur.requestFournisseur ? form && (
                    <div className="flex flex-1 w-full items-center justify-between">

                        <div className="flex flex-col items-start max-w-full">

                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/users/fournisseurs" color="inherit">
                                    <Icon className="mr-4 text-20">arrow_back</Icon>
                                    Retour
                                </Typography>
                            </FuseAnimate>
                            <div className="flex items-center max-w-full">
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    {form.avatar ?
                                        (
                                            <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" alt="user photo" src={URL_SITE + form.avatar.url} />
                                        )
                                        :
                                        (
                                            <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded">
                                                {form.firstName[0]}
                                            </Avatar>
                                        )
                                    }
                                </FuseAnimate>
                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {form.firstName && form.lastName ? form.firstName + ' ' + form.lastName : 'NOM & Prénom'}

                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption">{form.societe ? form.societe : 'Société'} {form.email ? ' | ' + form.email : ''}</Typography>
                                    </FuseAnimate>
                                </div>
                            </div>
                        </div>
                        <FuseAnimate animation="transition.slideRightIn" delay={300}>

                            {
                                fournisseur.data && fournisseur.data.isactif ?
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        color="secondary"
                                        disabled={fournisseur.loading}
                                        onClick={() => dispatch(Actions.etatFournisseur(form, false))}
                                    >
                                        Mettre ce compte invalide
                                        {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </Button> :
                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        color="secondary"

                                        disabled={fournisseur.loading}
                                        onClick={() => dispatch(Actions.etatFournisseur(form, true))}
                                    >
                                        Mettre ce compte valide
                                        {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                    </Button>
                            }



                        </FuseAnimate>
                    </div>
                ) :
                    <LinearProgress color="secondary" />
            }
            contentToolbar={
                !fournisseur.requestFournisseur ?
                    form && (
                        <Tabs
                            value={tabValue}
                            onChange={handleChangeTab}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                            classes={{ root: "w-full h-64" }}
                        >
                            <Tab className="h-64 normal-case" label="Infos société" />
                            <Tab className="h-64 normal-case" label="Produits" />
                            <Tab className="h-64 normal-case" label="Infos utilisateur" />
                            <Tab className="h-64 normal-case" label="Photo" />
                        </Tabs>)
                    :
                    <div className={classes.root}>
                        <LinearProgress color="secondary" />
                    </div>
            }
            content={
                !fournisseur.requestFournisseur ?
                    form && (
                        <div className=" sm:p-10 max-w-2xl">
                            {tabValue === 0 &&
                                (
                                    <Formsy
                                        onValidSubmit={handleSubmitInfoSociete}
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        ref={formRef}
                                        className="flex pt-5 flex-col ">

                                        <Grid container spacing={3} className="mb-5">

                                            <Grid item xs={12} sm={8}>
                                                <div className="flex">

                                                    <TextFieldFormsy
                                                        className=""
                                                        label="Raison sociale"
                                                        autoFocus
                                                        id="societe"
                                                        name="societe"
                                                        value={form.societe}
                                                        onChange={handleChange}
                                                        variant="outlined"
                                                        validations={{
                                                            matchRegexp: /^[a-z]|([a-z][0-9])|([0-9][a-z])|([a-z][0-9][a-z])+$/i,
                                                            minLength: 2,
                                                            maxLength: 40

                                                        }}
                                                        validationErrors={{
                                                            minLength: 'Raison sociale doit dépasser 2 caractères alphanumériques',
                                                            maxLength: 'Raison sociale ne peut dépasser 40 caractères alphanumériques',
                                                            matchRegexp: 'Raison sociale doit contenir des caractères alphanumériques'
                                                        }}
                                                        required
                                                        fullWidth
                                                    />
                                                </div>


                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="fix"
                                                        value={form.fix}
                                                        onChange={handleChange}
                                                        label="Fixe"
                                                        autoComplete="fix"
                                                        validations={{
                                                            minLength: 10,
                                                            maxLength: 13,
                                                        }}
                                                        validationErrors={{
                                                            minLength: 'La longueur minimale de caractère est 10',
                                                            maxLength: 'La longueur maximale de caractère est 13'
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                        }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={8}>
                                                <div className="flex">
                                                    {
                                                        showIce ?
                                                            <TextFieldFormsy
                                                                className=""
                                                                type="text"
                                                                name="ice"
                                                                value={form.ice}
                                                                onChange={handleChange}
                                                                label="ICE"
                                                                autoComplete="ice"
                                                                validations={{
                                                                    minLength: 15,
                                                                    maxLength: 15,
                                                                    isNumeric: "isNumeric",
                                                                    matchRegexp: /^(?!.*?(\w)\1{5}).*$/,
                                                                }}
                                                                validationErrors={{
                                                                    minLength: 'La longueur minimale de caractère est 15',
                                                                    maxLength: 'La longueur maximale de caractère est 15',
                                                                    isNumeric: 'Cette valeur doit être numérique. ',
                                                                    matchRegexp: 'ICE non valid. ',
                                                                }}

                                                                variant="outlined"
                                                                required
                                                                fullWidth
                                                            />
                                                            :
                                                            ''
                                                    }

                                                </div>


                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="website"
                                                        value={form.website}
                                                        onChange={handleChange}
                                                        autoComplete="website"
                                                        label="Site Web"
                                                        validations="isUrl"
                                                        validationErrors={{
                                                            isUrl: 'Exemple : http://www.exemple.com',
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">language</Icon></InputAdornment>
                                                        }}
                                                        fullWidth
                                                        variant="outlined"
                                                    />
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
                                                        value={form.adresse1}
                                                        onChange={handleChange}
                                                        autoComplete="adresse"
                                                        label="Adresse 1"
                                                        validations={{
                                                            minLength: 10,
                                                        }}
                                                        validationErrors={{
                                                            minLength: 'La longueur minimale de caractère est 10',
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                        }}
                                                        variant="outlined"
                                                        required
                                                        fullWidth

                                                    />
                                                </div>

                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <SelectReactFormsy
                                                    id="pays"
                                                    name="pays"
                                                    value={
                                                        pays
                                                    }
                                                    placeholder="Sélectionner une Pays"
                                                    textFieldProps={{
                                                        label: 'Pays',
                                                        InputLabelProps: {
                                                            shrink: true
                                                        },
                                                        variant: 'outlined'
                                                    }}

                                                    className="mt-20"
                                                    options={Pays}
                                                    onChange={(value) => handleChipChange(value, 'pays')}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="adresse2"
                                                        value={form.adresse2}
                                                        onChange={handleChange}
                                                        autoComplete="adresse"
                                                        label="Adresse 2"
                                                        validations={{
                                                            minLength: 10,
                                                        }}
                                                        validationErrors={{
                                                            minLength: 'La longueur minimale de caractère est 10',
                                                        }}
                                                        InputProps={{
                                                            endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                        }}
                                                        variant="outlined"
                                                        fullWidth

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="number"
                                                        name="codepostal"
                                                        value={String(form.codepostal)}
                                                        onChange={handleChange}
                                                        autoComplete="codepostal"
                                                        label="Code Postal"
                                                        variant="outlined"
                                                        fullWidth

                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} sm={4}>

                                                <SelectReactFormsy
                                                    id="ville"
                                                    name="ville"
                                                    value={ville}
                                                    placeholder="Sélectionner une ville"
                                                    textFieldProps={{
                                                        label: 'Ville',
                                                        InputLabelProps: {
                                                            shrink: true
                                                        },
                                                        variant: 'outlined'
                                                    }}
                                                    className=""
                                                    options={Villes}
                                                    onChange={(value) => handleChipChange(value, 'ville')}
                                                    required
                                                />
                                                {
                                                    (ville.label === 'Autre' || ville.label === 'autre') &&
                                                    <TextFieldFormsy
                                                        className="mb-5 mt-20  w-full"
                                                        type="text"
                                                        name="autreVille"
                                                        onChange={handleChange}
                                                        value={form.autreVille}
                                                        label="Autre ville"
                                                        InputProps={{
                                                            endAdornment:
                                                                fournisseur.loadingAddVille ?
                                                                    <CircularProgress color="secondary" />
                                                                    :
                                                                    (<InputAdornment position="end">
                                                                        <IconButton
                                                                            color="secondary"
                                                                            disabled={!form.autreVille}
                                                                            onClick={(ev) => dispatch(Actions.addVille(form.autreVille, form.pays.id, form.id))}
                                                                        >
                                                                            <Icon>add_circle</Icon>
                                                                        </IconButton>
                                                                    </InputAdornment>)
                                                        }}
                                                        variant="outlined"
                                                    />
                                                }


                                            </Grid>

                                        </Grid>
                                        <Divider />

                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={12}>

                                                <TextFieldFormsy
                                                    className="mb-5 mt-20  w-full"
                                                    type="text"
                                                    name="description"
                                                    value={form.description}
                                                    onChange={handleChange}
                                                    label="Présentation"
                                                    autoComplete="description"
                                                    validations={{
                                                        minLength: 10,
                                                    }}
                                                    validationErrors={{
                                                        minLength: 'La longueur minimale de caractère est 10',
                                                    }}

                                                    variant="outlined"
                                                    multiline
                                                    rows="8"

                                                />

                                            </Grid>

                                        </Grid>


                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-200 pr-auto mt-16 normal-case"
                                            aria-label="Sauvegarder"
                                            disabled={!isFormValid || fournisseur.loading}
                                            value="legacy"
                                        >
                                            Sauvegarder
                                            {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                        </Button>








                                    </Formsy>
                                )}
                            {tabValue === 1 && (


                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={fournisseur.data.autreCategories ? 6 : 12}>
                                        <Formsy
                                            onValidSubmit={handleSubmitSousSecteurs}
                                            onValid={enableButton}
                                            onInvalid={disableButton}
                                            ref={formRef}
                                            className="flex pt-5 flex-col ">
                                            <Typography variant="h6" color="secondary" className="uppercase mb-16 border-l-8 pl-16">
                                                Produits sélectionnés
                                            </Typography>
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
                                                        label: 'Produits',
                                                        placeholder: "Produit (ex: Rayonnage lourd)",
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
                                                    categories && categories.length > 0 ?
                                                        categories.map((item, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={item.name}
                                                                onDelete={() => handleDelete(item.id)}
                                                                className="mt-8 mr-8"
                                                            />
                                                        ))
                                                        :
                                                        <Typography variant="caption" className="my-16">
                                                            Aucun produit sélectionné
                                                        </Typography>


                                                }
                                            </div>

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                className="w-200 pr-auto mt-16 normal-case"
                                                aria-label="Sauvegarder"
                                                disabled={fournisseur.loading || !categories.length}
                                                value="legacy"
                                            >
                                                Sauvegarder
                                                {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                            </Button>
                                        </Formsy>
                                    </Grid>
                                    {
                                        fournisseur.data.autreCategories &&
                                        <Grid item xs={12} sm={6}>
                                            <Formsy>
                                                <>
                                                    <Typography variant="h6" color="secondary" className="uppercase mb-16  border-l-8 pl-16">
                                                        Produits suggérés
                                                    </Typography>
                                                    <Typography paragraph className="flex items-center">
                                                        {fournisseur.data.autreCategories}
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            disabled={!fournisseur.data.autreCategories || fournisseur.loading}
                                                            className="ml-16 normal-case"
                                                            onClick={() => dispatch(Actions.viderAutreCategories(form.id))}
                                                            aria-label="Clear"
                                                        >
                                                            Vider les suggestions
                                                            {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                                        </Button>
                                                    </Typography>
                                                </>

                                                <Grid container spacing={3} className="mt-16">
                                                    <Grid item xs={12} className="flex items-center">
                                                        <SelectReactFormsy
                                                            id="secteur"
                                                            name="secteur"
                                                            className="flex-1"
                                                            value={
                                                                secteur
                                                            }
                                                            onChange={(value) => handleChipSuggestionChange(value, 'secteur')}
                                                            placeholder="Sélectionner un secteur"
                                                            textFieldProps={{
                                                                label: 'Secteurs',
                                                                InputLabelProps: {
                                                                    shrink: true
                                                                },
                                                                variant: 'outlined',
                                                                required: true
                                                            }}
                                                            isLoading={fournisseur.loadingSecteurs}
                                                            options={fournisseur.secteurs}
                                                            fullWidth
                                                        />
                                                        <IconButton
                                                            color="secondary"
                                                            onClick={handleClickOpenSecteur}
                                                        >
                                                            <Icon>add_circle</Icon>
                                                        </IconButton>
                                                        <Dialog open={openSecteur} onClose={handleCloseSecteur} aria-labelledby="form-dialog-title">
                                                            <DialogTitle id="form-dialog-title">Nouveau secteur</DialogTitle>
                                                            <DialogContent>

                                                                <Grid container spacing={3} >

                                                                    <Grid item xs={12}>
                                                                        <TextField
                                                                            className="mt-8"
                                                                            error={nouveauSecteur.length <= 2}
                                                                            required
                                                                            label="Secteur"
                                                                            autoFocus
                                                                            value={nouveauSecteur}
                                                                            id="nouveauSecteur"
                                                                            name="nouveauSecteur"
                                                                            onChange={(event) => setNouveauSecteur(event.target.value)}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            helperText={nouveauSecteur.length <= 2 ? 'Ce champ doit contenir au moins 3 caractères' : ''}
                                                                        />
                                                                    </Grid>

                                                                </Grid>
                                                            </DialogContent>
                                                            <Divider />
                                                            <DialogActions>
                                                                <Button onClick={handleCloseSecteur} variant="outlined" color="primary">
                                                                    Annuler
                                                                </Button>
                                                                <Button onClick={handleAddNouveauSecteur} variant="contained" color="secondary"
                                                                    disabled={fournisseur.loadingAddSecteurs || nouveauSecteur.length < 2}
                                                                >
                                                                    Sauvegarder
                                                                    {fournisseur.loadingAddSecteurs && <CircularProgress size={24} className={classes.buttonProgress} />}
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>

                                                    </Grid>

                                                    <Grid item xs={12} className="flex items-center">
                                                        <SelectReactFormsy
                                                            id="sousSecteurs"
                                                            name="sousSecteurs"
                                                            className="flex-1"
                                                            value={
                                                                sousSecteur
                                                            }
                                                            onChange={(value) => handleChipSuggestionChange(value, 'sousSecteurs')}
                                                            placeholder="Sélectionner une activité"
                                                            textFieldProps={{
                                                                label: 'Activités',
                                                                InputLabelProps: {
                                                                    shrink: true
                                                                },
                                                                variant: 'outlined',
                                                                required: true,
                                                                fullWidth: 'fullWidth'

                                                            }}
                                                            isLoading={fournisseur.loadingSousSecteurs}
                                                            options={fournisseur.sousSecteurs}
                                                        />
                                                        <IconButton
                                                            color="secondary"
                                                            disabled={!secteur}
                                                            onClick={handleClickOpenActivite}
                                                        >
                                                            <Icon>add_circle</Icon>
                                                        </IconButton>
                                                        <Dialog open={openActivite} onClose={handleCloseActivite} aria-labelledby="form-dialog-title">
                                                            <DialogTitle id="form-dialog-title">Nouvelle activité</DialogTitle>
                                                            <DialogContent>

                                                                <Grid container spacing={3} >

                                                                    <Grid item xs={12}>
                                                                        <TextField
                                                                            className="mt-8"
                                                                            error={nouvelleActivite.length <= 2}
                                                                            required
                                                                            label="Activité"
                                                                            autoFocus
                                                                            value={nouvelleActivite}
                                                                            id="nouvelleActivite"
                                                                            name="nouvelleActivite"
                                                                            onChange={(event) => setNouvelleActivite(event.target.value)}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            helperText={nouvelleActivite.length <= 2 ? 'Ce champ doit contenir au moins 3 caractères' : ''}
                                                                        />
                                                                    </Grid>

                                                                </Grid>
                                                            </DialogContent>
                                                            <Divider />
                                                            <DialogActions>
                                                                <Button onClick={handleCloseActivite} variant="outlined" color="primary">
                                                                    Annuler
                                                                </Button>
                                                                <Button onClick={handleAddNouveauActivite} variant="contained" color="secondary"
                                                                    disabled={nouvelleActivite.length < 2}
                                                                >
                                                                    Sauvegarder
                                                                </Button>
                                                            </DialogActions>
                                                        </Dialog>

                                                    </Grid>

                                                    <Grid item xs={12} >
                                                        <TextField
                                                            required
                                                            label="Produit"
                                                            autoFocus
                                                            value={produit}
                                                            disabled={!sousSecteur}
                                                            id="produit"
                                                            name="produit"
                                                            onChange={(event) => setProduit(event.target.value)}
                                                            variant="outlined"
                                                            fullWidth
                                                            helperText={produit.length <= 2 ? 'Ce champ doit contenir au moins 3 caractères' : ''}
                                                        />
                                                    </Grid>

                                                </Grid>

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    disabled={produit.length <= 2 || fournisseur.loadingProduit}
                                                    className="w-200 pr-auto mt-16 normal-case"
                                                    onClick={() => dispatch(Actions.addProduit(sousSecteur.value, produit))}
                                                    aria-label="Ajouter"
                                                >
                                                    Ajouter
                                                    {fournisseur.loadingProduit && <CircularProgress size={24} className={classes.buttonProgress} />}

                                                </Button>
                                            </Formsy>
                                        </Grid>
                                    }

                                </Grid>



                            )}
                            {tabValue === 2 && (
                                <Formsy
                                    onValidSubmit={handleSubmitInfoPerso}
                                    onValid={enableButton}
                                    onInvalid={disableButton}
                                    ref={formRef}
                                    className="flex pt-5 flex-col ">

                                    <Grid container spacing={3}>


                                        <Grid item xs={12} sm={2}>
                                            <SelectFormsy
                                                className="mb-16"
                                                name="civilite"
                                                label="Civilité"
                                                onChange={handleChange}
                                                value={form.civilite}
                                                variant="outlined"
                                                required
                                                fullWidth
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
                                                value={form.lastName}
                                                onChange={handleChange}
                                                label="Nom"
                                                validations={{
                                                    minLength: 3
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 3'
                                                }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
                                                }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={5}>
                                            <TextFieldFormsy
                                                className="mb-16"
                                                value={form.firstName}
                                                onChange={handleChange}
                                                type="text"
                                                name="firstName"
                                                label="Prénom"
                                                validations={{
                                                    minLength: 3
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 3'
                                                }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">person</Icon></InputAdornment>
                                                }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </Grid>

                                    </Grid>
                                    <Divider />

                                    <Grid container spacing={3} className="mt-5">
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldFormsy
                                                className="mb-16"
                                                type="text"
                                                name="email"
                                                value={form.email}
                                                label="Email"
                                                variant="outlined"
                                                disabled
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextFieldFormsy
                                                className="mb-16"
                                                value={form.phone}
                                                onChange={handleChange}
                                                type="text"
                                                name="phone"
                                                label="Téléphone"
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </Grid>

                                    </Grid>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        className="w-200 pr-auto mt-16 normal-case"
                                        aria-label="Sauvegarder"
                                        disabled={!isFormValid || fournisseur.loading}
                                        value="legacy"
                                    >
                                        Sauvegarder
                                        {fournisseur.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                    </Button>

                                </Formsy>
                            )}
                            {tabValue === 3 && (
                                <div>
                                    <input
                                        accept="image/jpeg,image/gif,image/png"
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        disabled={fournisseur.fournisseurReqInProgress}
                                        onChange={handleUploadChange}
                                    />
                                    <div className="flex justify-center sm:justify-start flex-wrap">
                                        <label
                                            htmlFor="button-file"

                                            className={
                                                clsx(
                                                    classes.fournisseurImageUpload,
                                                    "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",

                                                )}
                                        >
                                            {
                                                fournisseur.fournisseurReqInProgress ?
                                                    <CircularProgress size={24} className={classes.buttonProgress} />
                                                    :
                                                    <Icon fontSize="large" color="action">arrow_upward</Icon>

                                            }
                                        </label>

                                        <div
                                            className={
                                                clsx(
                                                    classes.fournisseurImageItem,
                                                    "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5")
                                            }
                                            onClick={form.avatar ? () => window.open(URL_SITE + form.avatar.url, "_blank") : ''}
                                        >
                                            {form.avatar ?
                                                <img className="max-w-none w-auto h-full"
                                                    src={URL_SITE + form.avatar.url}
                                                    alt={form.societe} />
                                                :
                                                <img className="max-w-none w-auto h-full"
                                                    src="assets/images/avatars/profile.jpg"
                                                    alt={form.societe} />}
                                        </div>


                                    </div>

                                </div>
                            )}

                        </div>
                    )
                    :
                    ''
            }
            innerScroll
        />
    )
}

export default withReducer('fournisseurApp', reducer)(Fournisseur);
