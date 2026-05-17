import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Chip, Tooltip, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import _ from '@lodash';

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
    statusInfo: { backgroundColor: 'rgba(60, 80, 224, 0.05)', color: '#3C50E0' },
    dot: { width: 6, height: 6, borderRadius: '50%' }
}));

function CommandesTable(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const commandes = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.data);
    const loading = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.loading);
    const pageCount = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.pageCount);
    const parametres = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.parametres);
    const searchText = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commandes.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (commandes) {
            const arr = Object.values(commandes);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [commandes, searchText]);

    if (!filteredData) return null;

    return (
        <BoopursalTable
            title="Commandes d'Abonnements"
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
                    Header: "Abonnement",
                    accessor: "reference",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.reference}</Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>Créé le {moment(row.original.created).format('DD/MM/YYYY')}</Typography>
                        </div>
                    ),
                    minWidth: 160
                },
                {
                    Header: "Détails Offre",
                    accessor: "offre.name",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="text-13 font-600" style={{ color: '#1C2434' }}>{row.original.offre?.name || 'N/A'}</Typography>
                            <Typography variant="caption" style={{ color: '#3C50E0', fontWeight: 600 }}>
                                {Object.keys(row.original.sousSecteurs || {}).length} Activités
                            </Typography>
                        </div>
                    ),
                    minWidth: 180
                },
                {
                    Header: "Client / Fournisseur",
                    accessor: "fournisseur.societe",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-12 font-700 text-slate-500 uppercase">
                                {row.original.fournisseur?.societe?.charAt(0) || 'F'}
                            </div>
                            <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>{row.original.fournisseur?.societe || 'N/A'}</Typography>
                        </div>
                    ),
                    minWidth: 200
                },
                {
                    Header: "Paiement",
                    accessor: "mode.name",
                    Cell: row => (
                        <div className={clsx(classes.statusBadge, classes.statusInfo)}>
                            {row.original.mode?.name || 'Virement'}
                        </div>
                    ),
                    width: 140
                },
                {
                    Header: "Type",
                    accessor: "type",
                    Cell: row => (
                         <div className={clsx(classes.statusBadge, row.original.type ? classes.statusSuccess : classes.statusInfo)}>
                            {row.original.type ? 'Renouvellement' : 'Nouvelle'}
                        </div>
                    ),
                    width: 140
                },
                {
                    Header: "Statut",
                    accessor: "statut",
                    Cell: row => (
                        <div className={clsx(classes.statusBadge, row.original.statut ? classes.statusSuccess : classes.statusWarning)}>
                            <div className={classes.dot} style={{ backgroundColor: row.original.statut ? '#10B981' : '#F59E0B' }} />
                            {row.original.statut ? 'Traitée' : 'En attente'}
                        </div>
                    ),
                    width: 130
                },
                {
                    Header: "Action",
                    width: 80,
                    sortable: false,
                    Cell: row => (
                        <IconButton 
                            size="small"
                            style={{ color: row.original.statut ? '#64748B' : '#3C50E0', backgroundColor: row.original.statut ? 'rgba(100, 116, 139, 0.05)' : 'rgba(60, 80, 224, 0.05)' }}
                            disabled={row.original.statut}
                            onClick={() => props.history.push('/admin/offres/commande/' + row.original.id)}
                        >
                            <Icon className="text-18">{row.original.statut ? 'check_circle' : 'bolt'}</Icon>
                        </IconButton>
                    )
                }
            ]}
        />
    );
}

export default withRouter(CommandesTable);
