import React from 'react';
import { Typography, makeStyles, Icon } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        padding: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: '#f8fafc'
        }
    },
    iconWrapper: {
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3c50e0',
        marginBottom: '20px'
    },
    value: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#1c2434',
        lineHeight: 1,
        marginBottom: '4px'
    },
    title: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#64748b'
    }
}));

function Widget1(props) {
    const classes = useStyles();

    return (
        <Link to="/demandes_prix" className={classes.root}>
            <div className={classes.iconWrapper}>
                <Icon fontSize="small">pending_actions</Icon>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto' }}>
                <div>
                    <Typography className={classes.value}>{props.widget}</Typography>
                    <Typography className={classes.title}>Demandes en cours</Typography>
                </div>
            </div>
        </Link>
    );
}

export default React.memo(Widget1);
