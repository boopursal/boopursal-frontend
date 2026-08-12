import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box, Divider } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Line } from 'react-chartjs-2';
import ContentLoader from 'react-content-loader';

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
    selectField: {
        background: '#f8fafc',
        borderRadius: 10,
        padding: '4px 12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        border: '1px solid #e2e8f0',
        color: '#475569',
    },
    statSection: {
        padding: '20px 24px',
        borderBottom: '1px solid #f8fafc',
    },
    statRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 20,
    },
    statInfo: {
        minWidth: 160,
    },
    statLabel: {
        fontSize: '0.8rem',
        color: '#64748b',
        fontWeight: 600,
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: 900,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        marginTop: 4,
    },
    gagnerValue: {
        background: 'linear-gradient(135deg, #11998e, #38ef7d)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    perdueValue: {
        background: 'linear-gradient(135deg, #f5576c, #f093fb)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    chartBox: {
        flex: 1,
        height: 80,
    },
    totalSection: {
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f8fafc',
    },
    totalLabel: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#64748b',
    },
    totalValue: {
        fontSize: '1.4rem',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
    },
}));

function Widget8(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const user = useSelector(({ auth }) => auth.user);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));
    const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

    useEffect(() => {
        dispatch(Actions.getPotentielBudgets(currentRange));
    }, [dispatch, currentRange]);

    const chartOptions = {
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
            xAxes: [{ display: false }],
            yAxes: [{ display: false }],
        },
        tooltips: { enabled: false },
        elements: { point: { radius: 0 } },
    };

    if (widgets.loadingPotentiels !== false || !widgets.potentiels?.['gagner']) {
        return (
            <div className={classes.root} style={{ padding: 24 }}>
                <ContentLoader height={200} width={600} speed={2} primaryColor="#e2e8f0" secondaryColor="#cbd5e1">
                    <rect x="0" y="0" rx="8" ry="8" width="200" height="16" />
                    <rect x="0" y="30" rx="8" ry="8" width="400" height="60" />
                    <rect x="0" y="110" rx="8" ry="8" width="400" height="60" />
                </ContentLoader>
            </div>
        );
    }

    const statConfig = [
        { id: 'gagner', valueClass: classes.gagnerValue },
        { id: 'perdue', valueClass: classes.perdueValue },
    ];

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <Typography className={classes.title}>Vos statistiques</Typography>
                    <Typography className={classes.subtitle}>Budgets gagnés vs perdus</Typography>
                </div>
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

            {statConfig.map(({ id, valueClass }) => (
                <div key={id} className={classes.statSection}>
                    <div className={classes.statRow}>
                        <div className={classes.statInfo}>
                            <Typography className={classes.statLabel}>
                                {widgets.potentiels[id].title}
                            </Typography>
                            <Typography className={`${classes.statValue} ${valueClass}`}>
                                {parseFloat(widgets.potentiels[id].somme).toLocaleString('fr', { minimumFractionDigits: 2 })}
                                <span style={{ fontSize: '0.9rem', marginLeft: 6, fontWeight: 600 }}>
                                    {user.data?.currency || ''}
                                </span>
                            </Typography>
                        </div>
                        <div className={classes.chartBox}>
                            <Line
                                data={{
                                    labels,
                                    datasets: (widgets.potentiels[id].datasets || []).map(ds => ({
                                        ...ds,
                                        borderWidth: 2.5,
                                        tension: 0.4,
                                    }))
                                }}
                                options={chartOptions}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <div className={classes.totalSection}>
                <Typography className={classes.totalLabel}>💰 Potentiels Total</Typography>
                <Typography className={classes.totalValue}>
                    {parseFloat(widgets.potentiels.total).toLocaleString('fr', { minimumFractionDigits: 2 })}
                    <span style={{ fontSize: '0.85rem', marginLeft: 6 }}>{user.data?.currency || ''}</span>
                </Typography>
            </div>
        </div>
    );
}

export default React.memo(Widget8);
