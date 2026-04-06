import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Typography, Button, Paper, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { FuseAnimate, FuseAnimateGroup } from '@fuse';
import clsx from 'clsx';
import _ from '@lodash';
import * as Actions from '../store/actions';

const useStyles = makeStyles(theme => ({
    gridContainer: {
        paddingBottom: '40px'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid #f1f5f9',
        backgroundColor: 'white',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        textDecoration: 'none !important',
        '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
            borderColor: theme.palette.primary.main,
            '& $cardHeader': {
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }
        }
    },
    cardHeader: {
        height: 140,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
        }
    },
    headerIcon: {
        fontSize: 48,
        color: 'rgba(255,255,255,0.2)',
    },
    cardContent: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    category: {
        fontSize: 10,
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.palette.primary.main,
        marginBottom: 8
    },
    title: {
        fontSize: '1rem',
        fontWeight: 700,
        color: '#1e293b',
        lineHeight: 1.4,
        marginBottom: 12,
        height: '2.8em',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    metaRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: '#64748b',
        fontSize: '0.75rem',
        marginBottom: 6
    },
    budgetBadge: {
        marginTop: 'auto',
        paddingTop: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    price: {
        fontSize: '1rem',
        fontWeight: 800,
        color: '#059669', // Emerald-600
    },
    priceLabel: {
        fontSize: '0.7rem',
        color: '#94a3b8',
        fontWeight: 600,
        textTransform: 'uppercase'
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '12px 16px',
        marginTop: '32px',
        backgroundColor: 'white',
        borderRadius: 40,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        gap: 8,
        border: '1px solid #e2e8f0',
        width: 'fit-content',
        margin: '32px auto 0'
    },
    pageBtn: {
        minWidth: 40,
        width: 40,
        height: 40,
        borderRadius: 20,
        fontWeight: 700,
        fontSize: '0.875rem',
        color: '#64748b',
        '&.active': {
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            }
        }
    }
}));

function DemandeListItem(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const demandes = useSelector(({ demandesAchat }) => demandesAchat.demandes.data);
    const totalItems = useSelector(({ demandesAchat }) => demandesAchat.demandes.totalItems);
    const parametres = useSelector(({ demandesAchat }) => demandesAchat.demandes.parametres);
    const loading = useSelector(({ demandesAchat }) => demandesAchat.demandes.loading);

    const totalPages = Math.ceil(totalItems / parametres.itemsPerPage);

    const handlePageChange = (newPage) => {
        dispatch(Actions.setParametresData({ ...parametres, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!demandes || demandes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-80 bg-white rounded-24 border-2 border-dashed border-slate-200">
                <Icon className="text-64 text-slate-200 mb-16">search_off</Icon>
                <Typography className="text-20 font-bold text-slate-400">Aucune demande trouvée</Typography>
                <Typography className="text-slate-400 mt-8">Essayez de modifier vos filtres de recherche</Typography>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className={classes.gridContainer}>
                <Grid container spacing={3}>
                    {demandes.map((item) => (
                        <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={item.id}>
                            <FuseAnimate animation="transition.slideUpIn" duration={400}>
                                <Paper
                                    component={Link}
                                    to={`/demandes-achat/${item.id}-${item.slug}`}
                                    className={classes.card}
                                    elevation={0}
                                >
                            <div className={classes.cardHeader}>
                                <Icon className={classes.headerIcon}>description</Icon>
                                <div className="absolute top-12 right-12">
                                    <div className="bg-white/20 backdrop-blur-md px-8 py-4 rounded-8 text-white text-10 font-bold uppercase">
                                        Réf: {item.reference || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className={classes.cardContent}>
                                <Typography className={classes.category}>
                                    {item.secteur ? item.secteur.name : 'Général'}
                                </Typography>
                                <Typography className={classes.title}>
                                    {item.titre || item.name || 'Sans titre'}
                                </Typography>
                                
                                <div className={classes.metaRow}>
                                    <Icon className="text-14">location_on</Icon>
                                    <span>{item.ville ? (typeof item.ville === 'object' ? item.ville.name : item.ville) + ', ' : ''}{item.pays ? (typeof item.pays === 'object' ? item.pays.name : item.pays) : 'N/A'}</span>
                                </div>
                                
                                <div className={classes.metaRow}>
                                    <Icon className="text-14">calendar_today</Icon>
                                    <span>{(item.created || item.createdAt || item.dateCreation || item.date) ? new Date(item.created || item.createdAt || item.dateCreation || item.date).toLocaleDateString() : 'N/A'}</span>
                                </div>

                                <div className={classes.budgetBadge}>
                                    <div className="flex flex-col">
                                        <span className={classes.priceLabel}>Budget</span>
                                        <span className={classes.price}>
                                            {item.budget ? `${item.budget.toLocaleString()} DH` : 'Sur devis'}
                                        </span>
                                    </div>
                                    <Button size="small" color="primary" variant="contained" className="min-w-32 h-32 rounded-12 shadow-none">
                                        <Icon className="text-18">chevron_right</Icon>
                                    </Button>
                                </div>
                            </div>
                        </Paper>
                            </FuseAnimate>
                        </Grid>
                    ))}
                </Grid>
            </div>

            {totalPages > 1 && (
                <div className={classes.paginationContainer}>
                    <Button
                        onClick={() => handlePageChange(Math.max(1, parametres.page - 1))}
                        disabled={parametres.page === 1}
                        className={classes.pageBtn}
                    >
                        <Icon>chevron_left</Icon>
                    </Button>

                    {_.range(1, totalPages + 1).map((p) => (
                        <Button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={clsx(classes.pageBtn, p === parametres.page && "active")}
                        >
                            {p}
                        </Button>
                    ))}

                    <Button
                        onClick={() => handlePageChange(Math.min(totalPages, parametres.page + 1))}
                        disabled={parametres.page === totalPages}
                        className={classes.pageBtn}
                    >
                        <Icon>chevron_right</Icon>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default DemandeListItem;