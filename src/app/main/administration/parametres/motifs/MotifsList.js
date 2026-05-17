import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';

function MotifsList(props) {
    const dispatch = useDispatch();
    const Motifs = useSelector(({ motifsApp }) => motifsApp.motifs.entities);
    const searchText = useSelector(({ motifsApp }) => motifsApp.motifs.searchText);
    
    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (Motifs) {
            const arr = Object.values(Motifs);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [Motifs, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Désignations & Motifs"
            data={filteredData}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => dispatch(Actions.openEditMotifsDialog(row))}
            columns={[
                {
                    Header: "ID",
                    accessor: "id",
                    Cell: row => (
                        <Typography className="font-600 text-12 text-slate-400">
                            #{row.original.id}
                        </Typography>
                    ),
                    width: 80
                },
                {
                    Header: "Désignation",
                    accessor: "name",
                    Cell: row => (
                        <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                            {row.original.name}
                        </Typography>
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
                                    dispatch(Actions.openEditMotifsDialog(row.original));
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
                                                    <DialogContentText>Voulez-vous vraiment supprimer ce motif ?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removeMotif(row.original));
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

export default MotifsList;
