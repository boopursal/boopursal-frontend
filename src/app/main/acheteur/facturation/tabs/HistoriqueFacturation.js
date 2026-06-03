import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { FuseAnimate } from '@fuse';
import { Typography, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/fr';
import { makeStyles } from '@material-ui/styles';
import agent from 'agent';

const useStyles = makeStyles(theme => ({
    chipOrange: {
        padding: 2,
        background: '#ff9800',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20
    },
    chipGreen: {
        padding: 2,
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20
    },
    chipBlue: {
        padding: 2,
        background: '#3490dc',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20
    }
}));

function HistoriqueFacturation() {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [commandes, setCommandes] = useState([]);

    useEffect(() => {
        let isMounted = true;
        agent.get('/api/demande_abonnements/my')
            .then(response => {
                if (isMounted) {
                    setCommandes(response.data['hydra:member'] || []);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Erreur lors de la récupération de l'historique", error);
                if (isMounted) {
                    setLoading(false);
                }
            });
        
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center h-full p-24">
                <CircularProgress color="secondary" /> &ensp; Chargement...
            </div>
        );
    }

    return (
        <div className="p-24">
            <Helmet>
                <title>Historique de facturation | Les Achats Industriels</title>
            </Helmet>
            <FuseAnimate animation="transition.slideUpIn" delay={300}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography variant="h6" className="uppercase mb-16">
                            Historique des commandes
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table aria-label="historique facturation">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Référence</TableCell>
                                        <TableCell>Offre</TableCell>
                                        <TableCell>Durée</TableCell>
                                        <TableCell>Montant</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Statut</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {commandes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Aucune commande trouvée.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        commandes.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    {row.reference}
                                                </TableCell>
                                                <TableCell>{row.offre ? row.offre.name : '-'}</TableCell>
                                                <TableCell>{row.duree ? row.duree.name + ' mois' : '-'}</TableCell>
                                                <TableCell>
                                                    {row.prix ? new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(row.prix) : '0,00'} {row.currency || 'MAD'}
                                                </TableCell>
                                                <TableCell>{moment(row.created).format('DD/MM/YYYY HH:mm')}</TableCell>
                                                <TableCell>
                                                    {row.type === false ? (
                                                        <Chip className={classes.chipBlue} label="Nouvelle" />
                                                    ) : (
                                                        <Chip className={classes.chipGreen} label="Renouvellement" />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {row.statut === false ? (
                                                        <Chip className={classes.chipOrange} label="En attente" />
                                                    ) : (
                                                        <Chip className={classes.chipGreen} label="Traitée" />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </FuseAnimate>
        </div>
    );
}

export default HistoriqueFacturation;
