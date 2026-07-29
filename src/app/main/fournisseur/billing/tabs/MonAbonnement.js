import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from "react-helmet";
import * as Actions from '../store/actions';
import { FuseAnimate } from '@fuse';
import { Typography, CircularProgress, Grid, Icon, Tooltip, Divider, Button, IconButton, Chip } from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';
import 'moment/locale/fr';
import clsx from 'clsx';
import _ from '@lodash';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({

    chip: {
        padding: 2,
        background: '#ef5350',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20


    },
    blue: {
        padding: 2,
        background: '#3490dc',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20


    },
    chip2: {
        padding: 2,
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20
    },
    chipOrange: {
        padding: 2,
        background: '#ff9800',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        height: 20

    },
}));
function MonAbonnement() {

    const dispatch = useDispatch();
    const [tabValue, setTabValue] = useState(0);
    const commande = useSelector(({ billingApp }) => billingApp?.commande);
    const user = useSelector(({ auth }) => auth.user);
    const abonnement = useSelector(({ auth }) => auth.user.abonnement);
    const loadingAbonnement = useSelector(({ auth }) => auth.user.loadingAbonnement);
    const [abonnee, setAbonnee] = useState(false);
    const [enable, setEnable] = useState(true);
    const [expired, setExpired] = useState(false);
    const [days, setDays] = useState(0);
    const classes = useStyles();

    // get commande 

    useEffect(() => {
        if (!user.id) {
            return;
        }
        dispatch(Actions.getCommande(user.id));
    }, [dispatch, user]);

    // Effect abonnement
    useEffect(() => {
        if (!abonnement)
            return;
        if (!abonnement.statut) {
            //desactivé par admin
            setEnable(false)
            return;
        }
        let days = moment(abonnement.expired).diff(moment(), 'days');
        setDays(days);

        if (days <= 0) {
            // abonnement expiré
            setExpired(true);
        }

        if (abonnement.statut && days > 0) {
            //abonnement en cours
            setAbonnee(true);
        }
    }, [abonnement]);
    if (loadingAbonnement) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <CircularProgress color="secondary" /> &ensp;
               Chargement ...
            </div>
        );
    }
    function handleRenew() {
        if (!abonnement) {
            return;
        }
        const data = {
            offre: abonnement.offre,
            sousSecteurs: abonnement.sousSecteurs,
            mode: abonnement.mode,
            duree: abonnement.duree,
            type: true,
            suggestions: [],
            renew: true
        };
        dispatch(Actions.openEditCommandeDialog(data));
    }
    return (
        <div className="p-24">
            <Helmet>
                <title>Mon abonnement | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FuseAnimate animation="transition.slideUpIn" delay={300}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                        <div className="flex items-center justify-between">
                            <Typography variant="h6" className="uppercase">
                                Mon Pack
                            </Typography>
                            <Tooltip title="Modifier votre pack" >
                                <Link to="/billing/pack" className="">
                                    <Icon className="text-orange">edit</Icon>
                                </Link>
                            </Tooltip>
                        </div>
                        <Divider />
                        <div className="mt-16">

                            {
                                abonnement ?
                                    (
                                        <table className="table-auto">

                                            <tbody>
                                                <tr>
                                                    <td className=" px-4 py-2 font-bold">Pack</td>
                                                    <td className=" px-4 py-2">
                                                        {abonnement.offre && abonnement.offre.name}
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray-100">
                                                    <td className=" px-4 py-2 font-bold">Nbr. Activités</td>
                                                    <td className=" px-4 py-2">
                                                        {abonnement.offre && abonnement.offre.nbActivite + " Activités"}
                                                    </td>
                                                </tr>
                                                <tr className="bg-gray-100">
                                                    <td className=" px-4 py-2 font-bold">Activités</td>
                                                    <td className=" px-4 py-2">
                                                        {abonnement.sousSecteurs && _.join(_.map(abonnement.sousSecteurs, 'name'), ', ')}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className=" px-4 py-2 font-bold">Date de début</td>
                                                    <td className=" px-4 py-2"> {abonnement.datePeiment && moment(abonnement.datePeiment).format("YYYY-MM-DD HH:mm")}</td>
                                                </tr>
                                                <tr>
                                                    <td className=" px-4 py-2 font-bold">Date de renouvellement</td>
                                                    <td className=" px-4 py-2"> {abonnement.expired && moment(abonnement.expired).format("YYYY-MM-DD HH:mm")}</td>
                                                </tr>
                                                <tr>
                                                    <td className=" px-4 py-2 font-bold">Durée</td>
                                                    <td className=" px-4 py-2"> {abonnement.duree && abonnement.duree.name + ' mois'}</td>
                                                </tr>
                                                <tr>
                                                    <td className=" px-4 py-2 font-bold">Statut</td>
                                                    <td className=" px-4 py-2">
                                                        {
                                                            !enable &&
                                                            <Typography variant="caption" className="text-red">
                                                                Désactivé
                                                            </Typography>
                                                        }
                                                        {
                                                            expired &&
                                                            <>
                                                                <div
                                                                    className={clsx('flex items-center px-8 py-4 mr-8 mt-2 rounded rounded-md text-white bg-red')}>
                                                                    Expiré, {moment(abonnement.expired).fromNow()}
                                                                </div>
                                                                <Tooltip title="Renouveler" >
                                                                    <Button
                                                                        className="mt-6"
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="secondary"
                                                                        onClick={handleRenew}
                                                                    >
                                                                        Renouveler
                                                                </Button>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                        {
                                                            abonnee &&
                                                            <>

                                                                <div
                                                                    className={clsx('flex items-center px-8 py-4 mr-8 mt-2 rounded rounded-md text-white', days > 30 ? "bg-green" : ((days > 15 && days <= 30) ? "bg-orange" : "bg-red"))}>
                                                                    <Icon className="text-20 mr-4">check_circle_outline</Icon> <strong>Actif</strong> <span className="hidden sm:flex">, vous avez {days} jour(s) restant(s) !</span>
                                                                </div>
                                                                {
                                                                    days < 30 &&
                                                                    <Tooltip title="Renouveler" >
                                                                        <Button
                                                                            className="mt-6"
                                                                            size="small"
                                                                            variant="contained"
                                                                            color="secondary">
                                                                            Renouveler
                                                                    </Button>
                                                                    </Tooltip>
                                                                }
                                                            </>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )

                                    :
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Pack</td>
                                                <td className=" px-4 py-2">
                                                    Free
                                        </td>
                                            </tr>

                                        </tbody>
                                    </table>

                            }

                        </div>

                    </Grid>
                    {
                        commande?.loadingC ? 'Chargement...' :
                            commande?.data &&
                            <Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
                                <div className="flex items-center justify-between">
                                    <Typography variant="h6" className="uppercase">
                                        Dernière commande
                                    </Typography>
                                    <Tooltip title="Modifier votre pack" >
                                        <IconButton onClick={() => dispatch(Actions.openEditCommandeDialog(commande.data))}>
                                            <Icon className="text-orange">edit</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <Divider />
                                <div className="mt-16">

                                    <table className="table-auto">

                                        <tbody>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Référence</td>
                                                <td className=" px-4 py-2">
                                                    {commande.data.reference}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Pack</td>
                                                <td className=" px-4 py-2">
                                                    {commande.data.offre && commande.data.offre.name}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-100">
                                                <td className=" px-4 py-2 font-bold">Nbr. Activités</td>
                                                <td className=" px-4 py-2">
                                                    {commande.data.offre && commande.data.offre.nbActivite + " Activités"}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-100">
                                                <td className=" px-4 py-2 font-bold">Activités</td>
                                                <td className=" px-4 py-2">
                                                    {commande.data.sousSecteurs && _.join(_.map(commande.data.sousSecteurs, 'name'), ', ')}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Date de création</td>
                                                <td className=" px-4 py-2"> {commande.data.created && moment(commande.data.created).format("YYYY-MM-DD HH:mm")}</td>
                                            </tr>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Durée</td>
                                                <td className=" px-4 py-2"> {commande.data.duree && commande.data.duree.name + ' mois'}</td>
                                            </tr>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Statut</td>
                                                <td className=" px-4 py-2">
                                                    {
                                                        commande.data.statut === false
                                                            ?
                                                            <Chip className={classes.chipOrange} label="En attente" />
                                                            :
                                                            <Chip className={classes.chip2} label="Traitée" />
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className=" px-4 py-2 font-bold">Type</td>
                                                <td className=" px-4 py-2">
                                                    {
                                                        commande.data.type === false ?
                                                            <Chip className={classes.blue} label="Nouvelle" />
                                                            :
                                                            <Chip className={classes.chip2} label="Renouvellement" />
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </Grid>
                    }

                </Grid>
            </FuseAnimate>
        </div>
    );
}

export default MonAbonnement;
