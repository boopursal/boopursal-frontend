import React, { useEffect } from "react";
import { Typography, makeStyles, Icon, CircularProgress, Box } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../store/actions";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '20px 24px',
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        height: '100%',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid #f8fafc',
        '&:last-child': {
            borderBottom: 'none',
        }
    },
    name: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#1e293b',
        flex: 1,
    },
    countBadge: {
        minWidth: 32,
        height: 26,
        borderRadius: 8,
        background: 'linear-gradient(135deg, #667eea20, #764ba220)',
        color: '#667eea',
        fontWeight: 800,
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #667eea30',
        padding: '0 10px',
    }
}));

function Widget4(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget4 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget4);

    useEffect(() => {
        dispatch(Actions.getWidget4());
        return () => dispatch(Actions.cleanUpWidget4());
    }, [dispatch]);

    return (
        <div className={classes.root}>
            {widget4.loading && (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress size={28} style={{ color: '#667eea' }} />
                </Box>
            )}
            {widget4.data && (
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                    {widget4.data.map((row, index) => (
                        <div key={index} className={classes.listItem}>
                            <Typography className={classes.name}>{row.name}</Typography>
                            <span className={classes.countBadge}>{row.count}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(Widget4);
