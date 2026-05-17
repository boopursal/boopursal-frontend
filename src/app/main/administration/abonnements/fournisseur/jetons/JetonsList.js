import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography } from '@material-ui/core';
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
    dot: { width: 6, height: 6, borderRadius: '50%' },
    priceTag: {
        backgroundColor: 'rgba(60, 80, 224, 0.05)',
        color: '#3C50E0',
        fontWeight: 700,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '13px'
    }
}));

function JetonsList(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const Jetons = useSelector(({ jetonsApp }) => jetonsApp.jetons.entities);
    const searchText = useSelector(({ jetonsApp }) => jetonsApp.jetons.searchText);
    const parametres = useSelector(({ jetonsApp }) => jetonsApp.jetons.parametres);
    const loading = useSelector(({ jetonsApp }) => jetonsApp.jetons.loading);
    const pageCount = useSelector(({ jetonsApp }) => jetonsApp.jetons.pageCount);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (Jetons) {
            const arr = Object.values(Jetons);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [Jetons, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Historique des Commandes de Jetons"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
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
                    Header: "Commande",
                    accessor: "demande.id",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                #{row.original.demande?.id || 'DIRECT'}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>
                                {moment(row.original.created).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                        </div>
                    ),
                    minWidth: 160
                },
                {
                    Header: "Fournisseur",
                    accessor: "fournisseur.societe",
                    Cell: row => (
                        <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>
                            {row.original.fournisseur?.societe || 'N/A'}
                        </Typography>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Quantité",
                    accessor: "nbrJeton",
                    Cell: row => (
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                                <Icon className="text-14 text-amber-600">toll</Icon>
                            </div>
                            <Typography className="font-700 text-14" style={{ color: '#1C2434' }}>
                                {row.original.nbrJeton}
                            </Typography>
                        </div>
                    ),
                    width: 120
                },
                {
                    Header: "Montant",
                    accessor: "prix",
                    Cell: row => (
                        <div className={classes.priceTag}>
                            {parseFloat(row.original.prix).toLocaleString('fr', { minimumFractionDigits: 2 })} Dhs
                        </div>
                    ),
                    width: 150
                },
                {
                    Header: "Paiement",
                    accessor: "paiement.name",
                    Cell: row => (
                         <Typography className="text-13 font-500 text-slate-500">
                            {row.original.paiement?.name || 'Virement'}
                        </Typography>
                    ),
                    width: 140
                },
                {
                    Header: "État",
                    accessor: "isPayed",
                    Cell: row => (
                        <div className={clsx(classes.statusBadge, row.original.isPayed ? classes.statusSuccess : classes.statusWarning)}>
                            <div className={classes.dot} style={{ backgroundColor: row.original.isPayed ? '#10B981' : '#F59E0B' }} />
                            {row.original.isPayed ? 'Payé' : 'En attente'}
                        </div>
                    ),
                    width: 130
                },
                {
                    Header: "Actions",
                    width: 80,
                    sortable: false,
                    Cell: row => (
                        <IconButton 
                            size="small"
                            style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                            onClick={() => dispatch(Actions.openEditJetonsDialog(row.original))}
                        >
                            <Icon className="text-18">edit</Icon>
                        </IconButton>
                    )
                }
            ]}
        />
    );
}

export default JetonsList;
