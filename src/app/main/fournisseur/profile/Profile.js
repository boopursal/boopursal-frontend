import React, { useEffect, useState, useRef } from 'react';
import { Button, Tab, Tabs, InputAdornment, Icon, Typography, Divider, Popper, Chip, Grid, Avatar, MenuItem, ListItemText, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy, SelectReactFormsy, SelectFormsy } from '@fuse';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import _ from '@lodash';
import Formsy from 'formsy-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import LinearProgress from '@material-ui/core/LinearProgress';
import clsx from 'clsx';
import { Helmet } from "react-helmet";
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Highlighter from "react-highlight-words";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
    profileImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },

    profileImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $profileImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $profileImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $profileImageFeaturedStar': {
                opacity: 1
            }
        }
    },
}));

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


function Profile(props) {
    const suggestionsNode = useRef(null);
    const popperNode = useRef(null);
    const searchCategories = useSelector(({ profileApp }) => profileApp.searchCategories);
    const [categories, setCategories] = React.useState([]);
    const params = props.match.params;
    const { tab } = params;

    const dispatch = useDispatch();
    const classes = useStyles();
    const profile = useSelector(({ profileApp }) => profileApp.profile);
    const user = useSelector(({ auth }) => auth.user);
    const Pays = useSelector(({ profileApp }) => profileApp.profile.pays);
    const Villes = useSelector(({ profileApp }) => profileApp.profile.villes);

    const formRef = useRef(null);
    const formRef2 = useRef(null);
    const formRef3 = useRef(null);
    const [showIce, setShowIce] = useState(false);
    const [ville, setVille] = useState(false);
    const [pays, setPays] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [produitsSuggestion, setProduitsSuggestion] = React.useState([]);

    const [tabValue, setTabValue] = useState(parseInt(tab) ? parseInt(tab) : 0);
    const { form, handleChange, setForm } = useForm(null);

    const [values, setValues] = useState({
        showPassword: false,
    });
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //GET INFO SOCIETE
    useEffect(() => {
        function updateProfileState() {
            dispatch(Actions.getProfile(user.id));
        }
        updateProfileState();
    }, [dispatch, user.id]);

    //GET PAYS & SECTEURS

    useEffect(() => {
        dispatch(Actions.getPays());
    }, [dispatch]);

    //GET VILLE IF PAYS EXIST
    useEffect(() => {
        if (profile.data && !form) {
            if (profile.data.pays)
                dispatch(Actions.getVilles(profile.data.pays['@id']));
        }

    }, [dispatch, profile.data, form]);

    //SET ERRORS IN INPUTS AFTER ERROR API
    useEffect(() => {
        if (profile.error && (
            profile.error.societe ||
            profile.error.pays ||
            profile.error.ville ||
            profile.error.adresse1 ||
            profile.error.adresse2 ||
            profile.error.website ||
            profile.error.fix ||
            profile.error.ice ||
            profile.error.description)) {
            formRef.current && formRef.current.updateInputsWithError({
                ...profile.error
            });
            disableButton();
        }
        if (profile.error && (
            profile.error.phone ||
            profile.error.firstName ||
            profile.error.lastName)) {
            formRef2.current && formRef2.current.updateInputsWithError({
                ...profile.error
            });
            disableButton();
        }
        if (profile.error && (
            profile.error.newPassword ||
            profile.error.newConfirmpassword ||
            profile.error.oldPassword)) {
            formRef3.current && formRef3.current.updateInputsWithError({
                ...profile.error
            });
            disableButton();
        }
    }, [profile.error]);

    //SET FORM DATA
    useEffect(() => {
        if (
            (profile.data && !form) ||
            (profile.data && form && profile.data.id !== form.id)
        ) {


            if (profile.data.pays) {
                if (profile.data.pays.name === 'Maroc') {
                    setShowIce(true);
                }

            }
            setForm({ ...profile.data });
            setCategories(profile.data.categories.map(item => item));

            setVille(profile.data.ville ? {
                value: profile.data.ville['@id'],
                label: profile.data.ville.name,
            } : null);
            
            setPays(profile.data.pays ? {
                value: profile.data.pays['@id'],
                label: profile.data.pays.name,
            } : null);
            if (profile.data.autreCategories) {
                setProduitsSuggestion(_.split(profile.data.autreCategories, ','))
            }


        }

    }, [form, profile.data, setForm]);


    useEffect(() => {

        if (profile.avatar) {
            setForm(_.set({ ...form }, 'avatar', profile.avatar));
        }

    }, [form, profile.avatar, setForm]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleChipChange(value, name) {

        if (name === 'ville') {
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
        dispatch(Actions.updateSocieteSousSecteurs(categories, produitsSuggestion, form.id));
    }

    function handleSubmitInfoPerso(model) {
        dispatch(Actions.updateUserInfo(model, form.id));
    }
    function handleSubmitPassword(model) {
        dispatch(Actions.updatePassword(model, form.id));
    }

    function handleChangeSearch(event) {
        dispatch(Actions.setGlobalSearchText(event))
    }
    function showSearch() {
        dispatch(Actions.showSearch());
        document.addEventListener("keydown", escFunction, false);
    }

    function addProduitSuggestion(event) {
        if (!_.find(produitsSuggestion, searchCategories.searchText)) {
            setProduitsSuggestion([...produitsSuggestion, searchCategories.searchText])
            hideSearch();
            dispatch(Actions.cleanUp());
        }
    }
    function escProduitSuggestion(event) {
        hideSearch();
        dispatch(Actions.cleanUp());
    }

    function handleDeleteProduit(value) {
        setProduitsSuggestion(_.reject(produitsSuggestion, function (item) { return item === value; }))
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
        <>
            <Helmet>
                <title>Profil | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    toolbar: "p-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    !profile.requestFournisseur ? form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

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

                        </div>
                    ) :
                        <LinearProgress color="secondary" />
                }
                contentToolbar={
                    !profile.requestFournisseur ?
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
                                <Tab className="h-64 normal-case" label="Mot de passe" />

                            </Tabs>)
                        :
                        <div className={classes.root}>
                            <LinearProgress color="secondary" />
                        </div>
                }
                content={
                    !profile.requestFournisseur ?
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
                                                            className="mb-16 w-full"
                                                            type="text"
                                                            name="ice"
                                                            value={form.ice}
                                                            onChange={handleChange}
                                                            label="ICE"
                                                            autoComplete="ice"
                                                            validations={{
                                                              minLength: 15,
                                                              maxLength: 15,
                                                              isNumeric: true,   // Utiliser `true` pour valider les chiffres
                                                              matchRegexp: /^[0-9]+$/,  // Valide uniquement les chiffres
                                                            }}
                                                            validationErrors={{
                                                              minLength: 'La longueur minimale de caractère est 15',
                                                              maxLength: 'La longueur maximale de caractère est 15',
                                                              isNumeric: 'Cette valeur doit être numérique.Le code ICE doit contenir uniquement des chiffres.',
                                                              matchRegexp: 'Le code ICE doit contenir uniquement des chiffres.',
                                                            }}
                                                            variant="outlined"
                                                            required
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
                                                            variant: 'outlined',
                                                            required: true
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
                                                            validations={{
                                                                minLength: 3,
                                                                maxLength: 10,
                                                            }}
                                                            validationErrors={{
                                                                minLength: 'La longueur minimale de caractère est 3',
                                                                maxLength: 'La longueur maximale de caractère est 10',
                                                            }}
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
                                                        value={
                                                            ville
                                                        }
                                                        placeholder="Sélectionner une ville"
                                                        textFieldProps={{
                                                            label: 'Ville',
                                                            InputLabelProps: {
                                                                shrink: true
                                                            },
                                                            variant: 'outlined',
                                                            required: true
                                                        }}
                                                        className=""
                                                        options={Villes}
                                                        isLoading={profile.loadingVille}
                                                        onChange={(value) => handleChipChange(value, 'ville')}
                                                        required
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
                                                disabled={!isFormValid || profile.loading}
                                                value="legacy"
                                            >
                                                Sauvegarder
                                        {profile.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                            </Button>








                                        </Formsy>
                                    )}
                                {tabValue === 1 && (

                                    <Formsy
                                        onValidSubmit={handleSubmitSousSecteurs}
                                        className="flex pt-5 flex-col ">
                                        <div ref={popperNode} >
                                            <Typography variant="caption" className="flex items-center mb-16"><Icon>info</Icon>&ensp;Vous pouvez choisir un ou plusieurs produits </Typography>

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
                                                                        Ce produit n'existe pas encore sur notre base de données. <br />
                                                                        Ajouter ce produit <Button size="small" onClick={addProduitSuggestion} variant="contained" color="secondary">oui</Button> <Button size="small" onClick={escProduitSuggestion} variant="outlined" color="primary">non</Button>

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
                                        {
                                            categories && categories.length > 0 &&

                                            <Typography paragraph className="mt-8 mb-2 font-bold">Produit(s) sélectioné(s)</Typography>
                                        }
                                        <div className={clsx(classes.chips)}>
                                            {
                                                categories && categories.length > 0 &&
                                                categories.map((item, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={item.name}
                                                        onDelete={() => handleDelete(item.id)}
                                                        className="mt-8 mr-8"
                                                    />
                                                ))


                                            }
                                        </div>
                                        {
                                            produitsSuggestion && produitsSuggestion.length > 0 &&
                                            <>
                                                <Typography paragraph className="mt-8 mb-2 font-bold">Produit(s) suggéré(s)</Typography>
                                                <Typography variant="caption" className="">Ce produit sera activé une fois validé par administrateur, Merci.</Typography>

                                            </>
                                        }
                                        <div className={clsx(classes.chips)}>

                                            {
                                                produitsSuggestion && produitsSuggestion.length > 0 &&
                                                produitsSuggestion.map((item) => (
                                                    <Chip
                                                        key={item}
                                                        color="secondary"
                                                        label={item}
                                                        onDelete={() => handleDeleteProduit(item)}
                                                        className="mt-8 mr-8"
                                                    />
                                                ))


                                            }
                                        </div>


                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-200 pr-auto mt-16 normal-case"
                                            aria-label="Sauvegarder"
                                            disabled={profile.loading || !categories.length}
                                            value="legacy"
                                        >
                                            Sauvegarder
                                        {profile.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                        </Button>

                                    </Formsy>
                                )}
                                {tabValue === 2 && (
                                    <Formsy
                                        onValidSubmit={handleSubmitInfoPerso}
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        ref={formRef2}
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
                                                        minLength: 2
                                                    }}
                                                    validationErrors={{
                                                        minLength: 'La longueur minimale de caractère est 2'
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
                                                        minLength: 2
                                                    }}
                                                    validationErrors={{
                                                        minLength: 'La longueur minimale de caractère est 2'
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
                                            disabled={!isFormValid || profile.loading}
                                            value="legacy"
                                        >
                                            Sauvegarder
                               {profile.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

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
                                            disabled={profile.profileReqInProgress}
                                            onChange={handleUploadChange}
                                        />
                                        <div className="flex justify-center sm:justify-start flex-wrap">
                                            <label
                                                htmlFor="button-file"

                                                className={
                                                    clsx(
                                                        classes.profileImageUpload,
                                                        "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",

                                                    )}
                                            >
                                                {
                                                    profile.profileReqInProgress ?
                                                        <CircularProgress size={24} className={classes.buttonProgress} />
                                                        :
                                                        <Icon fontSize="large" color="action">arrow_upward</Icon>

                                                }
                                            </label>

                                            <div
                                                className={
                                                    clsx(
                                                        classes.profileImageItem,
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
                                {tabValue === 4 && (
                                    <Formsy
                                        onValidSubmit={handleSubmitPassword}
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        ref={formRef3}
                                        className="flex pt-5 flex-col ">

                                        <TextFieldFormsy
                                            className="mb-16"
                                            type={values.showPassword ? 'text' : 'password'}
                                            name="oldPassword"
                                            label="Mot de passe actuel"
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6'
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
                                        />

                                        <TextFieldFormsy
                                            className="mb-16"
                                            type={values.showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            label="Nouveau mot de passe"
                                            validations={{
                                                minLength: 6,
                                                matchRegexp: /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/

                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale des caractères est de 6',
                                                matchRegexp: 'Le mot de passe doit être de 6 caractères minimum et contenir un lettre majuscules et des lettres minuscules et au moins un chiffre'
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
                                        />

                                        <TextFieldFormsy
                                            className="mb-16"
                                            type={values.showPassword ? 'text' : 'password'}
                                            name="newConfirmpassword"
                                            label="Confirmer le mot de passe"
                                            validations="equalsField:newPassword"
                                            validationErrors={{
                                                equalsField: 'Passwords do not match'
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
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-200 pr-auto mt-16 normal-case"
                                            aria-label="Sauvegarder"
                                            disabled={!isFormValid || profile.loading}
                                            value="legacy"
                                        >
                                            Sauvegarder
                           {profile.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                        </Button>

                                    </Formsy>
                                )}

                            </div>
                        )
                        :
                        ''
                }
                innerScroll
            />
        </>
    )
}

export default withReducer('profileApp', reducer)(Profile);
