import React from 'react';
import { Grid, Card, CardContent, Typography, Icon, Chip, Button, Divider } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import ContentLoader from "react-content-loader"
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";
import moment from 'moment';
import _ from '@lodash';
import { Link } from 'react-router-dom';
import { InlineShareButtons } from 'sharethis-reactjs';

const ColorButton = withStyles((theme) => ({
    root: {
        color: 'white',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: '0 10px 20px -5px rgba(25, 118, 210, 0.4)',
        borderRadius: '30px',
        padding: '12px 32px',
        fontWeight: 800,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 15px 25px -5px rgba(25, 118, 210, 0.5)',
        },
    },
}))(Button);

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 275,
        borderRadius: 24,
        border: '1px solid #f1f5f9',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
        overflow: 'hidden',
        position: 'relative'
    },
    title: {
        fontSize: '2rem',
        fontWeight: 900,
        color: '#0f172a',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        marginBottom: 8
    },
    reference: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: 800,
        color: '#1e293b',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 8
    },
    descriptionBox: {
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        padding: 24,
        color: '#334155',
        fontSize: '1.1rem',
        lineHeight: 1.7,
        borderLeft: `4px solid ${theme.palette.primary.main}`
    },
    statCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }
    },
    budgetCard: {
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: 'white',
    },
    budgetLabel: {
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        fontWeight: 700,
        letterSpacing: '0.1em',
        opacity: 0.9,
        marginBottom: 8
    },
    budgetValue: {
        fontSize: '2rem',
        fontWeight: 900,
        lineHeight: 1
    },
    locationCard: {
        backgroundColor: '#ffffff',
        border: '1px solid #f1f5f9',
    },
    locationIcon: {
        fontSize: 48,
        color: '#3b82f6',
        marginBottom: 8
    },
    locationLabel: {
        fontSize: '0.75rem',
        color: '#64748b',
        textTransform: 'uppercase',
        fontWeight: 800,
        letterSpacing: '0.1em',
        marginBottom: 4
    },
    locationValue: {
        fontSize: '1.25rem',
        fontWeight: 900,
        color: '#1e293b'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        '&:last-child': {
            borderBottom: 'none'
        }
    },
    infoLabel: {
        color: '#64748b',
        fontWeight: 600,
        fontSize: '0.875rem',
        textTransform: 'uppercase'
    },
    infoValue: {
        color: '#0f172a',
        fontWeight: 700,
        fontSize: '0.875rem'
    },
    statusBadge: {
        fontWeight: 800,
        padding: '4px 12px',
        borderRadius: 20,
        fontSize: '0.75rem',
        textTransform: 'uppercase'
    },
    badgeActive: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    badgeExpired: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },
    categoryChip: {
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
        color: theme.palette.primary.main,
        fontWeight: 600,
        border: 'none',
        borderRadius: 8,
        '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.15)'
        }
    },
    fileChip: {
        border: '1px solid #e2e8f0',
        backgroundColor: 'white',
        fontWeight: 600,
        color: '#64748b',
        borderRadius: 12,
        padding: '24px 8px',
        transition: 'all 0.2s',
        '&:hover': {
            backgroundColor: '#f8fafc',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main
        }
    },
    gridContainer: {
        maxWidth: 1200,
        margin: '0 auto',
        paddingTop: 40,
        paddingBottom: 40,
        justifyContent: 'center'
    }
}));

