import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from '../store/actions';

function SuggestionsTable(props) {
    const suggestions = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.entities);
    const loading = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.loading);
    const searchText = useSelector(({ suggestionsApp }) => suggestionsApp.suggestions.searchText);
    const dispatch = useDispatch();

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (suggestions) {
            const arr = Object.values(suggestions);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [suggestions, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Suggestions de Nouveaux Secteurs"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/parametres/suggestions/' + row.id)}
            columns={[
                {
                    Header: "Société / Utilisateur",
                    accessor: "user",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                {row.original.user?.societe || 'N/A'}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>
                                ID: #{row.original.id}
                            </Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Secteur Proposé",
                    accessor: "secteur",
                    Cell: row => (
                        <div className="flex flex-col gap-4">
                            <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>{row.original.secteur || 'N/A'}</Typography>
                            <div className="flex flex-wrap gap-4">
                                {row.original.sousSecteur && (
                                    <div className="px-8 py-2 rounded-4 bg-slate-50 border border-slate-100 text-11 font-600 text-slate-500 uppercase">
                                        Activité: {row.original.sousSecteur}
                                    </div>
                                )}
                            </div>
                        </div>
                    ),
                    minWidth: 250
                },
                {
                    Header: "Produit/Catégorie",
                    accessor: "categorie",
                    Cell: row => (
                        <Typography className="text-13 font-500 text-slate-600">{row.original.categorie || 'N/A'}</Typography>
                    ),
                    width: 200
                },
                {
                    Header: "Actions",
                    width: 100,
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                             <IconButton 
                                size="small" 
                                style={{ color: '#319795', backgroundColor: 'rgba(49, 151, 149, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    props.history.push('/parametres/suggestions/' + row.original.id);
                                }}
                            >
                                <Icon className="text-18">edit</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle>Confirmation</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>Voulez-vous vraiment supprimer cette suggestion ?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removeSuggestion(row.original));
                                                            dispatch(Actions.closeDialog());
                                                        }}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                </DialogActions>
                                            </React.Fragment>
                                        )
                                    }));
                                }}
                            >
                                <Icon className="text-18">delete</Icon>
                            </IconButton>
                        </div>
                    ),
                }
            ]}
        />
    );
}

export default withRouter(SuggestionsTable);
