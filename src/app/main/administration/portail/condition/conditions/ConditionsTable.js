import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from '../store/actions';
import { openDialog, closeDialog } from 'app/store/actions/fuse';

function ConditionsTable(props) {
    const dispatch = useDispatch();
    const conditions = useSelector(({ conditionsApp }) => conditionsApp.conditions.entities);
    const loading = useSelector(({ conditionsApp }) => conditionsApp.conditions.loading);
    const searchText = useSelector(({ conditionsApp }) => conditionsApp.conditions.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (conditions) {
            const arr = Object.values(conditions);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [conditions, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Conditions Générales"
            data={filteredData}
            loading={loading}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/admin/conditions/' + row.id)}
            columns={[
                {
                    Header: "Titre de la Condition",
                    accessor: "titre",
                    Cell: row => (
                        <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                            {row.original.titre}
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
                                    props.history.push('/admin/conditions/' + row.original.id);
                                }}
                            >
                                <Icon className="text-18">edit</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle>Confirmation</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>Voulez-vous vraiment supprimer cette condition ?</DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(closeDialog())}>Annuler</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        onClick={() => {
                                                            dispatch(Actions.removeCondition(row.original));
                                                            dispatch(closeDialog());
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

export default withRouter(ConditionsTable);
