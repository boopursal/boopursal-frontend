import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Select, Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import * as Actions from '../../store/actions';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        sm: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        padding: '20px 24px',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        marginBottom: 24,
        border: '1px solid #f1f5f9'
    },
    count: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    select: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#1e293b',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: '6px 16px',
        border: '1px solid #e2e8f0',
        minWidth: 160,
        '&:focus': {
            borderColor: theme.palette.primary.main
        }
    }
}));

function HeaderProduit(props) {
    const classes = useStyles();
    const totalItems = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.totalItems);
    const parametres = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseur.parametres);
    const dispatch = useDispatch();

    function handleChangeRange(ev) {
        dispatch(Actions.setParametresData({
            ...parametres,
            page: 1,
            filter: { ...parametres.filter, id: ev.target.value }
        }));
    }

    return (
        <div className={clsx(classes.root, "flex flex-col sm:flex-row items-center justify-between")}>
            <div className={classes.count}>
                <div className="w-8 h-8 rounded-full bg-blue-500" />
                <span><strong>{totalItems || 0}</strong> produits trouvés</span>
            </div>

            <div className="flex items-center mt-16 sm:mt-0">
                <Typography className="text-13 mr-12 font-bold text-slate-400 uppercase tracking-wider">Trier par :</Typography>
                <Select
                    native
                    value={parametres.filter.id}
                    onChange={handleChangeRange}
                    className={classes.select}
                    disableUnderline
                >
                    <option value='created-desc'>Plus récent</option>
                    <option value='created-asc'>Plus ancien</option>
                </Select>
            </div>
        </div>
    );
}

export default HeaderProduit;