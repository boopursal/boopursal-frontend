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

const useStyles = makeStyles(theme => ({
    statusBadge: {
        fontWeight: 600,
        fontSize: '0.75rem',
        padding: '4px 12px',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 26,
    },
    statusActive: {
        backgroundColor: '#DEF7EC',
        color: '#03543F',
    },
    statusInactive: {
        backgroundColor: '#FEF3C7',
        color: '#92400E',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: '50%',
    }
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
        if (contactsFournisseur) {
            const arr = Object.keys(contactsFournisseur).map((id) => contactsFournisseur[id]);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [contactsFournisseur, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Messages des Fournisseurs"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/contact_fournisseur/' + row.id)}
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
                    minWidth: 220
                },
                {
                    Header: "Contact",
                    accessor: "contact",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-13" style={{ color: '#1C2434' }}>{row.original.contact}</Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>{row.original.email}</Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Message",
                    accessor: "message",
                    Cell: row => <Typography className="text-13" style={{ color: '#64748B' }}>{_.truncate(row.original.message, { length: 45 })}</Typography>,
                    minWidth: 250
                },
                {
                    Header: "Date",
                    accessor: "created",
                    Cell: row => <Typography className="text-13 font-500" style={{ color: '#64748B' }}>{moment(row.original.created).format('DD/MM/YY HH:mm')}</Typography>,
                    width: 150
                },
                {
                    Header: "Statut",
                    accessor: "statut",
                    Cell: row => (
                        <div className={clsx(
                            classes.statusBadge,
                            row.original.statut ? classes.statusActive : classes.statusInactive
                        )}>
                            <div className={classes.dot} style={{ backgroundColor: row.original.statut ? '#10B981' : '#F59E0B' }} />
                            {row.original.statut ? 'Validé' : 'En attente'}
                        </div>
                    ),
                    width: 130
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <IconButton 
                                size="small" 
                                style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    props.history.push('/contact_fournisseur/' + row.original.id);
                                }}
                            >
                                <Icon className="text-18">visibility</Icon>
                            </IconButton>
                            <IconButton 
                                size="small" 
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle>Supprimer le message ?</DialogTitle>
                                                <DialogContent><DialogContentText>Cette action est irréversible.</DialogContentText></DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                    <Button variant="contained" style={{ backgroundColor: '#D34053', color: 'white' }} onClick={() => {
                                                        dispatch(Actions.removeMessage(row.original, parametres));
                                                        dispatch(Actions.closeDialog());
                                                    }}>Supprimer</Button>
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
                    width: 100
                }
            ]}
        />
    );
}

export default withRouter(ContactsFournisseurTable);
