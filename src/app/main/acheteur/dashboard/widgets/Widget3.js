import React from 'react';
import { Typography, makeStyles, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '28px',
        background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(253, 160, 133, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
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
            transform: 'translateY(-6px) scale(1.02)',
            boxShadow: '0 20px 60px rgba(253, 160, 133, 0.5)',
            '&::before': {
                transform: 'scale(1.3) rotate(15deg)',
            }
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
        fontSize: '2.2rem',
        fontWeight: 900,
        color: '#ffffff',
        lineHeight: 1,
        marginBottom: '6px',
        position: 'relative',
        zIndex: 1,
        letterSpacing: '-0.02em',
    },
    title: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.85)',
        position: 'relative',
        zIndex: 1,
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        background: 'rgba(255,255,255,0.15)',
        padding: '3px 10px',
        borderRadius: 20,
        position: 'relative',
        zIndex: 1,
    }
}));

function Widget3(props) {
    const classes = useStyles();

    return (
        <Link to="/demandes" className={classes.root} style={{ textDecoration: 'none' }}>
            <div className={classes.iconWrapper}>
                <Icon style={{ fontSize: 22 }}>hourglass_empty</Icon>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
                <div>
                    <Typography className={classes.value}>{props.widget || 0}</Typography>
                    <Typography className={classes.title}>En attente</Typography>
                </div>
                <span className={classes.badge}>
                    <Icon style={{ fontSize: 14 }}>schedule</Icon>
                    Pending
                </span>
            </div>
        </Link>
    );
}

export default React.memo(Widget3);
