import React, { useEffect, useRef, useState } from "react";
import { Typography, makeStyles, Icon } from "@material-ui/core";
import moment from "moment";
import "moment/locale/fr";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(15, 23, 42, 0.35)',
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
            background: 'rgba(102, 126, 234, 0.15)',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(118, 75, 162, 0.1)',
        }
    },
    iconWrapper: {
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        background: 'rgba(102, 126, 234, 0.2)',
        border: '1px solid rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a5b4fc',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1,
    },
    timeDisplay: {
        fontSize: '2.4rem',
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1,
        letterSpacing: '-0.03em',
        marginBottom: 6,
        position: 'relative',
        zIndex: 1,
        fontVariantNumeric: 'tabular-nums',
    },
    dayDisplay: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        position: 'relative',
        zIndex: 1,
    },
    dateDisplay: {
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.75)',
        background: 'rgba(255,255,255,0.1)',
        padding: '4px 12px',
        borderRadius: 20,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
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
                <Icon style={{ fontSize: 22 }}>schedule</Icon>
            </div>
            <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                    <Typography className={classes.timeDisplay}>
                        {time.format("HH:mm:ss")}
                    </Typography>
                    <Typography className={classes.dayDisplay}>
                        {time.format("dddd")}
                    </Typography>
                </div>
                <span className={classes.dateDisplay}>
                    {time.format("D MMM YYYY")}
                </span>
            </div>
        </div>
    );
}

export default React.memo(WidgetNow);
