import React, { useEffect, useState } from 'react';
import {  Tab, Tabs, InputAdornment, Icon, Typography, Divider, Grid, Avatar,  IconButton, Chip, TextField, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy,  } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import _ from '@lodash';
import Formsy from 'formsy-react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactTable from "react-table";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    chip: {
        marginLeft: theme.spacing(1),
        padding: 2,
        background: '#ef5350',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20


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
    blue: {
        marginLeft: theme.spacing(1),
        padding: 2,
        background: '#3490dc',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20


    },
}));

function FournisseurDetails(props) {

    const dispatch = useDispatch();
    const classes = useStyles();
    const fournisseur = useSelector(({ FournisseurDetailsApp }) => FournisseurDetailsApp.fournisseur);
    const [tabValue, setTabValue] = useState(0);
    const params = props.match.params;
    const { fournisseurId } = params;


    useEffect(() => {

        function updateAcheteurState() {
            dispatch(Actions.getFournisseur(fournisseurId));
            dispatch(Actions.getAbonnements(fournisseurId));
            dispatch(Actions.getJetons(fournisseurId));
            dispatch(Actions.getBlackListes(fournisseurId));
        }
        updateAcheteurState();
        return () => {
            dispatch(Actions.cleanUpFournisseur())
        }
    }, [dispatch, fournisseurId]);

    useEffect(() => {
        if (fournisseurId)
            dispatch(Actions.getProduitsByFrs(fournisseurId, fournisseur.parametres));
    }, [dispatch, fournisseur.parametres, fournisseurId]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    //dispatch from function filter
    const run = (parametres) => (
        dispatch(Actions.setParametresDetail(parametres))
    )

    //call run function
    const fn =
        _.debounce(run, 1000);

    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !fournisseur.requestFournisseur ? fournisseur.data && (
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
                                    {fournisseur.data.avatar ?
                                        (
                                            <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded" alt="user photo" src={URL_SITE + fournisseur.data.avatar.url} />
                                        )
                                        :
                                        (
                                            <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded">
                                                {fournisseur.data.firstName[0]}
                                            </Avatar>
                                        )
                                    }
                                </FuseAnimate>
                                <div className="flex flex-col min-w-0">
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography className="text-16 sm:text-20 truncate">
                                            {fournisseur.data.firstName && fournisseur.data.lastName ? fournisseur.data.firstName + ' ' + fournisseur.data.lastName : 'NOM & Prénom'}
                                        </Typography>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="caption">{fournisseur.data.societe ? fournisseur.data.societe : 'Société'} {fournisseur.data.email ? ' | ' + fournisseur.data.email : ''}</Typography>
                                    </FuseAnimate>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                    <LinearProgress color="secondary" />
            }
            contentToolbar={
                !fournisseur.requestFournisseur ?
                    fournisseur.data && (
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
                            <Tab className="h-64 normal-case" label={"Produits " +
                                (fournisseur.loadingProduits ?
                                    '( chargement... )' :
                                    fournisseur.totalItems > 100 ?
                                        '( +99 )' : '( ' + fournisseur.totalItems + ' )')} />
                            <Tab className="h-64 normal-case" label={"Abonnements " +
                                (fournisseur.loadingAb ?
                                    '( chargement... )' :
                                    fournisseur.totalItemsAb > 100 ?
                                        '( +99 )' : '( ' + fournisseur.totalItemsAb + ' )')} />
                            <Tab className="h-64 normal-case" label={"Jetons " +
                                (fournisseur.loadingJt ?
                                    '( chargement... )' :
                                    fournisseur.totalItemsJt > 100 ?
                                        '( +99 )' : '( ' + fournisseur.totalItemsJt + ' )')} />
                            <Tab className="h-64 normal-case" label={"Blacklistes " +
                                (fournisseur.loadingBl ?
                                    '( chargement... )' :
                                    fournisseur.totalItemsBl > 100 ?
                                        '( +99 )' : '( ' + fournisseur.totalItemsBl + ' )')} />
                        </Tabs>)
                    :
                    <div className={classes.root}>
                        <LinearProgress color="secondary" />
                    </div>
            }
            content={
                !fournisseur.requestFournisseur ? fournisseur.data && (
                    <div className=" sm:p-10 max-w-2xl">
                        {tabValue === 0 && (
                            <Formsy
                                className="flex flex-col">

                                <Grid container spacing={3} className="mb-5">

                                    <Grid item xs={12} sm={4}>
                                        <div className="flex">
                                            <TextFieldFormsy
                                                className=""
                                                type="text"
                                                name="fullname"
                                                value={fournisseur.data.civilite + ' ' + fournisseur.data.firstName + ' ' + fournisseur.data.lastName}
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
                                                value={fournisseur.data.email}
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
                                            value={fournisseur.data.phone}
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
                                                value={fournisseur.data.societe}
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
                                                value={fournisseur.data.fix}
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
                                            id="produits"
                                            className=""
                                            name="produits"
                                            label="Produits"
                                            value={fournisseur.data.categories ? _.join(_.map(fournisseur.data.categories, 'name'), ', ') : ''}
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
                                                value={fournisseur.data.website}
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
                                                fournisseur.data.ice ?
                                                    <TextFieldFormsy
                                                        className=""
                                                        type="text"
                                                        name="ice"
                                                        id="ice"
                                                        value={fournisseur.data.ice}
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
                                                value={fournisseur.data.adresse1}
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
                                            value={fournisseur.data.pays ? fournisseur.data.pays.name : ''}
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
                                                value={fournisseur.data.adresse2}
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
                                                value={String(fournisseur.data.codepostal)}
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
                                            value={fournisseur.data.ville ? fournisseur.data.ville.name : ''}
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
                                            value={fournisseur.data.description}
                                            label="Présentation"
                                            multiline
                                            rows="10"
                                            InputProps={{
                                                readOnly: true,
                                            }}

                                        />

                                    </Grid>

                                </Grid>
                            </Formsy>
                        )
                        }
                        {tabValue === 1 && (
                            <ReactTable
                                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                getTheadProps={(state, rowInfo, column) => {
                                    return {
                                        className: "h-64 font-bold",

                                    }
                                }}
                                data={fournisseur.produits}
                                columns={[
                                    {
                                        Header: '',
                                        accessor: "featuredImageId",
                                        Cell: row => (
                                            row.original.featuredImageId ? (
                                                <img className="w-full block rounded" src={URL_SITE + row.original.featuredImageId.url} alt={row.original.reference} />
                                            ) : (
                                                    <img className="w-full block rounded" src="/assets/images/ecommerce/product-image-placeholder.png" alt={row.original.reference} />
                                                )

                                        ),
                                        className: "justify-center",
                                        width: 64,
                                        sortable: false,
                                        filterable: false,

                                    },
                                    {
                                        Header: "Ref",
                                        accessor: "reference",
                                        className: "justify-center",
                                        filterable: true,
                                        Cell: row => (
                                            <Tooltip title="Voir le produit">
                                                <Link target="_blank" to={'/products/' + row.original.id} onClick={(ev) => ev.stopPropagation()}>
                                                    {row.original.reference && row.original.reference}
                                                </Link>
                                            </Tooltip>
                                        ),

                                    },
                                    {
                                        Header: "Statut",
                                        accessor: "isValid",
                                        className: "justify-center",
                                        filterable: true,
                                        Cell: row => (
                                            <div className="flex items-center">

                                                {

                                                    !row.original.isValid
                                                        ?
                                                        <Chip className={classes.chipOrange} label="En attente" />
                                                        :
                                                        <Chip className={classes.chip2} label="Publié" />


                                                }
                                                {
                                                    row.original.isSelect ?
                                                        <Chip className={classes.chip2} label="Produit de la semaine" />
                                                        : ''
                                                }
                                            </div>
                                        ),
                                        Filter: ({ filter, onChange }) =>
                                            <select
                                                onChange={event => onChange(event.target.value)}
                                                style={{ width: "100%" }}
                                                value={filter ? filter.value : ""}
                                            >
                                                <option value="">Tous</option>
                                                <option value="true">Publié</option>
                                                <option value="false">En attente</option>
                                            </select>

                                    },
                                    {
                                        Header: "Titre",
                                        accessor: "titre",
                                        className: "justify-center",
                                        filterable: true,

                                    },
                                    {
                                        Header: "Secteur",
                                        className: "justify-center",
                                        filterable: true,
                                        accessor: "secteur.name",
                                        Cell: row => row.original.secteur ? row.original.secteur.name : 'N/A'
                                    },
                                    {
                                        Header: "Activité",
                                        className: "justify-center",
                                        filterable: true,
                                        accessor: "sousSecteurs.name",
                                        Cell: row => row.original.sousSecteurs ? row.original.sousSecteurs.name : 'N/A'
                                    },
                                    {
                                        Header: "Produit",
                                        className: "justify-center",
                                        filterable: true,
                                        accessor: "categorie.name",
                                        Cell: row => row.original.categorie ? row.original.categorie.name : 'N/A'
                                    },
                                    {
                                        Header: "Date de création",
                                        filterable: true,
                                        className: "justify-center",
                                        accessor: "created",
                                        Cell: row => moment(row.original.created).format('DD/MM/YYYY'),
                                        Filter: ({ filter, onChange }) =>
                                            <TextField
                                                onChange={event => onChange(event.target.value)}
                                                style={{ width: "100%" }}
                                                value={filter ? filter.value : ""}
                                                type="date"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />,
                                    },

                                ]}
                                manual
                                pages={fournisseur.pageCount}
                                defaultPageSize={10}
                                loading={fournisseur.loadingProduits}
                                showPageSizeOptions={false}
                                onPageChange={(pageIndex) => {
                                    fournisseur.parametres.page = pageIndex + 1;
                                    dispatch(Actions.setParametresData(fournisseur.parametres))
                                }}
                                onSortedChange={(newSorted, column, shiftKey) => {
                                    fournisseur.parametres.page = 1;
                                    fournisseur.parametres.filter.id = newSorted[0].id;
                                    fournisseur.parametres.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
                                    dispatch(Actions.setParametresData(fournisseur.parametres))
                                }}
                                onFilteredChange={filtered => {
                                    fournisseur.parametres.page = 1;
                                    fournisseur.parametres.search = filtered;
                                    fn(fournisseur.parametres);
                                }}
                                noDataText="Aucun produit trouvé"
                                loadingText='Chargement...'
                                ofText='sur'
                            />
                        )
                        }
                        {tabValue === 2 && (
                            <ReactTable
                                className="-striped -highlight sm:rounded-16 overflow-hidden"
                                getTrProps={(state, rowInfo, column) => {
                                    return {
                                        className: "h-64",

                                    }
                                }}
                                getTheadProps={(state, rowInfo, column) => {
                                    return {
                                        className: "h-64 font-bold",

                                    }
                                }}

                                data={fournisseur.abonnements}
                                columns={[
                                    {
                                        Header: "Offre",
                                        className: "font-bold justify-center",
                                        sortable: false,
                                        id: "offre",
                                        accessor: f => f.offre.name,
                                    },
                                    {
                                        Header: "Activités",
                                        accessor: "sousSecteurs.name",
                                        className: "justify-center",
                                        Cell: row =>
                                            (<Tooltip
                                                title={_.join(_.map(row.original.sousSecteurs, 'name'), ', ')}
                                            >
                                                <Chip className={classes.chip2} label={row.original.sousSecteurs.length} />
                                            </Tooltip>)


                                    },
                                    {
                                        Header: "Date de création",
                                        className: "justify-center",
                                        accessor: "created",
                                        sortable: false,
                                        filterable: false,
                                        Cell: row => moment(row.original.created).format('DD/MM/YYYY')
                                    },
                                    {
                                        Header: "Renouvellement",
                                        className: "justify-center",
                                        sortable: false,
                                        accessor: "expired",
                                        filterable: false,
                                        Cell: row => (
                                            row.original.expired &&
                                            moment(row.original.expired).format('DD/MM/YYYY')
                                        )
                                    },
                                    {
                                        Header: "Statut",
                                        className: "justify-center",
                                        sortable: false,
                                        filterable: false,
                                        Cell: row => (
                                            <div className="flex items-center">
                                                {
                                                    row.original.statut === false
                                                        ?
                                                        (
                                                            !row.original.expired || row.original.expired === undefined
                                                                ?
                                                                <Chip className={classes.chipOrange} label="En attente" />
                                                                :
                                                                (
                                                                    moment(row.original.expired) >= moment()
                                                                        ?
                                                                        <Chip className={classes.chip} label="Annulée" />
                                                                        :
                                                                        <Chip className={classes.chip} label="Expiré" />
                                                                )

                                                        )
                                                        :
                                                        (
                                                            moment(row.original.expired) >= moment()
                                                                ?
                                                                <Chip className={classes.chip2} label="En cours" />
                                                                :
                                                                <Chip className={classes.chip} label="Expiré" />
                                                        )
                                                }

                                            </div>
                                        )
                                    },
                                    {
                                        Header: "",
                                        className: "justify-center",
                                        accessor: "type",
                                        Cell: row => (
                                            <div className="flex items-center">

                                                {

                                                    row.original.type === false
                                                        ?
                                                        <Chip className={classes.blue} label="Nouvelle" />
                                                        :
                                                        <Chip className={classes.chip2} label="Renouvellement" />


                                                }

                                            </div>
                                        ),


                                    },
                                    {
                                        Header: "",
                                        Cell: row => (
                                            <div className="flex items-center">
                                                {
                                                    (moment(row.original.expired) >= moment() || !row.original.expired) &&
                                                    <Tooltip title="Editer" >
                                                        <IconButton className="text-orange text-20"
                                                            onClick={() =>
                                                                props.history.push('/admin/offres/abonnement/' + row.original.id)
                                                            }
                                                        >
                                                            <Icon>edit</Icon>
                                                        </IconButton>
                                                    </Tooltip>
                                                }

                                                {
                                                    row.original.statut === true
                                                    &&
                                                    (
                                                        (moment(row.original.expired).diff(moment(), 'month', true) <= 1 && moment(row.original.expired).diff(moment(), 'month', true) > 0)
                                                        &&
                                                        <Tooltip title="Renouveler" >
                                                            <IconButton
                                                                onClick={() => {
                                                                    props.history.push('/admin/offres/renouvellement/' + row.original.id + '/1');
                                                                }} className="text-teal text-20">
                                                                <Icon>autorenew</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    )

                                                }

                                                {
                                                    row.original.statut === true
                                                    &&
                                                    (
                                                        moment(row.original.expired) < moment()
                                                        &&
                                                        <Tooltip title="Dupliquer" >
                                                            <IconButton
                                                                onClick={() => {
                                                                    props.history.push('/admin/offres/renouvellement/' + row.original.id + '/2');
                                                                }} className="text-green-700 text-20">
                                                                <Icon>file_copy</Icon>
                                                            </IconButton>
                                                        </Tooltip>
                                                    )

                                                }
                                            </div>
                                        )
                                    }
                                ]}
                                defaultPageSize={10}
                                loading={fournisseur.loadingAb}
                                noDataText="Pas d'abonnement trouvé"
                                loadingText='Chargement...'
                                ofText='sur'
                            />
                        )
                        }
                        {tabValue === 3 && (
                            <ReactTable
                                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                getTheadProps={(state, rowInfo, column) => {
                                    return {
                                        className: "h-64 font-bold",

                                    }
                                }}
                                data={fournisseur.jetons}
                                columns={[
                                    {
                                        Header: "Nombre de jetons",
                                        className: "justify-center font-bold",
                                        accessor: "nbrJeton",
                                    },
                                    {
                                        Header: "Mode de paiement",
                                        className: "justify-center",

                                        accessor: "paiement.name",
                                        Cell: row => row.original.paiement ? row.original.paiement.name : '',
                                    },
                                    {
                                        Header: "Prix",
                                        className: "justify-center",

                                        accessor: "prix",
                                        Cell: row => parseFloat(row.original.prix).toLocaleString(
                                            'fr', // leave undefined to use the browser's locale,
                                            // or use a string like 'en-US' to override it.
                                            { minimumFractionDigits: 2 }
                                        ) + ' Dhs ',
                                    },
                                    {
                                        Header: "Etat",
                                        className: "justify-center",

                                        accessor: "isPayed",
                                        Cell: row => row.original.isPayed ?
                                            <Chip className={classes.chip2} label="Payé" /> :
                                            <Chip className={classes.chipOrange} label="En attente" />,


                                    },
                                    {
                                        Header: "Date de création",
                                        className: "justify-center",

                                        accessor: "created",
                                        Cell: row => moment(row.original.created).format('DD/MM/YYYY HH:mm'),
                                    },
                                ]}
                                defaultPageSize={10}
                                loading={fournisseur.loadingJt}
                                noDataText="Aucun jeton trouvé"
                                loadingText='Chargement...'
                                ofText='sur'
                            />
                        )}
                        {tabValue === 4 && (
                            <ReactTable
                                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                getTheadProps={(state, rowInfo, column) => {
                                    return {
                                        className: "h-64 font-bold",
                                    }
                                }}
                                data={fournisseur.blacklistes}
                                columns={[
                                    {
                                        Header: "Acheteur",
                                        className: "font-bold justify-center",
                                        filterable: true,
                                        accessor: "acheteur",
                                        Cell: row =>
                                            <Tooltip title="Détails de l'acheteur">
                                                <Link target="_blank" to={'/users/acheteur/show/' + row.original.acheteur.id} onClick={(ev) => ev.stopPropagation()}>
                                                    {row.original.acheteur.societe && row.original.acheteur.societe}
                                                </Link>
                                            </Tooltip>

                                    },
                                    {
                                        Header: "Raison",
                                        accessor: "raison",
                                        filterable: true,
                                        className: "justify-center",
                                    },
                                    {
                                        Header: "Date de Blackliste",
                                        className: "justify-center",
                                        id: "created",
                                        accessor: d => moment(d.created).format('DD/MM/YYYY HH:mm'),
                                    },
                                    {
                                        Header: "Date de Déblackliste",
                                        className: "justify-center",
                                        id: "deblacklister",
                                        accessor: d => d.deblacklister ? moment(d.deblacklister).format('DD/MM/YYYY HH:mm') : '',
                                    },
                                    {
                                        Header: "Etat",
                                        className: "justify-center",
                                        accessor: "etat",
                                        Cell: row =>
                                            row.original.etat ?
                                                'Blacklisté' :
                                                'Retiré'
                                    },
                                ]}
                                defaultPageSize={10}
                                loading={fournisseur.loadingBl}
                                noDataText="Aucun fournisseur blacklisté"
                                ofText='sur'
                            />
                        )

                        }
                    </div>
                )
                    : ""
            }
            innerScroll
        />
    )
}

export default withReducer('FournisseurDetailsApp', reducer)(FournisseurDetails);
