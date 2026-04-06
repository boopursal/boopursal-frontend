import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';

const useStyles = makeStyles(theme => ({
    count: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center'
    },
    sortLabel: {
        fontSize: '0.875rem',
        color: '#64748b',
        marginRight: 12
    },
    select: {
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#1e293b',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: '6px 12px',
        border: '1px solid #e2e8f0',
        '&:focus': {
            borderColor: theme.palette.primary.main,
            backgroundColor: 'white'
        }
    }
}));

function HeaderContentList(props) {
    const classes = useStyles();
    const totalItems = useSelector(({ demandesAchat }) => demandesAchat.demandes.totalItems);
    const parametres = useSelector(({ demandesAchat }) => demandesAchat.demandes.parametres);
    const loading = useSelector(({ demandesAchat }) => demandesAchat.demandes.loading);
    const dispatch = useDispatch();

    function handleChangeRange(ev) {
        dispatch(Actions.setParametresData({
            ...parametres,
            page: 1,
            filter: { ...parametres.filter, id: ev.target.value }
        }));
    }

    if (loading && !totalItems) return null;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-24 py-16 bg-white border border-slate-200 rounded-16 mb-24 shadow-sm">
            <div className={classes.count}>
                <span className="w-8 h-8 rounded-full bg-blue-500 mr-8" />
                <strong>{totalItems}</strong>&nbsp;demande(s) trouvée(s)
            </div>

            <div className="flex items-center mt-12 sm:mt-0">
                <Typography className={classes.sortLabel}>Trier par :</Typography>
                <Select
                    native
                    value={parametres.filter.id}
                    onChange={handleChangeRange}
                    className={classes.select}
                    disableUnderline
                >
                    <option value='created-desc'>Plus récent</option>
                    <option value='created-asc'>Plus ancien</option>
                    <option value='budget-asc'>Budget : Croissant</option>
                    <option value='budget-desc'>Budget : Décroissant</option>
                </Select>
            </div>
        </div>
    )
}

export default HeaderContentList;