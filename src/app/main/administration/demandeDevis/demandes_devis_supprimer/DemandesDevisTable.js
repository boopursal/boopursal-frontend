import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip, TextField, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { FuseAnimate } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import ReactTable from "react-table";
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';

import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';

function DemandesDevisTable(props) {
    const dispatch = useDispatch();
    const demandesDevis = useSelector(({ demandesDevistraitesApp }) => demandesDevistraitesApp.demandesDevis.data);
    const loading = useSelector(({ demandesDevistraitesApp }) => demandesDevistraitesApp.demandesDevis.loading);
    const pageCount = useSelector(({ demandesDevistraitesApp }) => demandesDevistraitesApp.demandesDevis.pageCount);
    const parametres = useSelector(({ demandesDevistraitesApp }) => demandesDevistraitesApp.demandesDevis.parametres);
    const searchText = useSelector(({ demandesDevistraitesApp }) => demandesDevistraitesApp.demandesDevis.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (demandesDevis) {
            const arr = Object.keys(demandesDevis).map((id) => demandesDevis[id]);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [demandesDevis, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Corbeille (Demandes supprimées)"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/demandes_devis/' + row.id)}
            onPageChange={(pageIndex) => {
                const p = { ...parametres, page: pageIndex + 1 };
                dispatch(Actions.setParametresData(p));
            }}
            onSortedChange={(newSorted) => {
                const p = { ...parametres, page: 1 };
                p.filter.id = newSorted[0].id;
                p.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
                dispatch(Actions.setParametresData(p));
            }}
            columns={[
                {
                    Header: "Fournisseur",
                    accessor: "fournisseur.societe",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-12 font-700 text-slate-500">
                                {row.original.fournisseur?.societe?.charAt(0) || 'F'}
                            </div>
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.fournisseur?.societe || 'N/A'}</Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Produit",
                    accessor: "produit.titre",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-13 truncate" style={{ maxWidth: 220, color: '#1C2434' }}>{row.original.produit?.titre || 'Produit direct'}</Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>Réf: {row.original.produit?.reference || 'N/A'}</Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Acheteur",
                    accessor: "societe",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-13 truncate" style={{ color: '#1C2434' }}>{row.original.societe}</Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>{row.original.contact}</Typography>
                        </div>
                    ),
                    minWidth: 180
                },
                {
                    Header: "Quantité",
                    accessor: "quantity",
                    width: 100,
                    Cell: row => (
                        <div className="px-10 py-4 rounded-4 bg-red-50 border border-red-100 flex items-center justify-center">
                            <Typography className="font-700 text-13" style={{ color: '#D34053' }}>{row.original.quantity}</Typography>
                        </div>
                    )
                },
                {
                    Header: "Date",
                    accessor: "created",
                    Cell: row => <Typography className="text-13" style={{ color: '#64748B' }}>{moment(row.original.created).format('DD/MM/YY HH:mm')}</Typography>,
                    width: 140
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <Tooltip title="Restaurer" >
                                <IconButton 
                                    size="small" 
                                    style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        dispatch(Actions.openDialog({
                                            children: (
                                                <React.Fragment>
                                                    <DialogTitle>Restaurer la demande ?</DialogTitle>
                                                    <DialogContent><DialogContentText>Voulez-vous vraiment sortir cette demande de la corbeille ?</DialogContentText></DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={() => dispatch(Actions.closeDialog())}>Non</Button>
                                                        <Button variant="contained" style={{ backgroundColor: '#10B981', color: 'white' }} onClick={() => {
                                                            dispatch(Actions.removeDemande(row.original, parametres, false));
                                                            dispatch(Actions.closeDialog());
                                                        }}>Oui, restaurer</Button>
                                                    </DialogActions>
                                                </React.Fragment>
                                            )
                                        }));
                                    }}
                                >
                                    <Icon className="text-18">autorenew</Icon>
                                </IconButton>
                            </Tooltip>
                        </div>
                    ),
                    width: 80
                }
            ]}
        />
    );
}

export default withRouter(DemandesDevisTable);
