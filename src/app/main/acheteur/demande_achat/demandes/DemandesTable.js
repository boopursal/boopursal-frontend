import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip, TextField, InputAdornment, DialogTitle, DialogContent, DialogActions, DialogContentText, Button } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import ReactTable from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';

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
}));
function DemandesTable(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const demandes = useSelector(({ demandesAcheteurApp }) => demandesAcheteurApp.demandes.data);
    const loading = useSelector(({ demandesAcheteurApp }) => demandesAcheteurApp.demandes.loading);
    const pageCount = useSelector(({ demandesAcheteurApp }) => demandesAcheteurApp.demandes.pageCount);
    const parametres = useSelector(({ demandesAcheteurApp }) => demandesAcheteurApp.demandes.parametres);
    const user = useSelector(({ auth }) => auth.user);
    const searchText = useSelector(({ demandesAcheteurApp }) => demandesAcheteurApp.demandes.searchText);

    const [filteredData, setFilteredData] = useState(null);
    const [countdownData, setCountdownData] = useState([]);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (demandes) {
            setFilteredData(getFilteredArray(demandes, searchText));
            setCountdownData(getFilteredArray(demandes, searchText)); // Ajout des données pour le compte à rebours
        }
    }, [demandes, searchText]);

    // Fonction pour calculer le temps restant
    const calculateRemainingTime = (dateExpiration) => {
        const endDate = moment(dateExpiration);
        const remainingTime = endDate.diff(moment(), 'seconds'); // Temps restant en secondes

        if (remainingTime <= 0) {
            return { timeLeft: 'Expiré', className: classes.chip };
        }

        const days = Math.floor(remainingTime / (3600 * 24));
        const hours = Math.floor((remainingTime % (3600 * 24)) / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        return {
            timeLeft: `${days}j ${hours}h ${minutes}m ${seconds}s`,
            className: classes.chipOrange
        };
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdownData((prevData) =>
                prevData.map((item) => ({
                    ...item,
                    timeLeft: calculateRemainingTime(item.dateExpiration).timeLeft,
                }))
            );
        }, 1000); // Mise à jour toutes les secondes

        return () => clearInterval(interval); // Nettoyage de l'intervalle lors de la destruction du composant
    }, []);

    // Si les données filtrées ne sont pas disponibles
    if (!filteredData) {
        return null;
    }

    const getExpirationLabel = (dateExpiration) => {
        const remainingDays = moment(dateExpiration).diff(moment(), 'days');
        if (remainingDays > 7) {
            return { label: `${remainingDays} jours`, className: classes.chip2 };
        } else if (remainingDays > 0) {
            return { label: `${remainingDays} jours`, className: classes.chipOrange };
        } else {
            return { label: "Expiré", className: classes.chip };
        }
    };

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <div className="overflow-x-auto">
                <ReactTable
                    className="-striped -highlight h-full sm:rounded-16"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 cursor-pointer",
                        onClick: (e, handleOriginal) => {
                            if (rowInfo) {
                                props.history.push('/demandes/' + rowInfo.original.id);
                            }
                        }
                    }
                }}
                getTheadProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 font-bold",

                    }
                }}

                data={filteredData}
                columns={[
                    {
                        accessor: "statut",
                        Header: "Statut",
                        filterable: true,
                        sortable: false,
                        Cell: row => (
                            <div className="flex items-center">

                                {
                                    row.original.statut === 3 ?
                                        <Chip className={classes.chip2} label="Adjugé" /> :
                                        moment(row.original.dateExpiration) >= moment()
                                            ?
                                            row.original.statut === 0
                                                ?
                                                <Chip className={classes.chipOrange} label="En attente" />
                                                :
                                                (row.original.statut === 1 ? <Chip className={classes.chip2} label="En cours" />
                                                    :
                                                    <Chip className={classes.chip} label="Refusée" />
                                                )
                                            :
                                            <Chip className={classes.chip} label="Expiré" />

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
                                <option value="0">En attente</option>
                                <option value="1">En cours</option>
                                <option value="2">Refusée</option>
                                <option value="3">Adjugée</option>
                                <option value="4">Expirée</option>
                            </select>

                    },
                    {
                        Header: "Référence",
                        className: "font-bold",
                        filterable: true,
                        accessor: "reference",
                        Cell: row => row.original.reference ? 'RFQ-' + row.original.reference : 'En attente',
                        Filter: ({ filter, onChange }) =>
                            <TextField
                                onChange={event => onChange(event.target.value)}
                                style={{ width: "100%" }}
                                value={filter ? filter.value : ""}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">RFQ-</InputAdornment>,
                                }}
                            />
                        ,
                    },
                    {
                        Header: "Titre",
                        accessor: "titre",
                        filterable: true,
                        Cell: row => (
                            <div className="flex items-center">
                                {_.capitalize(_.truncate(row.original.titre, {
                                    'length': 15,
                                    'separator': ' '
                                }))}
                            </div>
                        )
                    },
                    {
                        Header: "Activités",
                        filterable: true,
                        accessor: "categories.name",
                        Cell: row =>
                            _.truncate(_.join(_.map(row.original.categories, 'name'), ', '), {
                                'length': 15,
                                'separator': ' '
                            })

                    },
                    {
                        Header: "Diffuser à l'échelle",
                        filterable: true,
                        accessor: "localisation",
                        Cell: row => {
                            let localisation = row.original.localisation;
                            
                            // Si localisation est un tableau (ou un string qu'on split), on gère l'affichage
                            if (typeof localisation === 'string' && localisation.includes(',')) {
                                localisation = localisation.split(',');
                            }

                            if (localisation === "Tout le monde" || (Array.isArray(localisation) && localisation.includes("Tout le monde"))) {
                                return <span>Tous les pays</span>;
                            }
                    
                            if (localisation === "2" || localisation === 2 || (Array.isArray(localisation) && localisation.includes("2"))) {
                                return <span>Locale</span>;
                            }
                    
                            if (!localisation) {
                                return <span>Zone Internationale</span>;
                            }
                    
                            // Si localisation est un tableau (codes pays), ou une string unique (zone/pays)
                            if (Array.isArray(localisation)) {
                                return (
                                    <div className="flex flex-wrap items-center gap-2">
                                        {localisation.map((code, index) => (
                                            code.length === 2 ? (
                                                <img
                                                    key={code || index}
                                                    src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
                                                    alt={code}
                                                    title={code}
                                                    style={{ width: "20px", height: "15px", borderRadius: "2px" }}
                                                />
                                            ) : (
                                                <span key={code || index}>{code}</span>
                                            )
                                        ))}
                                    </div>
                                );
                            }
                            
                            // Si c'est une string unique qui n'est pas "2" ou "Tout le monde" (ex: "EU", "FR")
                            if (typeof localisation === "string") {
                                if (localisation.length === 2) {
                                    return (
                                        <img
                                            src={`https://flagcdn.com/w40/${localisation.toLowerCase()}.png`}
                                            alt={localisation}
                                            title={localisation}
                                            style={{ width: "20px", height: "15px", borderRadius: "2px" }}
                                        />
                                    );
                                }
                                return <span>{localisation}</span>;
                            }
                            
                            return <span>Zone Internationale</span>;
                        }
                    }
                    
                    ,
                    
                    
                    
                    
                    
                    
                    
                    {
                        Header: "Budget",
                        filterable: true,
                        accessor: "budget",
                        Cell: row =>
                            (
                                <>
                                    {
                                        row.original.budget ? 
                                        parseFloat(row.original.budget).toLocaleString(
                                            'fr', 
                                            { minimumFractionDigits: 2 }
                                        ) : '-'
                                    }
                                    &ensp;
                                    {
                                        row.original.currency && row.original.currency.name
                                    }
                                </>
                            )

                    },
                    {
                        Header: "Publiée",
                        filterable: true,
                        accessor: "is_public",
                        Cell: row =>
                            row.original.is_public ?
                                (
                                    <Tooltip title="Publiée">
                                        <IconButton className="text-green text-20" onClick={(ev) => {
                                            ev.stopPropagation();
                                            dispatch(Actions.PublishDemande(row.original, false, parametres, user.id))

                                        }}>
                                            <Icon>check_circle</Icon>
                                        </IconButton>
                                    </Tooltip>
                                ) :
                                (
                                    <Tooltip title="Privée">
                                        <IconButton className="text-red text-20" onClick={(ev) => {
                                            ev.stopPropagation();
                                            dispatch(Actions.PublishDemande(row.original, true, parametres, user.id))

                                        }} >
                                            <Icon>remove_circle</Icon>
                                        </IconButton>
                                    </Tooltip>
                                ),
                        Filter: ({ filter, onChange }) =>
                            <select
                                onChange={event => onChange(event.target.value)}
                                style={{ width: "100%" }}
                                value={filter ? filter.value : ""}
                            >
                                <option value="">Tous</option>
                                <option value="true">Publiée</option>
                                <option value="false">Privée</option>
                            </select>


                    },

                    {
                        Header: "Échéance",
                        accessor: "dateExpiration",
                        filterable: true,
                        minWidth: 125,
                        Cell: row => {
                            const { timeLeft, className } = calculateRemainingTime(row.original.dateExpiration);
                            return (
                                <div className="flex flex-col items-center">
                                <span>{moment(row.original.dateExpiration).format('DD/MM/YYYY')}</span>
                                <Chip className={className} label={timeLeft} />
                            </div>
                            
                            );
                        }
                    },
                    {
                        Header: "Date de création",
                        accessor: "created",
                        filterable: true,
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
                    {
                        Header: "",
                        Cell: row => (
                            <div className="flex items-center">
                                {
                                    row.original.statut !== 1 && (row.original.diffusionsdemandes || []).length === 0 ?
                                        <Tooltip title="Supprimer" >
                                            <IconButton className="text-red text-20"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    dispatch(Actions.openDialog({
                                                        children: (
                                                            <React.Fragment>
                                                                <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                                                <DialogContent>
                                                                    <DialogContentText id="alert-dialog-description">
                                                                        Voulez vous vraiment supprimer cette demande ?
                                                                    </DialogContentText>
                                                                </DialogContent>
                                                                <DialogActions>
                                                                    <Button variant="outlined" onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                                        Non
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={(ev) => {
                                                                            dispatch(Actions.removeDemande(row.original, parametres, user.id));
                                                                            dispatch(Actions.closeDialog())
                                                                        }}
                                                                        autoFocus>
                                                                        Oui
                                                                </Button>

                                                                </DialogActions>
                                                            </React.Fragment>
                                                        )
                                                    }))
                                                }}
                                            >
                                                <Icon>delete</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        : <Tooltip title="Interdit!" >
                                            <IconButton className="text-20 cursor-not-allowed disable"
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                }}

                                            >
                                                <Icon>delete</Icon>
                                            </IconButton>
                                        </Tooltip>
                                }
                                <Tooltip title="Détails" >
                                    <IconButton className="text-teal text-20">
                                        <Icon>remove_red_eye</Icon>
                                    </IconButton>
                                </Tooltip>


                            </div>
                        )
                    }
                ]}
                manual

                defaultSortDesc={true}
                pages={pageCount}
                page={parametres.page - 1}
                defaultPageSize={10}
                loading={loading}
                showPageSizeOptions={false}
                onPageChange={(pageIndex) => {
                    parametres.page = pageIndex + 1;
                    dispatch(Actions.setParametresData(parametres))
                }}

                onSortedChange={(newSorted, column, shiftKey) => {
                    parametres.page = 1;
                    parametres.filter.id = newSorted[0].id;
                    parametres.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
                    dispatch(Actions.setParametresData(parametres))
                }}
                onFilteredChange={filtered => {
                    parametres.page = 1;
                    parametres.search = filtered;
                    //fn(parametres);
                }}
                noDataText="Aucune demande trouvée"
                loadingText='Chargement...'
                ofText='sur'
            />
            </div>
        </FuseAnimate>
    );
}

export default withRouter(DemandesTable);
