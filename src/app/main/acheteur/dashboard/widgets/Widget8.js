import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2';

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
    title: {
        fontSize: '1.05rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.01em',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 500,
        marginBottom: 24,
    },
    chartContainer: {
        height: 360,
        width: '100%',
    }
}));

function Widget8(props) {
    const classes = useStyles();

    if (!props.widget) return null;

    return (
        <div className={classes.root}>
            <Typography className={classes.title}>{props.widget.title}</Typography>
            <Typography className={classes.subtitle}>Répartition par catégorie</Typography>
            <div className={classes.chartContainer}>
                <Doughnut
                    data={{
                        labels: props.widget.mainChart.labels,
                        datasets: (props.widget.mainChart.datasets || []).map(ds => ({
                            ...ds,
                            borderWidth: 0,
                            hoverOffset: 6,
                        }))
                    }}
                    options={{
                        ...props.widget.mainChart.options,
                        cutoutPercentage: 72,
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                padding: 20,
                                usePointStyle: true,
                                fontColor: '#64748b',
                                fontFamily: 'Inter, sans-serif',
                                fontStyle: '600',
                            }
                        },
                        tooltips: {
                            backgroundColor: '#0f172a',
                            titleFontColor: '#fff',
                            bodyFontColor: 'rgba(255,255,255,0.8)',
                            cornerRadius: 10,
                            padding: 12,
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default React.memo(Widget8);
