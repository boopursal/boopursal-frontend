import React, { useEffect } from 'react';
import { Typography, makeStyles, CircularProgress, Box } from '@material-ui/core';
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
        marginBottom: theme.spacing(3),
    },
    title: {
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "#1f2937",
    },
    chartContainer: {
        height: 350,
        width: '100%',
        marginTop: 'auto',
    }
}));

function Widget5(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);

    useEffect(() => {
        dispatch(Actions.getDemandeDevisByProduct());
    }, [dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Typography className={classes.title}>Répartition des Demandes</Typography>
                <Typography variant="body2" style={{ color: '#6b7280' }}>Par produit et service</Typography>
            </div>

            {widgets.loadingDDP ? (
                <Box display="flex" justifyContent="center" alignItems="center" flexGrow={1}>
                    <CircularProgress size={32} />
                </Box>
            ) : (
                <div className={classes.chartContainer}>
                    <Doughnut
                        data={{
                            labels: widgets.dataDDP?.labels || [],
                            datasets: (widgets.dataDDP?.datasets || []).map(ds => ({
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

export default React.memo(Widget5);
