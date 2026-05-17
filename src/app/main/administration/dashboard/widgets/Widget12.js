import React, { useEffect } from "react";
import { Typography, makeStyles, CircularProgress, Box } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import { MONTHS } from "@fuse/Constants";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";

const COLORS = {
    fournisseurs: { border: '#667eea', background: 'rgba(102, 126, 234, 0.1)', point: '#764ba2' },
    acheteurs:    { border: '#11998e', background: 'rgba(17, 153, 142, 0.1)', point: '#38ef7d' },
};

const useStyles = makeStyles(theme => ({
    chartWrapper: {
        position: 'relative',
        height: 280,
        paddingBottom: 16,
    }
}));

function Widget12(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget12 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget12);
    const { currentRange, handleChangeTotal } = props;

    useEffect(() => {
        if (!currentRange) return;
        dispatch(Actions.getWidget12(currentRange));
        return () => dispatch(Actions.cleanUpWidget12());
    }, [dispatch, currentRange]);

    useEffect(() => {
        if (!widget12.data || (!widget12.data.totalAcheteurs && !widget12.data.totalFournisseurs)) return;
        handleChangeTotal(widget12.data.totalFournisseurs, widget12.data.totalAcheteurs);
    }, [widget12.data]);

    const colorKeys = ['fournisseurs', 'acheteurs'];

    return (
        <div>
            {widget12.loading && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress size={28} style={{ color: '#667eea' }} />
                </Box>
            )}
            {widget12.data && (
                <div className={classes.chartWrapper}>
                    <Line
                        data={{
                            labels: MONTHS,
                            datasets: (widget12.data.datasets || []).map((obj, index) => {
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

export default React.memo(Widget12);
