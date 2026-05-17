import React, { useEffect, useState } from 'react';
import { Icon, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';

function PaysList(props) {
    const dispatch = useDispatch();
    const pays = useSelector(({ paysApp }) => paysApp.pays.entities);
    const pageCount = useSelector(({ paysApp }) => paysApp.pays.pageCount);
    const loading = useSelector(({ paysApp }) => paysApp.pays.loading);
    const parametres = useSelector(({ paysApp }) => paysApp.pays.parametres);
    const searchText = useSelector(({ paysApp }) => paysApp.pays.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (pays) {
            const arr = Object.values(pays);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [pays, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Référentiel des Pays"
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
            onRowClick={(row) => dispatch(Actions.openEditPaysDialog(row))}
            columns={[
                {
                    Header: "Nom du Pays",
                    accessor: "name",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <Icon className="text-18 text-slate-300">flag</Icon>
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                {row.original.name}
                            </Typography>
                        </div>
                    ),
                    minWidth: 400
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
                                    dispatch(Actions.openEditPaysDialog(row.original));
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
                                                    <DialogContentText>Voulez-vous vraiment supprimer ce pays ?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removePays(row.original, parametres));
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

export default PaysList;
