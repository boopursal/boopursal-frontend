import React, { useState, useEffect } from 'react';
import { Typography, Select, makeStyles, CircularProgress, Box, Icon } from '@material-ui/core';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Line } from 'react-chartjs-2';

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
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
    },
    title: {
        fontSize: '1.05rem',
        fontWeight: 800,
        color: '#0f172a',
        letterSpacing: '-0.01em',
    },
    subtitle: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 500,
        marginTop: 2,
    },
    selectField: {
        background: '#f8fafc',
        borderRadius: 10,
        padding: '4px 12px',
        fontSize: '0.8rem',
        fontWeight: 700,
        border: '1px solid #e2e8f0',
        color: '#475569',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: '1px solid #f8fafc',
        gap: 16,
        '&:last-child': {
            borderBottom: 'none',
        }
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        flexShrink: 0,
    },
    itemTitle: {
        fontSize: '0.9rem',
        fontWeight: 700,
        color: '#0f172a',
    },
    itemTime: {
        fontSize: '0.8rem',
        color: '#94a3b8',
        fontWeight: 500,
    },
}));

function Widget7(props) {
    const classes = useStyles();
    const [currentRange, setCurrentRange] = useState(props.widget?.currentRange || Object.keys(props.widget?.ranges || {})[0]);

    if (!props.widget) return null;

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div>
                    <Typography className={classes.title}>{props.widget.title || 'Activité'}</Typography>
                    <Typography className={classes.subtitle}>Calendrier des événements</Typography>
                </div>
                <Select
                    native
                    className={classes.selectField}
                    value={currentRange}
                    onChange={(e) => setCurrentRange(e.target.value)}
                    disableUnderline
                >
                    {Object.entries(props.widget.ranges || {}).map(([key, n]) => (
                        <option key={key} value={key}>{n}</option>
                    ))}
                </Select>
            </div>

            <div>
                {(props.widget.schedule?.[currentRange] || []).map(item => (
                    <div key={item.id} className={classes.listItem}>
                        <div className={classes.iconBox}>
                            <Icon style={{ fontSize: 18 }}>event</Icon>
                        </div>
                        <div style={{ flex: 1 }}>
                            <Typography className={classes.itemTitle}>{item.title}</Typography>
                            <Typography className={classes.itemTime}>{item.time}</Typography>
                        </div>
                        <Icon style={{ color: '#cbd5e1', fontSize: 20 }}>chevron_right</Icon>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default React.memo(Widget7);
