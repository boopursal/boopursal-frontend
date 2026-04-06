import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'
import { Doughnut } from 'react-chartjs-2';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4),
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3),
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
    chartContainer: {
        height: 350,
        width: '100%',
        marginTop: 'auto',
    }
}));

function Widget6(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);
    const [currentRange, setCurrentRange] = useState(moment().format('Y'));

    useEffect(() => {
        dispatch(Actions.getDoughnut(currentRange));
    }, [dispatch, currentRange]);

    const handleChangeRange = (ev) => setCurrentRange(ev.target.value);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title}>Consultations Annuelles</Typography>
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

            {widgets.loadingDoughnut ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                    <CircularProgress size={32} />
                </Box>
            ) : (
                <div className={classes.chartContainer}>
                    <Doughnut
                        data={{
                            labels: widgets.doughnut.labels,
                            datasets: widgets.doughnut.datasets.map(ds => ({
                                ...ds,
                                borderWidth: 0,
                                hoverOffset: 4,
                            }))
                        }}
                        options={{
                            cutoutPercentage: 75,
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    padding: 24,
                                    usePointStyle: true,
                                    fontColor: '#4b5563',
                                    fontWeight: 500,
                                }
                            },
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default React.memo(Widget6);
