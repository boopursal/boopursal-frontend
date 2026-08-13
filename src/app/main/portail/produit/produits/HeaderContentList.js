import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography, Select, Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import * as Actions from '../store/actions';

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12
    },
    countBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 40,
        padding: '10px 20px',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)'
    },
    countDot: {
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 0 3px ${theme.palette.primary.main}22`
    },
    countText: {
        fontSize: '1rem',
        color: '#475569',
        fontWeight: 600,
        '& strong': {
            color: '#0f172a',
            fontSize: '1.1rem',
            fontWeight: 800
        }
    },
    sortWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 40,
        padding: '8px 16px 8px 20px',
        boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)'
    },
    sortIcon: {
        fontSize: 18,
        color: '#94a3b8'
    },
    sortLabel: {
        fontSize: '0.9rem',
        color: '#64748b',
        fontWeight: 600,
        whiteSpace: 'nowrap'
    },
    select: {
        fontSize: '0.9rem',
        fontWeight: 700,
        color: theme.palette.primary.main,
        '& select': {
            paddingRight: '24px !important'
        },
        '&:before, &:after': { display: 'none' }
    }
}));

function HeaderContentList(props) {
    const classes = useStyles();
    const { t } = useTranslation();
    const totalItems = useSelector(({ produitsApp }) => produitsApp.produits.totalItems);
    const parametres = useSelector(({ produitsApp }) => produitsApp.produits.parametres);
    const loading = useSelector(({ produitsApp }) => produitsApp.produits.loading);
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
        <div className={classes.wrapper}>
            <div className={classes.countBadge}>
                <span className={classes.countDot} />
                <Typography className={classes.countText}>
                    <strong>{totalItems}</strong>&nbsp;{t('portail.found_products', 'produit(s) / service(s) trouvé(s)')}
                </Typography>
            </div>

            <div className={classes.sortWrapper}>
                <Icon className={classes.sortIcon}>sort</Icon>
                <Typography className={classes.sortLabel}>{t('portail.sort_by', 'Trier par :')}</Typography>
                <Select
                    native
                    value={parametres.filter.id}
                    onChange={handleChangeRange}
                    className={classes.select}
                    disableUnderline
                >
                    <option value='created-desc'>{t('portail.newest', 'Plus récent')}</option>
                    <option value='created-asc'>{t('portail.oldest', 'Plus ancien')}</option>
                    <option value='pu-asc'>{t('portail.price_asc', 'Prix : Croissant')}</option>
                    <option value='pu-desc'>{t('portail.price_desc', 'Prix : Décroissant')}</option>
                </Select>
            </div>
        </div>
    )
}

export default HeaderContentList;
