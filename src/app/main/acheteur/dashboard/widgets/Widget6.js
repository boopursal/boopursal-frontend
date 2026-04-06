import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box, Icon } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
    },
    title: {
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "#1f2937",
    },
    selectField: {
        background: "#f9fafb",
        borderRadius: 10,
        padding: "4px 12px",
        fontSize: "0.875rem",
        fontWeight: 600,
        border: "1px solid #e5e7eb",
    },
    content: {
        textAlign: 'center',
        padding: theme.spacing(2, 0),
    },
    yearLabel: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#9ca3af",
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: theme.spacing(1),
    },
    amount: {
        fontSize: "3.5rem",
        fontWeight: 800,
        color: "#22c55e",
        lineHeight: 1,
        [theme.breakpoints.down("xs")]: {
            fontSize: "2.5rem",
        }
    },
    currency: {
        fontSize: "1.25rem",
        fontWeight: 600,
        color: "#9ca3af",
        marginLeft: theme.spacing(1),
    },
    footer: {
        marginTop: theme.spacing(3),
        paddingTop: theme.spacing(3),
        borderTop: "1px solid #f3f4f6",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: "#6b7280",
        fontSize: "0.875rem",
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

    const handleChangeRange = (ev) => setCurrentRange(ev.target.value);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title}>Budget Annuel</Typography>
                <Select
                    native
                    className={classes.selectField}
                    value={currentRange}
                    onChange={handleChangeRange}
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
                <Box display="flex" justifyContent="center" p={6}><CircularProgress size={32} /></Box>
            ) : (
                <div className={classes.content}>
                    <Typography className={classes.yearLabel}>Total Dépenses {currentRange}</Typography>
                    <Typography className={classes.amount}>
                        {widgets.budgets ? parseFloat(widgets.budgets).toLocaleString('fr', { minimumFractionDigits: 2 }) : "0,00"}
                        <span className={classes.currency}> DHS</span>
                    </Typography>
                    <div className={classes.footer}>
                        <Icon fontSize="small">info_outline</Icon>
                        <span>Montant total Hors Taxes (HT)</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(Widget6);