function DemandeDetail(props) {
    const dispatch = useDispatch();
    const classes = useStyles();
    const demande = useSelector(({ demandesAchat }) => demandesAchat.demande);
    const user = useSelector(({ auth }) => auth.user);

    if (demande.data.length === 0 && !demande.loading) {
        return (
            <div className="w-full max-w-2xl mx-auto min-h-md flex flex-col items-center justify-center py-64">
                <Helmet>
                    <title>Demande d'achat introuvable</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <div className="bg-white rounded-32 shadow-xl p-48 text-center border border-slate-100">
                    <Icon className="text-64 text-red-400 mb-24">error_outline</Icon>
                    <Typography variant="h5" className="font-extrabold text-slate-800 mb-16">
                        Demande introuvable
                    </Typography>
                    <Typography className="text-slate-500 mb-32">
                        Cette demande d'achat a été supprimée ou n'existe pas.
                    </Typography>
                    <ColorButton onClick={() => props.history.goBack()}>
                        <Icon className="mr-8">arrow_back</Icon> Retourner
                    </ColorButton>
                </div>
            </div>
        );
    }

    function handleDownload(fiche) {
        dispatch(Actions.getFile(fiche))
    }

    return (
        <>
            {
                demande.data &&
                <Helmet>
                    <title>{_.truncate(demande.data.titre, { 'length': 70, 'separator': ' ' })}</title>
                    <meta name="description" content={_.truncate(demande.data.description, { 'length': 160, 'separator': ' ' })} />
                </Helmet>
            }

            <Grid container spacing={4} className={clsx(classes.gridContainer, "px-16 md:px-24 w-full")}>
                {
                    demande.loading ?
                        <Grid item xs={12}>
                            <ContentLoader speed={2} width={800} height={400} viewBox="0 0 800 400">
                                <rect x="0" y="0" rx="8" ry="8" width="800" height="400" />
                            </ContentLoader>
                        </Grid>
                        :
                        (
                            demande.data &&
                            (
                                <>
                                    <Grid item xs={12} md={8}>
                                        <Card className={classes.root} elevation={0}>
                                            <CardContent className="p-24 sm:p-32 md:p-40">
                                                <div className="mb-32">
                                                    <Typography className={classes.reference}>
                                                        {demande.data.reference ? `RÉF: ${demande.data.reference}` : 'RÉF. NON SPÉCIFIÉE'}
                                                    </Typography>
                                                    <Typography className={classes.title}>
                                                        {demande.data.titre}
                                                    </Typography>
                                                </div>

                                                <div className="mb-40">
                                                    <Typography className={classes.sectionTitle}>
                                                        <Icon>subject</Icon> Description du besoin
                                                    </Typography>
                                                    <div className={classes.descriptionBox}>
                                                        <Typography component="p" className="whitespace-pre-line" style={{ color: 'inherit', fontSize: 'inherit' }}>
                                                            {demande.data.description}
                                                        </Typography>
                                                    </div>
                                                </div>

                                                {demande.data.categories && demande.data.categories.length > 0 && (
                                                    <div className="mb-40">
                                                        <Typography className={classes.sectionTitle}>
                                                            <Icon>category</Icon> Catégories associées
                                                        </Typography>
                                                        <div className="flex flex-wrap gap-8" style={{ gap: '8px' }}>
                                                            {demande.data.categories.map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={item.name}
                                                                    className={classes.categoryChip}
                                                                    variant="default"
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {demande.data.attachements && demande.data.attachements.length > 0 && (
                                                    <div className="mb-32">
                                                        <Typography className={classes.sectionTitle}>
                                                            <Icon>attachment</Icon> Pièces jointes
                                                        </Typography>
                                                        <div className="flex flex-wrap gap-12" style={{ gap: '12px' }}>
                                                            {demande.data.attachements.map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    icon={<Icon>download</Icon>}
                                                                    label="Télécharger le fichier"
                                                                    onClick={() => handleDownload(item)}
                                                                    className={classes.fileChip}
                                                                    clickable
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <Divider className="my-32" />

                                                <div className="flex flex-wrap items-center justify-between" style={{ gap: '16px' }}>
                                                    <div className="flex items-center text-slate-500 font-medium" style={{ gap: '12px' }}>
                                                        <Icon className="text-20">share</Icon> Partager:
                                                        <InlineShareButtons
                                                            config={{
                                                                alignment: 'left',
                                                                color: 'social',
                                                                enabled: true,
                                                                font_size: 14,
                                                                networks: ['linkedin', 'twitter', 'facebook', 'email'],
                                                                padding: 8,
                                                                radius: 8,
                                                                size: 32,
                                                                title: demande.data.titre,
                                                                description: demande.data.description
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <div className={clsx(classes.statCard, classes.budgetCard)}>
                                            <Typography className={classes.budgetLabel}>Budget Estimé</Typography>
                                            <Typography className={classes.budgetValue}>
                                                {demande.data.budget 
                                                    ? `${parseFloat(demande.data.budget).toLocaleString('fr', { minimumFractionDigits: 0 })} ${demande.data.currency?.currency || 'DH'}`
                                                    : 'Sur devis'}
                                            </Typography>
                                        </div>

                                        <div className={clsx(classes.statCard, classes.locationCard)}>
                                            <Icon className={classes.locationIcon}>location_on</Icon>
                                            <Typography className={classes.locationLabel}>Emplacement</Typography>
                                            <Typography className={classes.locationValue}>
                                                {demande.data.ville ? `${demande.data.ville}, ` : ''}{demande.data.pays || 'Non spécifié'}
                                            </Typography>
                                        </div>

                                        <Card className={clsx(classes.root, 'mb-24')} elevation={0}>
                                            <div className={classes.infoRow}>
                                                <Typography className={classes.infoLabel}>Statut</Typography>
                                                <div className={clsx(classes.statusBadge, moment(demande.data.dateExpiration) >= moment() && demande.data.statut === 1 ? classes.badgeActive : classes.badgeExpired)}>
                                                    {moment(demande.data.dateExpiration) >= moment() && demande.data.statut === 1 ? 'En Cours' : 'Expirée'}
                                                </div>
                                            </div>
                                            <div className={classes.infoRow}>
                                                <Typography className={classes.infoLabel}>Publiée le</Typography>
                                                <Typography className={classes.infoValue}>{moment(demande.data.created).format("DD MMM YYYY")}</Typography>
                                            </div>
                                            <div className={classes.infoRow}>
                                                <Typography className={classes.infoLabel}>Expire le</Typography>
                                                <Typography className={classes.infoValue}>{moment(demande.data.dateExpiration).format("DD MMM YYYY")}</Typography>
                                            </div>
                                        </Card>

                                        {(user.role === 'ROLE_FOURNISSEUR' || !user.role || user.role.length === 0) && (
                                            <ColorButton 
                                                style={{ width: '100%' }}
                                                component={Link} 
                                                to={`/demandes_prix/${demande.data.id}`}
                                            >
                                                Répondre à cette demande
                                            </ColorButton>
                                        )}
                                    </Grid>
                                </>
                            )
                        )
                }
            </Grid >
        </>
    );
}

export default React.memo(DemandeDetail);

