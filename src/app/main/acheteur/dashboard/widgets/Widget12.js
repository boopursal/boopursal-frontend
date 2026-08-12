import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, Typography, TableBody, Select, makeStyles, CircularProgress, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import ContentLoader from 'react-content-loader';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
        flexWrap: 'wrap',
        gap: 12,
    },
    titleWrapper: {},
    title: {
        fontSize: '1.05rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.01em',
    },
    subtitle: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 500,
        marginTop: 2,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    countBadge: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '4px 14px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
    },
    selectField: {
        background: '#f8fafc',
        borderRadius: 10,
        padding: '4px 12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        border: '1px solid #e2e8f0',
        color: '#475569',
    },
    tableHead: {
        '& th': {
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '12px 16px',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
            whiteSpace: 'nowrap',
        }
    },
    tableRow: {
        transition: 'background 0.2s ease',
        '&:hover': {
            background: '#f8fafc',
        },
        '& td': {
            padding: '14px 16px',
            borderBottom: '1px solid #f8fafc',
            fontSize: '0.875rem',
            color: '#1e293b',
            fontWeight: 500,
            whiteSpace: 'nowrap',
        }
    },
    kpiCell: {
        textAlign: 'center',
        fontWeight: 700,
    },
    kpiBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 28,
        height: 28,
        borderRadius: 8,
        background: '#f1f5f9',
        color: '#475569',
        fontWeight: 700,
        fontSize: '0.85rem',
    }
}));

function Widget12(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));

    useEffect(() => {
        dispatch(Actions.getTeamPotentiels(currentRange));
    }, [dispatch, currentRange]);

    if (widgets.loadingTeamPotentiels !== false) {
        return (
            <div className={classes.root} style={{ padding: 24 }}>
                <ContentLoader height={200} width={800} speed={2} primaryColor="#e2e8f0" secondaryColor="#cbd5e1">
                    <rect x="0" y="0" rx="8" ry="8" width="800" height="16" />
                    <rect x="0" y="28" rx="8" ry="8" width="600" height="16" />
                    <rect x="0" y="56" rx="8" ry="8" width="700" height="16" />
                    <rect x="0" y="84" rx="8" ry="8" width="650" height="16" />
                </ContentLoader>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <Typography className={classes.title}>Suivi de l'année {currentRange}</Typography>
                    <Typography className={classes.subtitle}>Performance par acheteur / master</Typography>
                </div>
                <div className={classes.headerRight}>
                    {Array.isArray(widgets.teamPotentiels) && (
                        <span className={classes.countBadge}>
                            {widgets.teamPotentiels.length} Membre(s)
                        </span>
                    )}
                    <Select
                        native
                        className={classes.selectField}
                        value={currentRange}
                        onChange={(e) => setCurrentRange(e.target.value)}
                        disableUnderline
                    >
                        {Object.entries({
                            '0': moment().format('Y'),
                            '1': moment().subtract(1, 'year').format('Y'),
                            '2': moment().subtract(2, 'year').format('Y'),
                        }).map(([key, n]) => (
                            <option key={key} value={n}>{n}</option>
                        ))}
                    </Select>
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <Table size="small">
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell>Acheteur / Master</TableCell>
                            <TableCell>BlackListe</TableCell>
                            <TableCell>Budget Total</TableCell>
                            <TableCell>En attente</TableCell>
                            <TableCell>En cours</TableCell>
                            <TableCell>Expirées</TableCell>
                            <TableCell>Rejetées</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(widgets.teamPotentiels) && widgets.teamPotentiels.map((teamData, index) => (
                            <TableRow key={index} className={classes.tableRow}>
                                <TableCell style={{ fontWeight: 700, color: '#0f172a' }}>
                                    {teamData.team?.nom} {teamData.team?.prenom}
                                </TableCell>
                                <TableCell>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '2px 10px',
                                        borderRadius: 12,
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: teamData.blacklistedTeams?.length > 0 ? '#fef2f2' : '#f0fdf4',
                                        color: teamData.blacklistedTeams?.length > 0 ? '#ef4444' : '#22c55e',
                                    }}>
                                        {teamData.blacklistedTeams?.length > 0 ? 'Oui' : 'Non'}
                                    </span>
                                </TableCell>
                                <TableCell style={{ fontWeight: 700, color: '#0f172a' }}>{teamData.budgets}</TableCell>
                                <TableCell className={classes.kpiCell}>
                                    <span className={classes.kpiBadge}>{teamData.attentes}</span>
                                </TableCell>
                                <TableCell className={classes.kpiCell}>
                                    <span className={classes.kpiBadge} style={{ background: '#eff6ff', color: '#2563eb' }}>{teamData.cours}</span>
                                </TableCell>
                                <TableCell className={classes.kpiCell}>
                                    <span className={classes.kpiBadge} style={{ background: '#fef9c3', color: '#ca8a04' }}>{teamData.expirees}</span>
                                </TableCell>
                                <TableCell className={classes.kpiCell}>
                                    <span className={classes.kpiBadge} style={{ background: '#fef2f2', color: '#ef4444' }}>{teamData.rejetees}</span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Widget12;
