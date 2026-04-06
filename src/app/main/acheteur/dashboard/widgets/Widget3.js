import React from 'react';
import { Typography, makeStyles, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3),
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 20px rgba(249, 115, 22, 0.1)',
            borderColor: '#f97316',
        }
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#fff7ed",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing(2),
        color: "#f97316",
    },
    title: {
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: theme.spacing(1),
    },
    value: {
        fontSize: "2.5rem",
        fontWeight: 800,
        color: "#111827",
        lineHeight: 1,
    }
}));

function Widget3(props) {
    const classes = useStyles();

    return (
        <Link to="/demandes" className={classes.root}>
            <div className={classes.iconBox}>
                <Icon>hourglass_empty</Icon>
            </div>
            <Typography className={classes.title}>En attente</Typography>
            <Typography className={classes.value}>{props.widget}</Typography>
        </Link>
    );
}

export default React.memo(Widget3);
