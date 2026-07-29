import React from 'react';
import { Dialog, DialogContent, Typography, Button, IconButton, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    dialogPaper: {
        borderRadius: 20,
        overflow: 'hidden',
        maxWidth: 460,
    },
    closeBtn: {
        position: 'absolute',
        top: 12,
        right: 12,
        color: 'white',
        background: 'rgba(255,255,255,0.15)',
        '&:hover': {
            background: 'rgba(255,255,255,0.25)',
        }
    },
    header: {
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '40px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
    },
    lockIcon: {
        width: 72,
        height: 72,
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    body: {
        padding: '28px 32px 32px',
        textAlign: 'center',
        background: '#fff',
    },
    commandBtn: {
        background: 'linear-gradient(135deg, #2563eb, #1e40af)',
        color: 'white',
        borderRadius: 12,
        padding: '10px 28px',
        fontWeight: 700,
        fontSize: 14,
        textTransform: 'none',
        marginTop: 8,
        boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
        '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
            boxShadow: '0 6px 20px rgba(37,99,235,0.45)',
        }
    },
    cancelBtn: {
        marginTop: 12,
        color: '#64748b',
        fontWeight: 600,
        fontSize: 13,
        textTransform: 'none',
        '&:hover': {
            background: '#f1f5f9',
        }
    },
    emailLink: {
        color: '#2563eb',
        fontWeight: 600,
        fontSize: 13,
        textDecoration: 'none',
        marginTop: 16,
        display: 'block',
        '&:hover': { textDecoration: 'underline' }
    },
}));

/**
 * ReservedDialog - composant premium réutilisable "Réservé à nos abonnés"
 * 
 * Props:
 * - open: boolean
 * - onClose: function
 * - billingUrl: string (défaut: '/billing/pack')
 */
function ReservedDialog({ open, onClose, billingUrl = '/billing/pack' }) {
    const classes = useStyles();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{ paper: classes.dialogPaper }}
            maxWidth="sm"
            fullWidth
        >
            {/* Header gradient */}
            <div className={classes.header}>
                <IconButton className={classes.closeBtn} onClick={onClose} size="small">
                    <Icon style={{ fontSize: 20 }}>close</Icon>
                </IconButton>
                <div className={classes.lockIcon}>
                    <Icon style={{ color: 'white', fontSize: 36 }}>lock</Icon>
                </div>
                <Typography style={{ color: 'white', fontWeight: 800, fontSize: 22, letterSpacing: '-0.3px' }}>
                    Réservé à nos abonnés
                </Typography>
                <Typography style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 6 }}>
                    Fonctionnalité Premium
                </Typography>
            </div>

            {/* Body */}
            <DialogContent className={classes.body}>
                <Typography style={{ color: '#475569', fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
                    Cette fonctionnalité n'est pas incluse dans votre pack actuel.
                    Mettez à niveau votre abonnement pour en bénéficier et accéder à toutes les fonctionnalités de la plateforme.
                </Typography>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
                    <Button
                        component={Link}
                        to={billingUrl}
                        className={classes.commandBtn}
                        onClick={onClose}
                    >
                        <Icon style={{ marginRight: 8 }}>rocket_launch</Icon>
                        Mettre à niveau mon abonnement
                    </Button>

                    <Button
                        className={classes.cancelBtn}
                        onClick={onClose}
                    >
                        Pas maintenant
                    </Button>

                    <a
                        href="mailto:administrateur@boopursal.com"
                        className={classes.emailLink}
                    >
                        administrateur@boopursal.com
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ReservedDialog;
