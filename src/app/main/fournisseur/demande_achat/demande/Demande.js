import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, InputAdornment, Icon, Typography, LinearProgress, Grid, Tooltip, Divider, DialogTitle, DialogContent, DialogContentText, DialogActions, Chip, CircularProgress } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles, withStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy } from '@fuse';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';
import moment from 'moment';

const LightTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}))(Tooltip);

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
    },

    error: {
        backgroundColor: theme.palette.error.dark,
    },

    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    margin: {
        margin: theme.spacing(1),
    },

    chip: {
        marginLeft: theme.spacing(1),
        background: '#ef5350',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'

    },
    chip2: {
        marginLeft: theme.spacing(1),
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'
    },
    chip3: {
        margin: theme.spacing(1),
        background: 'green',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'

    },
}));
moment.defaultFormat = "DD/MM/YYYY HH:mm";
function Demande(props) {

    const dispatch = useDispatch();
    const demande = useSelector(({ demandesApp }) => demandesApp.demande);

    const user = useSelector(({ auth }) => auth.user);

    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);


    useEffect(() => {
        const params = props.match.params;
        const { demandeId } = params;
        dispatch(Actions.getDemande(demandeId));
        dispatch(Actions.getVisiteDemande(user.id, demandeId));
        dispatch(Actions.getProduitsFrs(user.id));

        return () => {
            dispatch(Actions.cleanUp())
        }

    }, [dispatch, props.match.params, user.id]);

    function handleAddProduit(id_produit) {
        dispatch(Actions.addProduit(id_produit, demande.produits, user.id));
    }

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !demande.loading
                    ?

                    demande.data && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/demandes_prix" color="inherit">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Retour
                                    </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">

                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <div className="text-16 sm:text-20 truncate">
                                                {demande.data.reference ? 'RFQ-' + demande.data.reference : 'Nouvelle Demande'}
                                                {
                                                    demande.data.statut === 3 ?
                                                        <Chip className={classes.chip2} label="Adjugée" />
                                                        :
                                                        moment(demande.data.dateExpiration) >= moment()
                                                            ?
                                                            demande.data.statut === 0
                                                                ?
                                                                <Chip className={classes.chipOrange} label="En attente" />
                                                                :
                                                                (demande.data.statut === 1 ? <Chip className={classes.chip2} label="En cours" />
                                                                    :
                                                                    <Chip className={classes.chip} label="Refusée" />
                                                                )
                                                            :
                                                            <Chip className={classes.chip} label="Expirée" />
                                                }
                                                {
                                                    demande.data.statut === 3 ? ''
                                                        :
                                                        moment(demande.data.dateExpiration) >= moment()
                                                            ?

                                                            <Chip className={classes.chip2} label={moment(demande.data.dateExpiration).diff(moment(), 'days') === 0 ? moment(demande.data.dateExpiration).diff(moment(), 'hours') + ' h' : moment(demande.data.dateExpiration).diff(moment(), 'days') + ' j'} />
                                                            :
                                                            <Chip className={classes.chip} label={moment(demande.data.dateExpiration).diff(moment(), 'days') === 0 ? moment(demande.data.dateExpiration).diff(moment(), 'hours') + ' h' : moment(demande.data.dateExpiration).diff(moment(), 'days') + ' j'} />

                                                }
                                            </div>
                                        </FuseAnimate>

                                    </div>
                                </div>
                            </div>
                            <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                <div>
                                    {
                                        demande.data.isAnonyme
                                            ?
                                            <Typography className="text-20" color="textPrimary">
                                                Demande anonyme
                                                <LightTooltip placement="top" title="Cette demande est anonyme, vous pouvez participer a cette demande sans perdre aucun jeton" aria-label="jeton">
                                                    <Icon className="ml-4 text-20">help_outline</Icon>
                                                </LightTooltip>

                                            </Typography>
                                            :
                                            (
                                                demande.visit && demande.visit
                                                    ?
                                                    <Chip className={classes.chip3} label={"Déjà vu, première visite le " + moment(demande.visit.created).format('DD/MM/YYYY')} />
                                                    :
                                                    (
                                                        demande.data.statut === 3 ? '' :
                                                            moment(demande.data.dateExpiration) >= moment()
                                                                ?
                                                                (

                                                                    <Button
                                                                        className="whitespace-no-wrap bg-orange"
                                                                        variant="contained"
                                                                        onClick={(ev) => {
                                                                            dispatch(Actions.openDialog({
                                                                                children: (
                                                                                    <React.Fragment>
                                                                                        <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
                                                                                        <DialogContent>
                                                                                            <DialogContentText id="alert-dialog-description">
                                                                                                {
                                                                                                    user.jetons > 0
                                                                                                        ? 'Avertissement! vous allez être débité d´un jeton !'
                                                                                                        : 'Votre solde de jetons ne vous permet pas de consulter cette demande.'
                                                                                                }
                                                                                            </DialogContentText>
                                                                                        </DialogContent>
                                                                                        <DialogActions>
                                                                                            <Button onClick={() => dispatch(Actions.closeDialog())} variant="outlined" color="primary">
                                                                                                Pas maintenant
                                                                                            </Button>
                                                                                            <Button onClick={(ev) => {
                                                                                                user.jetons > 0
                                                                                                    ?
                                                                                                    dispatch(Actions.addVisiteDemande(user.id, demande.data))
                                                                                                    :
                                                                                                    props.history.push('/abonnement/commandes/true')
                                                                                                dispatch(Actions.closeDialog())
                                                                                            }}
                                                                                                color="secondary"
                                                                                                variant="contained"
                                                                                            >
                                                                                                {user.jetons ? 'Continuer' : 'Commander jetons'}
                                                                                            </Button>
                                                                                        </DialogActions>
                                                                                    </React.Fragment>
                                                                                )
                                                                            }))
                                                                        }}
                                                                    >
                                                                        Voir le profil de l'acheteur
                                                                    </Button>

                                                                )
                                                                :
                                                                ''

                                                    )
                                            )}

                                </div>
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
                                demande.data && demande.data.attachements.length > 0
                                    ? "Pièce(s) jointe(s) (" + demande.data.attachements.length + ")"
                                    : "Pièce(s) jointe(s)"}

                        />

                        {demande.data && (demande.visit || demande.data.isAnonyme) ?
                            <Tab className="h-64 normal-case text-orange font-bold" label="Profil Acheteur" />
                            :
                            ''}


                    </Tabs>

            }
            content={
                !demande.loading ?

                    demande.data && (
                        <div className="p-10  sm:p-24 max-w-2xl">
                            {tabValue === 0 &&
                                (

                                    <Formsy
                                        className="flex flex-col ">
                                        <Grid container spacing={3} >

                                            <Grid item xs={12} sm={4}>
                                                <TextFieldFormsy
                                                    className="mb-24"
                                                    label="Référence"
                                                    id="reference"
                                                    name="reference"
                                                    value={demande.data.reference}
                                                    InputProps={{
                                                        readOnly: true,
                                                        startAdornment: <InputAdornment position="start">RFQ-</InputAdornment>,
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={8}>

                                                <TextFieldFormsy
                                                    className="mb-24"
                                                    label="Designation"
                                                    id="titre"
                                                    name="titre"
                                                    value={demande.data.titre}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>

                                        </Grid>

                                        <Grid container spacing={3} >

                                            <Grid item xs={12} sm={4}>
                                                <TextFieldFormsy
                                                    className="mb-24"
                                                    label={demande.data.currency ? "Budget en " + demande.data.currency.name : 'Budget'}
                                                    id="budget"
                                                    name="budget"
                                                    value={
                                                        parseFloat(demande.data.budget).toLocaleString(
                                                            undefined, // leave undefined to use the browser's locale,
                                                            // or use a string like 'en-US' to override it.
                                                            { minimumFractionDigits: 2 }
                                                        )
                                                    }
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={4}>

                                                <TextFieldFormsy
                                                    className="mb-24"
                                                    label="Date d'expiration"
                                                    id="dateExpiration"
                                                    name="dateExpiration"
                                                    value={
                                                        moment(demande.data.dateExpiration).format('DD/MM/YYYY HH:mm')
                                                    }
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>
                                            <Grid item xs={12} sm={4}>

                                                <TextFieldFormsy
                                                    className="mb-24"
                                                    label="Date de création"
                                                    id="dateCreated"
                                                    name="dateCreated"
                                                    value={moment(demande.data.created).format('DD/MM/YYYY HH:mm')}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                />

                                            </Grid>
                                        </Grid>

                                        <Grid container spacing={3} >

                                            <Grid item xs={12} sm={12}>
                                                <div className={clsx(classes.chips)}>
                                                    {
                                                        demande.data.categories && demande.produits && demande.data.categories.length > 0 &&
                                                        demande.data.categories.map((item, index) => (
                                                            _.find(demande.produits, function (d) { return d['@id'] === item['@id'] }) ?
                                                                <Chip
                                                                    key={index}
                                                                    label={item.name}
                                                                    className="mb-16 mr-8"
                                                                    fontSize="small"

                                                                />
                                                                :
                                                                <Chip
                                                                    key={index}
                                                                    label={item.name}
                                                                    className="mb-16 mr-8"
                                                                    onDelete={() => handleAddProduit(item['@id'])}
                                                                    deleteIcon={
                                                                        demande.requestAddProduit ?
                                                                            <CircularProgress size={20} color="secondary" />
                                                                            :
                                                                            <Tooltip title="Ajouter à mes produits">
                                                                                <Icon>add_circle</Icon>
                                                                            </Tooltip>}
                                                                />
                                                        ))
                                                    }
                                                </div>

                                            </Grid>

                                        </Grid>



                                        <TextFieldFormsy
                                            className="mb-16  w-full"
                                            type="text"
                                            name="description"
                                            value={demande.data.description}
                                            label="Description"
                                            multiline
                                            rows="6"
                                            InputProps={{
                                                readOnly: true,
                                            }}

                                        />

                                    </Formsy>
                                )}
                            {tabValue === 1 && (
                                <div>

                                    <div className="flex justify-center sm:justify-start flex-wrap">



                                        {demande.data.attachements.length > 0 ?
                                            demande.data.attachements.map(media => (
                                                <div
                                                    className={
                                                        clsx(
                                                            classes.demandeImageItem,
                                                            "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5")
                                                    }
                                                    key={media.id}
                                                    onClick={() => window.open(URL_SITE + media.url, "_blank")}
                                                >

                                                    {_.split(media.type, '/', 1)[0] === 'image' ?
                                                        <img className="max-w-none w-auto h-full"
                                                            src={URL_SITE + media.url}
                                                            alt="demande" />
                                                        :
                                                        <Icon color="secondary" style={{ fontSize: 80 }}>insert_drive_file</Icon>
                                                    }

                                                </div>
                                            ))
                                            : 'Aucune pièce jointe attachée a cette demande'
                                        }
                                    </div>

                                </div>
                            )}
                            {tabValue === 2 && (
                                (demande.visit && !demande.data.isAnonyme) ? (

                                    <Formsy

                                        className="flex flex-col">

                                        <Grid container spacing={3} className="mb-5">

                                            <Grid item xs={12} sm={4}>
                                                <div className="flex">
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="fullname"
                                                        value={demande.visit.demande.acheteur.civilite + ' ' + demande.visit.demande.acheteur.firstName + ' ' + demande.visit.demande.acheteur.lastName}
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
                                                        value={demande.visit.demande.acheteur.email}
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
                                                    value={demande.visit.demande.acheteur.phone}
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
                                                        value={demande.visit.demande.acheteur.societe}
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
                                                        value={demande.visit.demande.acheteur.fix}
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
                                                    value={demande.visit.demande.acheteur.secteur ? demande.visit.demande.acheteur.secteur.name : ''}
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
                                                        value={demande.visit.demande.acheteur.website}
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
                                                        demande.visit.demande.acheteur.ice ?
                                                            <TextFieldFormsy
                                                                className=""
                                                                type="text"
                                                                name="ice"
                                                                id="ice"
                                                                value={demande.visit.demande.acheteur.ice}
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
                                                        value={demande.visit.demande.acheteur.adresse1}
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
                                                    value={demande.visit.demande.acheteur.pays ? demande.visit.demande.acheteur.pays.name : ''}
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
                                                        value={demande.visit.demande.acheteur.adresse2}
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
                                                        value={String(demande.visit.demande.acheteur.codepostal)}
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
                                                    value={demande.visit.demande.acheteur.ville ? demande.visit.demande.acheteur.ville.name : ''}
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
                                                    value={demande.visit.demande.acheteur.description}
                                                    label="Présentation"
                                                    multiline
                                                    rows="2"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}

                                                />

                                            </Grid>

                                        </Grid>




                                    </Formsy>
                                )
                                    : (
                                        demande.data.isAnonyme ?
                                            <Formsy

                                                className="flex flex-col">

                                                <Grid container spacing={3} className="mb-5">

                                                    <Grid item xs={12} sm={4}>
                                                        <div className="flex">
                                                            <TextFieldFormsy
                                                                className=""
                                                                type="text"
                                                                name="fullname"
                                                                value="M. Younes HALOUI"
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
                                                                value="achat@lesachatsindustriels.com"
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
                                                            value="0666221144"
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
                                                                value="Les Achats Industriels"
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
                                                                value="+212-522.36.57.97"
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
                                                            value="E-sourcing"
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
                                                                value="lesachatsindustriels.com"
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
                                                                <TextFieldFormsy
                                                                    className=""
                                                                    type="text"
                                                                    name="ice"
                                                                    id="ice"
                                                                    value="ice"
                                                                    label="ICE"
                                                                    fullWidth
                                                                    InputProps={{
                                                                        readOnly: true,
                                                                    }}
                                                                />

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
                                                                value="36, Rue Imam Al BOUKHARI, 20370 Maarif Extension"
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
                                                            value="Maroc"
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
                                                                value=""
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
                                                                value="20370"
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
                                                            value="Casablanca"
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
                                                            value=" "
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
                                            :
                                            ''
                                    ))
                            }



                        </div>
                    )
                    : ''
            }
            innerScroll
        />
    )
}

export default withReducer('demandesApp', reducer)(Demande);
