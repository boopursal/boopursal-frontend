import React, { useEffect, useState } from 'react';
import { Chip, Tooltip, IconButton, Icon, TextField, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseAnimate,URL_SITE,FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import ReactTable from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';
import clsx from 'clsx';

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

    chip3: {
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
function ProduitsTable(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const produits = useSelector(({ produitsFournisseursApp }) => produitsFournisseursApp.produits.data);
    const loading = useSelector(({ produitsFournisseursApp }) => produitsFournisseursApp.produits.loading);
    const pageCount = useSelector(({ produitsFournisseursApp }) => produitsFournisseursApp.produits.pageCount);
    const parametres = useSelector(({ produitsFournisseursApp }) => produitsFournisseursApp.produits.parametres);
    const user = useSelector(({ auth }) => auth.user);
    const searchText = useSelector(({ produitsFournisseursApp }) => produitsFournisseursApp.produits.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (produits) {
            setFilteredData(getFilteredArray(produits, searchText));
        }

    }, [produits, searchText]);



    if (!filteredData) {
        return null;
    }

    const run = (parametres) =>
        dispatch(Actions.setParametresData(parametres))

    //call run function
    const fn =
        _.debounce(run, 1000);

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <div className="overflow-x-auto">
                <ReactTable
                    className="-striped -highlight h-full sm:rounded-16 border-2"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 cursor-pointer",
                        onClick: (e, handleOriginal) => {
                            if (rowInfo) {
                                props.history.push('/produits/' + rowInfo.original.id);
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
                        Header: '',
                        accessor: "featuredImageId",
                        Cell: row => (
                            <div className="flex items-center relative ">
                                {
                                    row.original.featuredImageId ? (
                                        <img className={clsx("w-full block rounded")} src={URL_SITE + row.original.featuredImageId.url} alt={row.original.reference} />
                                    ) : (
                                            <img className={clsx("w-full block rounded")} src="/assets/images/ecommerce/product-image-placeholder.png" alt={row.original.reference} />
                                        )
                                }
                                {
                                    row.original.free ?
                                        <Chip className={clsx("absolute bottom-2 left-1", classes.chip3)} label="Free" />
                                        : ''
                                }
                            </div>


                        ),
                        className: "justify-center ",
                        width: 64,
                        sortable: false,
                        filterable: false,

                    },
                    {
                        Header: "Statut",
                        accessor: "isValid",
                        className: "justify-center ",
                        sortable: false,
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
                                        <Chip className={classes.chip2} label="Focus produit" />
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
                        Header: "Images",
                        className: "justify-center ",
                        accessor: "images",
                        sortable: false,
                        filterable: false,
                        Cell: row => (
                            <div className="flex items-center">
                                {row.original.images.length}
                            </div>
                        ),


                    },
                    {
                        Header: "Ref",
                        className: "justify-center ",
                        accessor: "reference",
                        filterable: true,
                    },
                    {
                        Header: "Titre",
                        accessor: "titre",
                        filterable: true,
                    },
                    {
                        Header: "Produit",
                        className: "justify-center ",
                        filterable: true,
                        accessor: "categorie.name",
                        Cell: row => row.original.categorie ? row.original.categorie.name : 'N/A'
                    },
                    {
                        Header: "Date de création",
                        className: "justify-center ",
                        filterable: true,
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


                    {
                        Header: "",
                        Cell: row => (
                            <div className="flex items-center">

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
                                                                    dispatch(Actions.removeProduit(row.original, parametres, user))
                                                                    dispatch(Actions.closeDialog())
                                                                }}
                                                                color="primary"
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
                                <Tooltip title="Modifier" >
                                    <IconButton className="text-orange text-20">
                                        <Icon>edit</Icon>
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
                    fn(parametres);
                }}
                noDataText="Aucun produit trouvé"
                loadingText='Chargement...'
                ofText='sur'
            />
            </div>
        </FuseAnimate>
    );
}

export default withRouter(ProduitsTable);
