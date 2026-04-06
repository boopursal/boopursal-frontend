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
        fontWeight: 900,
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        height: 24,
        borderRadius: 8,
        padding: '0 4px',
        '&.success': { background: '#f0fdf4', color: '#166534', border: '1px solid #bcf0da' },
        '&.error': { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
        '&.warning': { background: '#fffbeb', color: '#92400e', border: '1px solid #fef3c7' },
        '&.neutral': { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }
    },
    daysBadge: {
        marginLeft: 8,
        fontSize: '0.65rem',
        fontWeight: 800,
        backgroundColor: '#1e293b',
        color: '#fff',
        padding: '2px 8px',
        borderRadius: 4
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
        if (original.statut === 3) return <Chip className={clsx(classes.statusBadge, 'success')} label="Adjugée" />;
        const isExpired = moment(original.dateExpiration) < moment();
        if (isExpired) return <Chip className={clsx(classes.statusBadge, 'error')} label="Expirée" />;
        switch (original.statut) {
            case 0: return <Chip className={clsx(classes.statusBadge, 'warning')} label="En attente" />;
            case 1: return <Chip className={clsx(classes.statusBadge, 'success')} label="En cours" />;
            default: return <Chip className={clsx(classes.statusBadge, 'error')} label="Refusée" />;
        }
    };

    return (
        <BoopursalTable
            title="Surveillance des RFQ & Demandes"
            icon="list_alt"
            data={filteredData}
            loading={loading}
            pageCount={pageCount}
            page={parametres.page - 1}
            searchText={searchText}
            onSearchChange={(ev) => dispatch(Actions.setDemandesSearchText(ev))}
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
                    Cell: row => <Typography className="font-900 text-13 text-blue-700">{row.original.reference ? 'RFQ-' + row.original.reference : 'ATTENTE'}</Typography>,
                    width: 120
                },
                {
                    Header: "Acheteur & Société",
                    accessor: "acheteur.societe",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-800 text-14 text-slate-800">{_.truncate(row.original.acheteur.societe, { length: 25 })}</Typography>
                            <Typography variant="caption" className="text-slate-400 font-600">{row.original.acheteur.email}</Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Objet de la demande",
                    accessor: "titre",
                    Cell: row => <Typography className="font-600 text-14 text-slate-700">{_.truncate(row.original.titre, { length: 35 })}</Typography>,
                    minWidth: 250
                },
                {
                    Header: "Échéance",
                    accessor: "dateExpiration",
                    Cell: row => (
                        <div className="flex items-center">
                            <Typography className="text-13 font-800">{moment(row.original.dateExpiration).format('DD/MM/YY')}</Typography>
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
                    width: 130
                },
                {
                    Header: "Détails",
                    sortable: false,
                    Cell: row => (
                        <IconButton size="small" className="text-slate-300 hover:text-blue-500">
                            <Icon className="text-18 font-900">arrow_forward_ios</Icon>
                        </IconButton>
                    ),
                    width: 80
                }
            ]}
        />
    );
}

export default withRouter(DemandesTable);
