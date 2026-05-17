import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, Typography, TableBody, Select, makeStyles, Collapse } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import ContentLoader from 'react-content-loader';
import moment from 'moment';
import { FuseAnimate } from '@fuse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

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
        cursor: 'pointer',
        transition: 'background 0.2s ease',
        '&:hover': {
            background: '#f0f9ff',
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
    expandedRow: {
        background: '#f8fafc',
        '& td': {
            padding: 0,
            borderBottom: 'none',
        }
    },
    subTable: {
        width: '100%',
        '& th': {
            padding: '10px 16px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#64748b',
            background: '#f1f5f9',
            whiteSpace: 'nowrap',
        }
    },
    currentMonthCell: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#ffffff !important',
        fontWeight: '800 !important',
    },
    gagnerCell: {
        color: '#10b981',
        fontWeight: 700,
    },
    potentielCell: {
        color: '#3b82f6',
        fontWeight: 700,
    },
    expandIcon: {
        color: '#94a3b8',
        fontSize: '1.2rem',
        verticalAlign: 'middle',
    },
    nameCell: {
        fontWeight: 700,
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    gagnerBudget: {
        color: '#10b981',
        fontWeight: 700,
    },
    perduBudget: {
        color: '#ef4444',
        fontWeight: 700,
    },
    potentielBudget: {
        color: '#3b82f6',
        fontWeight: 700,
    },
}));

function Widget9(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const currentMonth = moment().format('M');
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const user = useSelector(({ auth }) => auth.user);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));
    const currentYear = moment().format('Y');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        dispatch(Actions.getPersonnelPotentiels(currentRange));
    }, [dispatch, currentRange]);

    const handleCollapse = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const months = ['#', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    if (widgets.loadingPersonnelPotentiels !== false) {
        return (
            <div className={classes.root} style={{ padding: 24 }}>
                {Array(5).fill('').map((_, i) => (
                    <ContentLoader key={i} height={40} width={900} speed={2} backgroundColor="#e2e8f0" foregroundColor="#cbd5e1" style={{ opacity: 1 - (i * 0.15) }}>
                        <rect x="0" y="10" rx="6" ry="6" width={600 + Math.random() * 200} height="16" />
                        <rect x="0" y="36" rx="6" ry="6" width="900" height="1" />
                    </ContentLoader>
                ))}
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography className={classes.title}>Suivi de l'année {currentRange}</Typography>
                    <Typography className={classes.subtitle}>Performance par agence / service</Typography>
                </div>
                <div className={classes.headerRight}>
                    {Array.isArray(widgets.personnelPotentiels) && (
                        <span className={classes.countBadge}>
                            {widgets.personnelPotentiels.length} Agence(s)
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
                            <TableCell>Agence / Service</TableCell>
                            <TableCell>Demandes affectées</TableCell>
                            <TableCell>Demandes gagnées</TableCell>
                            <TableCell>Demandes perdues</TableCell>
                            <TableCell>Budgets gagnés</TableCell>
                            <TableCell>Budgets perdus</TableCell>
                            <TableCell>Potentiels</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(widgets.personnelPotentiels || []).map(row => (
                            <React.Fragment key={row.personnel.id}>
                                <TableRow
                                    className={classes.tableRow}
                                    onClick={() => handleCollapse(row.personnel.id)}
                                >
                                    <TableCell>
                                        <div className={classes.nameCell}>
                                            {expanded === row.personnel.id
                                                ? <ExpandLessIcon className={classes.expandIcon} />
                                                : <ExpandMoreIcon className={classes.expandIcon} />
                                            }
                                            {row.personnel.agence}, {row.personnel.name}
                                        </div>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{row.demandeAffecte.count || 0}</TableCell>
                                    <TableCell style={{ textAlign: 'center', color: '#10b981', fontWeight: 700 }}>{row.demandeGagner.count || 0}</TableCell>
                                    <TableCell style={{ textAlign: 'center', color: '#ef4444', fontWeight: 700 }}>{row.demandePerdue.count || 0}</TableCell>
                                    <TableCell className={classes.gagnerBudget}>{row.demandeGagner.budget || 0} {user.data?.currency}</TableCell>
                                    <TableCell className={classes.perduBudget}>{row.demandePerdue.budget || 0} {user.data?.currency}</TableCell>
                                    <TableCell className={classes.potentielBudget}>{row.demandeAffecte.budget || 0} {user.data?.currency}</TableCell>
                                </TableRow>

                                {expanded === row.personnel.id && (
                                    <TableRow className={classes.expandedRow}>
                                        <TableCell colSpan={7}>
                                            <FuseAnimate animation="transition.fadeIn" duration={300}>
                                                <div style={{ overflowX: 'auto', padding: '8px 0' }}>
                                                    <Table size="small" className={classes.subTable}>
                                                        <TableHead>
                                                            <TableRow>
                                                                {months.map((m, index) => (
                                                                    <TableCell
                                                                        key={m}
                                                                        style={parseInt(currentMonth) === index ? {
                                                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                                            color: '#fff',
                                                                            fontWeight: 800,
                                                                        } : {}}
                                                                    >
                                                                        {m}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell style={{ color: '#10b981', fontWeight: 700 }}>
                                                                    Budgets gagnés
                                                                </TableCell>
                                                                {row.gagnerParMois.map((r, index) => (
                                                                    <TableCell
                                                                        key={index + 1}
                                                                        style={parseInt(currentMonth) === index + 1 ? {
                                                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                                            color: '#fff',
                                                                            fontWeight: 800,
                                                                        } : { color: '#10b981', fontWeight: 600 }}
                                                                    >
                                                                        {parseInt(currentMonth) < index + 1 && currentYear === currentRange ? '' : r + ' ' + (user.data?.currency || '')}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell style={{ color: '#3b82f6', fontWeight: 700 }}>
                                                                    Potentiels
                                                                </TableCell>
                                                                {row.potentielParMois.map((r, index) => (
                                                                    <TableCell
                                                                        key={index + 2}
                                                                        style={parseInt(currentMonth) === index + 1 ? {
                                                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                                                            color: '#fff',
                                                                            fontWeight: 800,
                                                                        } : { color: '#3b82f6', fontWeight: 600 }}
                                                                    >
                                                                        {parseInt(currentMonth) < index + 1 && currentYear === currentRange ? '' : r + ' ' + (user.data?.currency || '')}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </FuseAnimate>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default React.memo(Widget9);
