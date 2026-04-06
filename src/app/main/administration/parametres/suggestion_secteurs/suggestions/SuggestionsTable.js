import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from "react-table";
import * as Actions from '../store/actions';

function SuggestionsTable(props) {
    const suggestions = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.entities);
    const loading = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.loading);
    const searchText = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.searchText);
    const dispatch = useDispatch();

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (suggestions) {
            setFilteredData(getFilteredArray(suggestions, searchText));
        }
    }, [suggestions, searchText]);



    if (!filteredData) {
        return null;
    }


    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "h-64 cursor-pointer",
                        onClick: (e, handleOriginal) => {
                            if (rowInfo) {
                                props.history.push('/parametres/suggestions/' + rowInfo.original.id);
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
                        Header: "Societé",
                        filterable: true,
                        accessor: "user",
                        className: "font-bold",
                        Cell: row => (row.original.user && row.original.user.societe ? row.original.user.societe : 'N/A')
                    },
                    {
                        Header: "Secteur",
                        filterable: true,
                        accessor: "secteur",
                    },
                    {
                        Header: "Activité",
                        filterable: true,
                        accessor: "sousSecteur",
                    },
                    {
                        Header: "Produit",
                        filterable: true,
                        accessor: "categorie",
                    },
                    {
                        Header: "Page",
                        filterable: true,
                        accessor: "pageSuggestion",
                    },
                    {
                        Header: "",
                        Cell: row => (
                            <div className="flex items-center">

                                <Tooltip title="Editer" >
                                    <IconButton className="text-teal text-20">
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </Tooltip>

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
                                                                    dispatch(Actions.removeSuggestion(row.original));
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

                            </div>
                        )
                    }
                ]}
                defaultPageSize={10}
                loading={loading}
                noDataText="Aucune suggestion trouvée"
                loadingText='Chargement...'
                ofText='sur'

            />
        </FuseAnimate>
    );
}

export default withRouter(SuggestionsTable);
