import React, { useEffect } from "react";
import { CircularProgress, Tooltip, makeStyles, Icon } from "@material-ui/core";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        padding: '8px 0',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 12,
        transition: 'background 0.2s ease',
        '&:hover': {
            background: '#f8fafc',
        }
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 800,
        flexShrink: 0,
    },
    info: {
        flex: 1,
        minWidth: 0,
    },
    socName: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#0f172a',
        textDecoration: 'none',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        '&:hover': {
            color: '#667eea',
        }
    },
    date: {
        fontSize: '0.75rem',
        color: '#94a3b8',
        fontWeight: 500,
        marginTop: 2,
    },
    newBadge: {
        fontSize: '0.7rem',
        fontWeight: 700,
        color: '#667eea',
        background: 'rgba(102,126,234,0.1)',
        padding: '2px 8px',
        borderRadius: 10,
        whiteSpace: 'nowrap',
        border: '1px solid rgba(102,126,234,0.2)',
    }
}));

function Widget10(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const widget10 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget10);
    const { handleChangeTotal } = props;

    useEffect(() => {
        dispatch(Actions.getWidget10());
        return () => dispatch(Actions.cleanUpWidget10());
    }, [dispatch]);

    useEffect(() => {
        if (widget10.total) handleChangeTotal(widget10.total);
    }, [widget10.total, handleChangeTotal]);

    return (
        <div className={classes.root}>
            {widget10.loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                    <CircularProgress size={24} style={{ color: '#667eea' }} />
                </div>
            )}
            {widget10.data && (
                <ul className={classes.list}>
                    {widget10.data.map((row, index) => (
                        <li key={index} className={classes.listItem}>
                            <div className={classes.avatar}>
                                {row.societe?.charAt(0)?.toUpperCase() || 'F'}
                            </div>
                            <div className={classes.info}>
                                <Tooltip title="Voir le profil fournisseur" placement="top">
                                    <Link to={"/users/fournisseur/show/" + row.id} className={classes.socName}>
                                        {row.societe}
                                    </Link>
                                </Tooltip>
                                <span className={classes.date}>{moment(row.created).format("DD MMM · HH:mm")}</span>
                            </div>
                            <span className={classes.newBadge}>Nouveau</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default React.memo(Widget10);
