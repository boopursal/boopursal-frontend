import React, { useEffect } from "react";
import { makeStyles, CircularProgress, Box } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

const COLORS = {
    fournisseurs: { border: '#f093fb', background: 'rgba(240, 147, 251, 0.1)', point: '#f5576c' },
    acheteurs:    { border: '#4facfe', background: 'rgba(79, 172, 254, 0.1)', point: '#00f2fe' },
};

const useStyles = makeStyles(theme => ({
    chartWrapper: {
        position: 'relative',
        height: 280,
        paddingBottom: 16,
    }
}));

function Widget13(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget13 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget13);
    const { handleChangeTotal } = props;

    useEffect(() => {
        dispatch(Actions.getWidget13());
        return () => dispatch(Actions.cleanUpWidget13());
    }, [dispatch]);

    useEffect(() => {
        if (!widget13.data || (!widget13.data.totalAcheteurs && !widget13.data.totalFournisseurs)) return;
        handleChangeTotal(widget13.data.totalFournisseurs, widget13.data.totalAcheteurs);
    }, [widget13.data]);

    const colorKeys = ['fournisseurs', 'acheteurs'];

    return (
        <div>
            {widget13.loading && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress size={28} style={{ color: '#f093fb' }} />
                </Box>
            )}
            {widget13.data && (
                <div className={classes.chartWrapper}>
                    <Line
                        data={{
                            labels: widget13.data.years,
                            datasets: (widget13.data.datasets || []).map((obj, index) => {
                                const c = COLORS[colorKeys[index % 2]];
                                return {
                                    ...obj,
                                    borderColor: c.border,
                                    backgroundColor: c.background,
                                    pointBackgroundColor: c.point,
                                    pointHoverBackgroundColor: c.border,
                                    pointBorderColor: '#ffffff',
                                    pointHoverBorderColor: '#ffffff',
                                    pointRadius: 4,
                                    pointHoverRadius: 6,
                                    borderWidth: 2.5,
                                    tension: 0.4,
                                    fill: true,
                                };
                            }),
                        }}
                        options={{
                            spanGaps: false,
                            legend: { display: false },
                            maintainAspectRatio: false,
                            tooltips: {
                                position: "nearest",
                                mode: "index",
                                intersect: false,
                                backgroundColor: '#0f172a',
                                titleFontColor: '#fff',
                                bodyFontColor: 'rgba(255,255,255,0.8)',
                                cornerRadius: 10,
                                padding: 12,
                            },
                            layout: { padding: { left: 8, right: 8 } },
                            scales: {
                                xAxes: [{
                                    gridLines: { display: false },
                                    ticks: { fontColor: '#94a3b8', fontSize: 11, fontStyle: '600' },
                                }],
                                yAxes: [{
                                    gridLines: { color: '#f1f5f9', tickMarkLength: 8 },
                                    ticks: { stepSize: 1000, fontColor: '#94a3b8', fontSize: 11 },
                                }],
                            },
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default React.memo(Widget13);
