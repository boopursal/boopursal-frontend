import React, { useEffect, useState } from 'react';
import { Icon, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
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
        if (SousSecteurs) {
            const arr = Object.values(SousSecteurs);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [SousSecteurs, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Référentiel des Activités"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onPageChange={(pageIndex) => {
                const newParams = { ...parametres, page: pageIndex + 1 };
                dispatch(Actions.setParametresData(newParams));
            }}
            onSortedChange={(newSorted) => {
                const newParams = { 
                    ...parametres, 
                    page: 1, 
                    filter: { id: newSorted[0].id, direction: newSorted[0].desc ? 'desc' : 'asc' } 
                };
                dispatch(Actions.setParametresData(newParams));
            }}
            onRowClick={(row) => dispatch(Actions.openEditSousSecteursDialog(row))}
            columns={[
                {
                    Header: "Nom de l'Activité",
                    accessor: "name",
                    Cell: row => (
                        <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                            {row.original.name}
                        </Typography>
                    ),
                    minWidth: 300
                },
                {
                    Header: "Secteur",
                    accessor: "secteur.name",
                    Cell: row => (
                        <div className="inline-flex px-10 py-4 rounded-6 bg-slate-50 border border-slate-100 text-12 font-600 text-slate-600">
                             <Icon className="text-14 mr-6 text-slate-400">category</Icon>
                             {row.original.secteur?.name || 'Non Classé'}
                        </div>
                    ),
                    width: 250
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
                                    dispatch(Actions.openEditSousSecteursDialog(row.original));
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
                                                    <DialogContentText>Voulez-vous vraiment supprimer cette activité ?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removeSousSecteur(row.original, parametres));
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

export default SousSecteursList;
