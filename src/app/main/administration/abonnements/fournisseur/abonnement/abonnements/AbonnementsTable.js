import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import FuseUtils from '@fuse/FuseUtils';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';


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
    dot: { width: 6, height: 6, borderRadius: '50%' }
}));

function AbonnementsTable(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const abonnements = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.data);
    const loading = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.loading);
    const pageCount = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.pageCount);
    const parametres = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.parametres);
    const searchText = useSelector(({ abonnementOffreApp }) => abonnementOffreApp.abonnements.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        if (abonnements) {
            const arr = Object.keys(abonnements).map((id) => abonnements[id]);
            setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
        }
    }, [abonnements, searchText]);

    if (!filteredData) return null;

    const getStatusBadge = (original) => {
        const isExpired = original.expired && moment(original.expired) < moment();
        
        if (original.statut === false) {
            if (!original.expired) {
                return (
                    <div className={clsx(classes.statusBadge, classes.statusWarning)}>
                        <div className={classes.dot} style={{ backgroundColor: '#F59E0B' }} /> En attente
                    </div>
                );
            }
            return (
                <div className={clsx(classes.statusBadge, classes.statusError)}>
                    <div className={classes.dot} style={{ backgroundColor: '#EF4444' }} /> {isExpired ? 'Expiré' : 'Annulé'}
                </div>
            );
        }

        if (isExpired) {
            return (
                <div className={clsx(classes.statusBadge, classes.statusError)}>
                    <div className={classes.dot} style={{ backgroundColor: '#EF4444' }} /> Expiré
                </div>
            );
        }

        return (
            <div className={clsx(classes.statusBadge, classes.statusSuccess)}>
                <div className={classes.dot} style={{ backgroundColor: '#10B981' }} /> Actif
            </div>
        );
    };

    return (
        <BoopursalTable
            title="Gestion des Abonnements"
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
                    Header: "Réf.",
                    accessor: "reference",
                    Cell: row => (
                        <div className="px-8 py-2 rounded-4 bg-slate-50 border border-slate-100 font-700 text-12 text-slate-700">
                           {row.original.reference}
                        </div>
                    ),
                    width: 100
                },
                {
                    Header: "Fournisseur",
                    accessor: "fournisseur.societe",
                    Cell: row => (
                        <div className="flex items-center gap-12">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-12 font-700 text-slate-500">
                                {row.original.fournisseur?.societe?.charAt(0) || 'F'}
                            </div>
                            <div className="flex flex-col">
                                <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.fournisseur?.societe || 'N/A'}</Typography>
                                <Typography variant="caption" style={{ color: '#64748B' }}>{row.original.offre?.name || 'Standard'}</Typography>
                            </div>
                        </div>
                    ),
                    minWidth: 220
                },
                {
                    Header: "Mode",
                    accessor: "mode.name",
                    Cell: row => <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>{row.original.mode?.name || 'Virement'}</Typography>,
                    width: 130
                },
                {
                    Header: "Expiraion",
                    accessor: "expired",
                    Cell: row => (
                        <div className="flex flex-col">
                            <Typography className="text-13 font-600" style={{ color: '#1C2434' }}>{row.original.expired ? moment(row.original.expired).format('DD/MM/YY') : 'Indéfini'}</Typography>
                            {row.original.expired && (
                                <Typography variant="caption" style={{ color: moment(row.original.expired) < moment() ? '#EF4444' : '#64748B' }}>
                                    {moment(row.original.expired).diff(moment(), 'days')} jours restants
                                </Typography>
                            )}
                        </div>
                    ),
                    width: 150
                },
                {
                    Header: "Statut",
                    accessor: "statut",
                    Cell: row => getStatusBadge(row.original),
                    width: 130
                },
                {
                    Header: "Actions",
                    sortable: false,
                    Cell: row => (
                        <div className="flex items-center gap-8">
                             {(moment(row.original.expired) >= moment() || !row.original.expired) && (
                                <Tooltip title="Éditer">
                                    <IconButton 
                                        size="small"
                                        style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                                        onClick={() => props.history.push('/admin/offres/abonnement/' + row.original.id)}
                                    >
                                        <Icon className="text-18">edit</Icon>
                                    </IconButton>
                                </Tooltip>
                             )}
                             {row.original.statut === true && moment(row.original.expired).diff(moment(), 'month', true) <= 1 && (
                                <Tooltip title="Renouveler">
                                    <IconButton 
                                        size="small"
                                        style={{ color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}
                                        onClick={() => props.history.push('/admin/offres/renouvellement/' + row.original.id + '/1')}
                                    >
                                        <Icon className="text-18">autorenew</Icon>
                                    </IconButton>
                                </Tooltip>
                             )}
                        </div>
                    ),
                    width: 100
                }
            ]}
        />
    );
}

export default withRouter(AbonnementsTable);
