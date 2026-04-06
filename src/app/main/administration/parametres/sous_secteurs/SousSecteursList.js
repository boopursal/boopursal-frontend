import React, { useEffect, useState } from 'react';
import { Icon, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from "react-table";
import * as Actions from './store/actions';
import _ from '@lodash';

function SousSecteursList(props) {
    const dispatch = useDispatch();
    const SousSecteurs = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.entities);
    const pageCount = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.pageCount);
    const loading = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.loading);
    const parametres = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.parametres);
    const searchText = useSelector(({ sous_secteursApp }) => sous_secteursApp.sous_secteurs.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        dispatch(Actions.getSecteurs());
    }, [dispatch]);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (SousSecteurs) {
            setFilteredData(getFilteredArray(SousSecteurs, searchText));
        }
    }, [SousSecteurs, searchText]);


    if (!filteredData) {
        return null;
    }



    //dispatch from function filter
    const run = (parametres) => (
        dispatch(Actions.setParametresData(parametres))
    )

    //call run function
    const fn =
        _.debounce(run, 700);

    return (

        <FuseAnimate animation="transition.slideUpIn" delay={300}>

            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "cursor-pointer",
                        onClick: (e, handleOriginal) => {
                            if (rowInfo) {
                                dispatch(Actions.openEditSousSecteursDialog(rowInfo.original));
                            }
                        }
                    }
                }}
                data={filteredData}
                columns={[


                    {
                        Header: "Activité",
                        accessor: "name",
                        filterable: true,
                    },
                    {
                        Header: "Secteur",
                        accessor: "secteur.name",
                        filterable: true,
                        Cell: row => (
                            <div className="flex items-center">
                                {row.original.secteur ? row.original.secteur.name : ''}
                            </div>
                        )
                    },
                    {
                        Header: "",
                        sortable: false,
                        width: 64,
                        Cell: row => (
                            <div className="flex items-center">

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
                                                                dispatch(Actions.removeSousSecteur(row.original, parametres));
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
                noDataText="Aucune activité trouvée"
                loadingText='Chargement...'
                ofText='sur'
            />
        </FuseAnimate>
    );
}

export default SousSecteursList;
