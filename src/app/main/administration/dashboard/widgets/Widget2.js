import React, { useEffect } from "react";
import { Typography, makeStyles, Icon } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";
import { LOCAL_CURRENCY } from "@fuse/Constants";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(79, 172, 254, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            transition: 'all 0.4s ease',
        },
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-30%',
            left: '-10%',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
        },
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 60px rgba(79, 172, 254, 0.5)',
        }
    },
    iconWrapper: {
        width: '52px',
        height: '52px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid rgba(255,255,255,0.3)',
    },
    value: {
        fontSize: '1.6rem',
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1,
        marginBottom: '6px',
        position: 'relative',
        zIndex: 1,
        letterSpacing: '-0.02em',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.8)',
        position: 'relative',
        zIndex: 1,
    },
    trend: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        background: 'rgba(255,255,255,0.2)',
        padding: '3px 10px',
        borderRadius: 20,
        position: 'relative',
        zIndex: 1,
    }
}));

function Widget2(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget2 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget2);
    const { currentRange } = props;

    useEffect(() => {
        if (!currentRange) return;
        dispatch(Actions.getWidget2(currentRange));
        return () => dispatch(Actions.cleanUpWidget2());
    }, [dispatch, currentRange]);

    const financial = (x) => parseFloat(x).toLocaleString("fr", { minimumFractionDigits: 2 });

    return (
        <div className={classes.root}>
            <div className={classes.iconWrapper}>
                <Icon style={{ fontSize: 22 }}>toll</Icon>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                <div>
                    <Typography className={classes.value}>
                        {widget2.data ? financial(widget2.data.value) : "0,00"} {LOCAL_CURRENCY}
                    </Typography>
                    <Typography className={classes.label}>CA Jetons</Typography>
                </div>
                <span className={classes.trend}>
                    1.1%
                    <Icon style={{ fontSize: 14 }}>arrow_upward</Icon>
                </span>
            </div>
        </div>
    );
}

export default React.memo(Widget2);
