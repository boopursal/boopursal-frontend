import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import ContentLoader from 'react-content-loader';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            transform: 'translateY(-4px)',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
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
    budgetCard: {
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        borderRadius: 16,
        padding: '24px',
        marginTop: 'auto',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
        }
    },
    year: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.7)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 8,
    },
    amount: {
        fontSize: '2.2rem',
        fontWeight: 900,
        color: '#ffffff',
        letterSpacing: '-0.02em',
        lineHeight: 1,
    },
    currency: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.8)',
        marginLeft: 6,
    }
}));

function Widget7(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const user = useSelector(({ auth }) => auth.user);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));

    useEffect(() => {
        dispatch(Actions.getTopBudgetGagner(currentRange));
    }, [dispatch, currentRange]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <Typography className={classes.title}>Top Budget Gagné</Typography>
                    <Typography className={classes.subtitle}>Votre meilleure performance</Typography>
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

            {widgets.loadingTopBudget === false ? (
                <div className={classes.budgetCard}>
                    <Typography className={classes.year}>{currentRange}</Typography>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4 }}>
                        <Typography className={classes.amount}>
                            {widgets.topBudget ? parseFloat(widgets.topBudget).toLocaleString('fr', { minimumFractionDigits: 2 }) : '0,00'}
                        </Typography>
                        <Typography className={classes.currency}>{user.data?.currency || ''}</Typography>
                    </div>
                </div>
            ) : (
                <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                    <CircularProgress size={32} style={{ color: '#667eea' }} />
                </Box>
            )}
        </div>
    );
}

export default React.memo(Widget7);
