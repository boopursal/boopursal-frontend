import React, { useEffect, useRef, useState } from 'react';
import { Typography, makeStyles, Icon } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/fr';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(37, 99, 235, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '-40%',
            right: '-15%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
        }
    },
    iconWrapper: {
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
    },
    dayNumber: {
        fontSize: '3.5rem',
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        position: 'relative',
        zIndex: 1,
    },
    monthYear: {
        fontSize: '1rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.75)',
        position: 'relative',
        zIndex: 1,
        marginBottom: 4,
    },
    timeBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        background: 'rgba(255,255,255,0.12)',
        padding: '5px 14px',
        borderRadius: 20,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.15)',
        letterSpacing: '0.02em',
        fontVariantNumeric: 'tabular-nums',
    }
}));

function WidgetNow() {
    const classes = useStyles();
    const [time, setTime] = useState(moment());
    const intervalRef = useRef();

    useEffect(() => {
        intervalRef.current = setInterval(() => setTime(moment()), 1000);
        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.iconWrapper}>
                <Icon style={{ fontSize: 22 }}>calendar_today</Icon>
            </div>
            <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                <Typography className={classes.monthYear}>
                    {time.format('MMMM YYYY')}
                </Typography>
                <Typography className={classes.dayNumber}>
                    {time.format('D')}
                </Typography>
                <div style={{ marginTop: 12 }}>
                    <span className={classes.timeBadge}>
                        <Icon style={{ fontSize: 14 }}>schedule</Icon>
                        {time.format('HH:mm:ss')}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default React.memo(WidgetNow);
