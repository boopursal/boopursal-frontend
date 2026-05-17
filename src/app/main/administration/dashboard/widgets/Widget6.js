import React, { useEffect, useState } from "react";
import { Typography, makeStyles, Collapse, Box, CircularProgress, Icon } from "@material-ui/core";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

const useStyles = makeStyles(theme => ({
    root: {
        borderRadius: '20px',
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        }
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        '&:hover': {
            background: '#fafafa',
        }
    },
    title: {
        fontSize: '1.05rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.01em',
    },
    expandBtn: {
        width: 32,
        height: 32,
        borderRadius: 10,
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        transition: 'all 0.2s ease',
        border: '1px solid #e2e8f0',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        '& th': {
            textAlign: 'left',
            padding: '12px 16px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: '#f8fafc',
            borderBottom: '1px solid #f1f5f9',
        },
        '& td': {
            padding: '14px 16px',
            fontSize: '0.875rem',
            color: '#374151',
            borderBottom: '1px solid #f8fafc',
        },
        '& tr:last-child td': {
            borderBottom: 'none',
        },
        '& tr:hover td': {
            background: '#f8fafc',
        },
    },
    socName: {
        fontWeight: 700,
        color: '#0f172a',
    },
    statBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
        height: 26,
        borderRadius: 8,
        background: '#eff6ff',
        color: '#2563eb',
        fontWeight: 700,
        fontSize: '0.85rem',
        padding: '0 10px',
    },
    statBadgeSecondary: {
        background: '#f0fdf4',
        color: '#16a34a',
    }
}));

function Widget6(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget6 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget6);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        dispatch(Actions.getWidget6());
        return () => dispatch(Actions.cleanUpWidget6());
    }, [dispatch]);

    return (
        <div className={classes.root}>
            <div className={classes.header} onClick={() => setExpanded(!expanded)}>
                <Typography className={classes.title}>🏆 Top 10 Exportateurs</Typography>
                <div className={classes.expandBtn}>
                    {expanded ? <ExpandLessIcon style={{ fontSize: 18 }} /> : <ExpandMoreIcon style={{ fontSize: 18 }} />}
                </div>
            </div>

            {widget6.loading && (
                <Box p={4} display="flex" justifyContent="center">
                    <CircularProgress size={24} style={{ color: '#667eea' }} />
                </Box>
            )}

            {widget6.data && (
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <div className={classes.tableWrapper}>
                        <table className={classes.table}>
                            <thead>
                                <tr>
                                    <th>Fournisseur</th>
                                    <th style={{ textAlign: 'center' }}>Vues</th>
                                    <th style={{ textAlign: 'center' }}>Tél</th>
                                </tr>
                            </thead>
                            <tbody>
                                {widget6.data.map((row, index) => (
                                    <tr key={index}>
                                        <td className={classes.socName}>
                                            <span style={{ marginRight: 8, color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>#{index + 1}</span>
                                            {row.societe}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={classes.statBadge}>{row.visite}</span>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <span className={`${classes.statBadge} ${classes.statBadgeSecondary}`}>{row.phone_vu}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Collapse>
            )}
        </div>
    );
}

export default React.memo(Widget6);
