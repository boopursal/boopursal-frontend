import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Container } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Line } from 'react-chartjs-2';
import _ from 'lodash';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions'
import { FuseAnimate } from '@fuse';

const useStyles = makeStyles(theme => ({
    root: {
        background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
        borderRadius: 24,
        padding: theme.spacing(4),
        marginBottom: theme.spacing(4),
        color: "#ffffff",
        position: 'relative',
        overflow: 'hidden',
        boxShadow: "0 10px 25px rgba(37, 99, 235, 0.2)",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(4),
        flexWrap: 'wrap',
        gap: theme.spacing(2),
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: 800,
        letterSpacing: "-0.02em",
    },
    buttonGroup: {
        display: 'flex',
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: 4,
    },
    btn: {
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 8,
        padding: "6px 16px",
        color: "#ffffff",
        '&:hover': {
            background: "rgba(255, 255, 255, 0.1)",
        },
        '&.active': {
            background: "#ffffff",
            color: "#2563eb",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }
    },
    chartContainer: {
        height: 240,
        width: '100%',
    }
}));

function Widget5(props) {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [currentRange, setCurrentRange] = useState({
        startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
        endDate: moment().endOf('isoWeek').format('YYYY-MM-DD')
    });

    const [range, setRange] = useState('0');
    const [widget, setWidget] = useState(null);
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);

    useEffect(() => {
        dispatch(Actions.getCharts(currentRange));
    }, [dispatch, currentRange]);

    useEffect(() => {
        setWidget(_.merge({}, widgets.charts))
    }, [widgets.charts]);

    function handleChangeRange(key) {
        setRange(key);
        let start, end;
        if (key === '1') {
            start = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            end = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
        } else if (key === '2') {
            start = moment().subtract(2, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
            end = moment().subtract(2, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');
        } else {
            start = moment().startOf('isoWeek').format('YYYY-MM-DD');
            end = moment().endOf('isoWeek').format('YYYY-MM-DD');
        }
        setCurrentRange({ startDate: start, endDate: end });
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <FuseAnimate delay={100}>
                    <Typography className={classes.title}>
                        {widget && widget.title ? widget.title : "Activité hebdomadaire"}
                    </Typography>
                </FuseAnimate>

                <div className={classes.buttonGroup}>
                    {Object.entries({
                        '0': '7 jours',
                        '1': '15 jours',
                        '2': '30 jours'
                    }).map(([key, n]) => (
                        <Button
                            key={key}
                            className={`${classes.btn} ${range === key ? 'active' : ''}`}
                            onClick={() => handleChangeRange(key)}
                        >
                            {n}
                        </Button>
                    ))}
                </div>
            </div>

            <div className={classes.chartContainer}>
                <Line
                    data={{
                        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                        datasets: widget && widget.mainChart
                            ? widget.mainChart.datasets.map(obj => ({
                                ...obj,
                                borderColor: "#ffffff",
                                backgroundColor: "transparent",
                                pointBackgroundColor: "#ffffff",
                                pointBorderColor: "#ffffff",
                                pointHoverBackgroundColor: "#ffffff",
                                pointHoverBorderColor: "#ffffff",
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                tension: 0.4,
                                borderWidth: 3,
                            }))
                            : []
                    }}
                    options={{
                        maintainAspectRatio: false,
                        legend: { display: false },
                        scales: {
                            xAxes: [{
                                gridLines: { display: false },
                                ticks: { fontColor: "rgba(255, 255, 255, 0.7)", fontSize: 12, padding: 10 }
                            }],
                            yAxes: [{
                                display: false,
                                ticks: { min: 0, max: 25 }
                            }]
                        },
                        tooltips: {
                            backgroundColor: '#ffffff',
                            titleFontColor: '#111827',
                            bodyFontColor: '#374151',
                            cornerRadius: 8,
                            padding: 12,
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default React.memo(Widget5);
