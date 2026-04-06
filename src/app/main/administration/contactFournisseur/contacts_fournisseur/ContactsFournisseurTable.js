import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip, TextField, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
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
        padding: '0 8px',
        background: '#FB4848',
        color: 'white',
        fontWeight: 600,
        fontSize: '11px',
        height: 22,
        borderRadius: 4
    },
    chip2: {
        marginLeft: theme.spacing(1),
        padding: '0 8px',
        background: '#10B981',
        color: 'white',
        fontWeight: 600,
        fontSize: '11px',
        height: 22,
        borderRadius: 4
    },
    chipOrange: {
        marginLeft: theme.spacing(1),
        padding: '0 8px',
        background: '#FFB810',
        color: 'white',
        fontWeight: 600,
        fontSize: '11px',
        height: 22,
        borderRadius: 4
    },
}));
function ContactsFournisseurTable(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const contactsFournisseur = useSelector(({ contactsFournisseurApp }) => contactsFournisseurApp.contactsFournisseur.data);
    const loading = useSelector(({ contactsFournisseurApp }) => contactsFournisseurApp.contactsFournisseur.loading);
    const pageCount = useSelector(({ contactsFournisseurApp }) => contactsFournisseurApp.contactsFournisseur.pageCount);
    const parametres = useSelector(({ contactsFournisseurApp }) => contactsFournisseurApp.contactsFournisseur.parametres);

    const searchText = useSelector(({ contactsFournisseurApp }) => contactsFournisseurApp.contactsFournisseur.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (contactsFournisseur) {
            setFilteredData(getFilteredArray(contactsFournisseur, searchText));
        }
    }, [contactsFournisseur, searchText]);



    if (!filteredData) {
        return null;
    }

    const run = (parametres) =>
        dispatch(Actions.setParametresData(parametres))

    //call run function
    const fn =
        _.debounce(run, 1000);


    return (
        <div className="w-full flex flex-col">


            <FuseAnimate animation="transition.slideUpIn" delay={300}>

                <ReactTable

                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64 cursor-pointer",
                            onClick: (e, handleOriginal) => {
                                if (rowInfo) {
                                    props.history.push('/contact_fournisseur/' + rowInfo.original.id);
                                }
                            }
                        }
                    }}
                    getTheadProps={(state, rowInfo, column) => {
                        return {
                            className: "h-64",

                        }
                    }}

                    data={filteredData}
                    columns={[

                        {
                            Header: "Fournisseur",
                            className: "font-bold",
                            accessor: "fournisseur.societe",
                            filterable: true,
                            Cell: row => row.original.fournisseur ? row.original.fournisseur.societe : ''
                        },


                        {
                            Header: "Nom Contact",
                            accessor: "contact",
                            filterable: true,
                            Cell: row => row.original.contact ? row.original.contact : ''
                        },

                        {
                            Header: "Téléphone",
                            accessor: "phone",
                            filterable: true,
                            Cell: row => row.original.phone ? row.original.phone : ''
                        },
                        {
                            Header: "Email",
                            accessor: "email",
                            filterable: true,
                            Cell: row => row.original.email ? row.original.email : ''
                        },

                        {
                            Header: "Message",
                            accessor: "message",
                            filterable: true,
                            Cell: row =>
                                _.truncate(row.original.message, {
                                    'length': 36,
                                    'separator': ' '
                                })

                        },
                        {
                            Header: "Date de création",
                            accessor: "created",
                            filterable: true,
                            Cell: row => moment(row.original.created).format('DD/MM/YYYY HH:mm'),
                            Filter: ({ filter, onChange }) =>
                                <TextField
                                    onChange={event => onChange(event.target.value)}
                                    style={{ width: "100%" }}
                                    value={filter ? filter.value : ""}
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                        },

                        {
                            Header: "Statut",
                            accessor: "statut",
                            filterable: true,
                            Cell: row => (
                                <div className="flex items-center">

                                    {

                                        row.original.statut === false
                                            ?
                                            <Chip className={classes.chipOrange} label="En attente" />
                                            :
                                            <Chip className={classes.chip2} label="Validé" />


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
                                    <option value="true">Validé</option>
                                    <option value="false">En attente</option>
                                </select>

                        },


                        {
                            Header: "",
                            Cell: row => (
                                <div className="flex items-center">
                                    {
                                        row.original.statut !== 1 ?
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
                                                                            Voulez vous vraiment supprimer cet enregistrement ?
                                                                        </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions>
                                                                        <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
                                                                            Non
                                                                        </Button>
                                                                        <Button
                                                                            onClick={(ev) => {
                                                                                dispatch(Actions.removeMessage(row.original, parametres));
                                                                                dispatch(Actions.closeDialog())
                                                                            }} color="primary"
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
                        fn(parametres);
                    }}
                    noDataText="Aucun message trouvé"
                    loadingText='Chargement...'
                    ofText='sur'
                />
            </FuseAnimate>




        </div>
    );
}

export default withRouter(ContactsFournisseurTable);
