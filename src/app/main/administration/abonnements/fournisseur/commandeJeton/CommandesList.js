import React, { useEffect, useState } from 'react';
import { Icon, IconButton, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import { FuseUtils } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import moment from 'moment';

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
    statusSuccess: { backgroundColor: '#DEF7EC', color: '#03543F' },
    statusWarning: { backgroundColor: '#FEF3C7', color: '#92400E' },
    dot: { width: 6, height: 6, borderRadius: '50%' }
}));

function CommandesList(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const Commandes = useSelector(({ commandesApp }) => commandesApp.commandes.entities);
    const searchText = useSelector(({ commandesApp }) => commandesApp.commandes.searchText);
    const parametres = useSelector(({ commandesApp }) => commandesApp.commandes.parametres);
    const loading = useSelector(({ commandesApp }) => commandesApp.commandes.loading);
    const pageCount = useSelector(({ commandesApp }) => commandesApp.commandes.pageCount);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (Commandes) {
            const arr = Object.values(Commandes);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [Commandes, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Demandes de Jetons"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => dispatch(Actions.openEditCommandesDialog(row))}
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
                    Header: "Détails Demande",
                    accessor: "created",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                Commande du {moment(row.original.created).format('DD/MM/YYYY')}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>
                                Créée à {moment(row.original.created).format('HH:mm')}
                            </Typography>
                        </div>
                    ),
                    minWidth: 180
                },
                {
                    Header: "Fournisseur",
                    accessor: "fournisseur.societe",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                             <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-12 font-700 text-slate-500 uppercase">
                                {row.original.fournisseur?.societe?.charAt(0) || 'F'}
                            </div>
                            <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>
                                {row.original.fournisseur?.societe || 'N/A'}
                            </Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Quantité",
                    accessor: "nbrJeton",
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                <Icon className="text-14">toll</Icon>
                            </div>
                            <Typography className="font-700 text-15" style={{ color: '#1C2434' }}>
                                {row.original.nbrJeton}
                            </Typography>
                        </div>
                    ),
                    width: 130
                },
                {
                    Header: "Statut",
                    accessor: "isUse",
                    Cell: row => (
                        <div className={clsx(classes.statusBadge, row.original.isUse ? classes.statusSuccess : classes.statusWarning)}>
                            <div className={classes.dot} style={{ backgroundColor: row.original.isUse ? '#10B981' : '#F59E0B' }} />
                            {row.original.isUse ? 'Traitée' : 'En attente'}
                        </div>
                    ),
                    width: 140
                },
                {
                    Header: "Actions",
                    width: 80,
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center">
                            <IconButton 
                                size="small"
                                style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    dispatch(Actions.openDialog({
                                        children: (
                                            <React.Fragment>
                                                <DialogTitle>Suppression</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText>
                                                        {!row.original.isUse ? 'Voulez-vous vraiment supprimer cet enregistrement ?' : 'Vous ne pouvez pas supprimer cet enregistrement, car il est déjà traité !'}
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={() => dispatch(Actions.closeDialog())}>Non</Button>
                                                    <Button 
                                                        variant="contained" 
                                                        style={{ backgroundColor: '#D34053', color: 'white' }}
                                                        disabled={row.original.isUse}
                                                        onClick={() => {
                                                            dispatch(Actions.removeCommande(row.original, parametres));
                                                            dispatch(Actions.closeDialog());
                                                        }}
                                                    >
                                                        Oui, supprimer
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
                    )
                }
            ]}
        />
    );
}

export default CommandesList;
