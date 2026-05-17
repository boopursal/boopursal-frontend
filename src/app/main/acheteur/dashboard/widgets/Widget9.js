import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box, Icon } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
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
    selectField: {
        background: '#f8fafc',
        borderRadius: 10,
        padding: '4px 12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        border: '1px solid #e2e8f0',
        color: '#475569',
    },
    statRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid #f8fafc',
        gap: 16,
        '&:last-child': {
            borderBottom: 'none',
        }
    },
    statLabel: {
        fontSize: '0.85rem',
        color: '#64748b',
        fontWeight: 600,
        minWidth: 120,
    },
    statValue: {
        fontSize: '1.4rem',
        fontWeight: 900,
        color: '#0f172a',
        letterSpacing: '-0.02em',
        minWidth: 80,
    },
    chartBox: {
        flex: 1,
        height: 48,
    },
    divider: {
        height: 1,
        background: '#f1f5f9',
        margin: '8px 0',
    },
    totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        marginTop: 4,
    },
    totalLabel: {
        fontSize: '0.85rem',
        fontWeight: 700,
        color: '#64748b',
    },
    totalValue: {
        fontSize: '1.6rem',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.02em',
    },
}));

function Widget9(props) {
    const classes = useStyles();
    const [currentRange, setCurrentRange] = useState(props.widget?.currentRange || Object.keys(props.widget?.ranges || {})[0]);
    const widget = _.merge({}, props.widget);

    if (!props.widget) return null;

    const statIds = ['weeklySpent', 'totalSpent', 'remaining'];

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography className={classes.title}>{widget.title}</Typography>
                    <Typography className={classes.subtitle}>Analyse des dépenses budgétaires</Typography>
                </div>
                <Select
                    native
                    className={classes.selectField}
                    value={currentRange}
                    onChange={(e) => setCurrentRange(e.target.value)}
                    disableUnderline
                >
                    {Object.entries(widget.ranges || {}).map(([key, n]) => (
                        <option key={key} value={key}>{n}</option>
                    ))}
                </Select>
            </div>

            {statIds.map(id => widget[id] && (
                <div key={id} className={classes.statRow}>
                    <div style={{ minWidth: 120 }}>
                        <Typography className={classes.statLabel}>{widget[id].title}</Typography>
                        <Typography className={classes.statValue}>
                            $ {widget[id].count?.[currentRange] ?? 0}
                        </Typography>
                    </div>
                    <div className={classes.chartBox}>
                        {widget[id].chart?.[currentRange] && (
                            <Line
                                data={{
                                    labels: widget[id].chart[currentRange].labels,
                                    datasets: (widget[id].chart[currentRange].datasets || []).map(ds => ({
                                        ...ds,
                                        borderWidth: 2,
                                        pointRadius: 0,
                                        tension: 0.4,
                                    }))
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    legend: { display: false },
                                    scales: {
                                        xAxes: [{ display: false }],
                                        yAxes: [{ display: false }],
                                    },
                                    tooltips: { enabled: false },
                                }}
                            />
                        )}
                    </div>
                </div>
            ))}

            <div className={classes.divider} />
            <div className={classes.totalRow}>
                <Typography className={classes.totalLabel}>{widget.totalBudget?.title || 'Budget Total'}</Typography>
                <Typography className={classes.totalValue}>
                    $ {widget.totalBudget?.count ?? 0}
                </Typography>
            </div>
        </div>
    );
}

export default React.memo(Widget9);
