import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box, Icon } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';

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
            transform: 'translateY(-4px)',
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
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
    content: {
        textAlign: 'center',
        marginBottom: 20,
    },
    yearLabel: {
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 8,
    },
    amountWrapper: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: 6,
    },
    amount: {
        fontSize: '3rem',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #11998e, #38ef7d)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
    },
    currency: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#94a3b8',
    },
    footer: {
        marginTop: 20,
        paddingTop: 16,
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        color: '#64748b',
        fontSize: '0.8rem',
        fontWeight: 500,
    }
}));

function Widget6(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));

    useEffect(() => {
        dispatch(Actions.getBudgets(currentRange));
    }, [dispatch, currentRange]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.titleWrapper}>
                    <Typography className={classes.title}>Budget Annuel</Typography>
                    <Typography className={classes.subtitle}>Total des dépenses HT</Typography>
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

            {widgets.loadingBudgets ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress size={32} style={{ color: '#11998e' }} />
                </Box>
            ) : (
                <div className={classes.content}>
                    <Typography className={classes.yearLabel}>Total Dépenses {currentRange}</Typography>
                    <div className={classes.amountWrapper}>
                        <Typography className={classes.amount}>
                            {widgets.budgets ? parseFloat(widgets.budgets).toLocaleString('fr', { minimumFractionDigits: 2 }) : '0,00'}
                        </Typography>
                        <Typography className={classes.currency}>DHS</Typography>
                    </div>
                    <div className={classes.footer}>
                        <Icon fontSize="small" style={{ fontSize: 16 }}>info_outline</Icon>
                        <span>Montant total Hors Taxes (HT)</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(Widget6);
