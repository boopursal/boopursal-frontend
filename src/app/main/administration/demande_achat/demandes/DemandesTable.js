import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import _ from '@lodash';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

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
    statusError: { backgroundColor: '#FDE2E2', color: '#9B1C1C' },
    statusNeutral: { backgroundColor: '#E5E7EB', color: '#374151' },
    dot: { width: 6, height: 6, borderRadius: '50%' },
    daysBadge: {
        marginLeft: 8,
        fontSize: '0.7rem',
        fontWeight: 700,
        backgroundColor: '#F1F5F9',
        color: '#1C2434',
        padding: '2px 8px',
        borderRadius: 4,
        border: '1px solid #E2E8F0'
    }
}));

function DemandesTable(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const demandes = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.data);
    const loading = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.loading);
    const pageCount = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.pageCount);
    const parametres = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.parametres);
    const searchText = useSelector(({ demandesAdminApp }) => demandesAdminApp.demandes.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (demandes) {
            const arr = Object.keys(demandes).map((id) => demandes[id]);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [demandes, searchText]);

    if (!filteredData) return null;

    const getStatusChip = (original) => {
        if (original.statut === 3) return (
            <div className={clsx(classes.statusBadge, classes.statusSuccess)}>
                <div className={classes.dot} style={{ backgroundColor: '#10B981' }} /> Adjugée
            </div>
        );
        const isExpired = moment(original.dateExpiration) < moment();
        if (isExpired) return (
            <div className={clsx(classes.statusBadge, classes.statusError)}>
                <div className={classes.dot} style={{ backgroundColor: '#EF4444' }} /> Expirée
            </div>
        );
        switch (original.statut) {
            case 0: return (
                <div className={clsx(classes.statusBadge, classes.statusWarning)}>
                    <div className={classes.dot} style={{ backgroundColor: '#F59E0B' }} /> En attente
                </div>
            );
            case 1: return (
                <div className={clsx(classes.statusBadge, classes.statusSuccess)}>
                    <div className={classes.dot} style={{ backgroundColor: '#10B981' }} /> En cours
                </div>
            );
            default: return (
                <div className={clsx(classes.statusBadge, classes.statusError)}>
                    <div className={classes.dot} style={{ backgroundColor: '#EF4444' }} /> Refusée
                </div>
            );
        }
    };

    return (
        <BoopursalTable
            title="Surveillance des RFQ & Demandes"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
            onRowClick={(row) => props.history.push('/demandes_admin/' + row.id)}
            onPageChange={(pageIndex) => {
                parametres.page = pageIndex + 1;
                dispatch(Actions.setParametresData(parametres))
            }}
            onSortedChange={(newSorted) => {
                parametres.page = 1;
                parametres.filter.id = newSorted[0].id;
                parametres.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
                dispatch(Actions.setParametresData(parametres))
            }}
            columns={[
                {
                    Header: "Réf.",
                    accessor: "reference",
                    Cell: row => (
                        <div className="px-8 py-2 rounded-4 bg-blue-50 text-blue-700 font-700 text-12 border border-blue-100">
                            {row.original.reference ? 'RFQ-' + row.original.reference : 'ATTENTE'}
                        </div>
                    ),
                    width: 120
                },
                {
                    Header: "Acheteur & Société",
                    accessor: "acheteur.societe",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-12 font-700 text-slate-500">
                                {row.original.acheteur?.societe?.charAt(0) || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{_.truncate(row.original.acheteur.societe, { length: 25 })}</Typography>
                                <Typography variant="caption" style={{ color: '#64748B' }}>{row.original.acheteur.email}</Typography>
                            </div>
                        </div>
                    ),
                    minWidth: 220
                },
                {
                    Header: "Objet de la demande",
                    accessor: "titre",
                    Cell: row => <Typography className="font-500 text-14" style={{ color: '#1C2434' }}>{_.truncate(row.original.titre, { length: 35 })}</Typography>,
                    minWidth: 250
                },
                {
                    Header: "Échéance",
                    accessor: "dateExpiration",
                    Cell: row => (
                        <div className="flex items-center">
                            <Typography className="text-13 font-600" style={{ color: '#1C2434' }}>{moment(row.original.dateExpiration).format('DD/MM/YY')}</Typography>
                            <span className={classes.daysBadge}>
                                {Math.abs(moment(row.original.dateExpiration).diff(moment(), 'days'))}j
                            </span>
                        </div>
                    ),
                    width: 140
                },
                {
                    Header: "Statut",
                    accessor: "statut",
                    Cell: row => getStatusChip(row.original),
                    width: 140
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <IconButton size="small" style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}>
                            <Icon className="text-18">arrow_forward</Icon>
                        </IconButton>
                    ),
                    width: 80
                }
            ]}
        />
    );
}

export default withRouter(DemandesTable);
