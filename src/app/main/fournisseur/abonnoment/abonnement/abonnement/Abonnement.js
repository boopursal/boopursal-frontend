import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Button,
  Icon,
  Typography,
  LinearProgress,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tab,
  Tabs,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  FuseAnimate,
  FusePageCarded,
  LOCAL_CURRENCY,
  URL_SITE,
  LOCAL_TVA,
} from "@fuse";
import { Link } from "react-router-dom";
import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import { useForm } from "@fuse/hooks";
import clsx from "clsx";
import moment from "moment";
import Pdf from "react-to-pdf";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  divider: {
    backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  divider2: {
    backgroundColor: theme.palette.divider,
  },
  button: {
    margin: theme.spacing(1),
  },
  seller: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
    marginRight: -88,
    paddingRight: 66,
    width: 480,
  },
  chip: {
    marginLeft: theme.spacing(1),
    background: "#ef5350",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
  },
  chip2: {
    marginLeft: theme.spacing(1),
    background: "#4caf50",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
  },
  chipOrange: {
    marginLeft: theme.spacing(1),
    background: "#ff9800",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
  },
}));

function Abonnement(props) {
  const dispatch = useDispatch();
  const abonnement = useSelector(
    ({ abonnementFrsApp }) => abonnementFrsApp.abonnement
  );
  //const [sousSecteurs, setSousSecteurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);
  const [offre, setOffre] = useState(null);
  const [duree, setDuree] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const { form, setForm } = useForm(null);
  const classes = useStyles(props);
  const [prixht, setPrixht] = useState(0);
  const [tva, setTva] = useState(0);
  const [remise, setRemise] = useState(0);
  const [prixhtNet, setPrixhtNet] = useState(0);
  const [prixTTC, setPrixTTC] = useState(0);
  const ref = React.createRef();

  useEffect(() => {
    function updateAbonnementState() {
      const params = props.match.params;
      const { abonnementId } = params;
      dispatch(Actions.getAbonnement(abonnementId));
    }
    updateAbonnementState();
    return () => {
      dispatch(Actions.cleanUp());
    };
  }, [dispatch, props.match.params]);

  useEffect(() => {
    if (
      (abonnement.data && !form) ||
      (abonnement.data && form && abonnement.data.id !== form.id)
    ) {
      /*
                        if (abonnement.data.sousSecteurs) {
                            setSousSecteurs(abonnement.data.sousSecteurs.map(item => ({
                                value: item['@id'],
                                label: item.name
                            })));
                        }
            */
      if (abonnement.data.offre) {
        setOffre(abonnement.data.offre);
      }

      if (abonnement.data.fournisseur) {
        setFournisseur(abonnement.data.fournisseur);
      }

      if (abonnement.data.duree) {
        setDuree(abonnement.data.duree);
      }

      if (abonnement.data.offre && abonnement.data.duree) {
        if (
          abonnement.data.currency &&
          abonnement.data.currency.name !== LOCAL_CURRENCY
        ) {
          let ht = abonnement.data.offre.prixEur * abonnement.data.duree.name;
          setPrixht(ht);

          if (abonnement.data.duree.remise) {
            let remis = (ht * abonnement.data.duree.remise) / 100;
            let netHt = ht - remis;
            if (abonnement.data.remise && abonnement.data.remise > 0) {
              netHt = netHt - abonnement.data.remise;
            }
            // let tva = netHt * LOCAL_TVA;

            setRemise(remis);
            setPrixhtNet(netHt);
            setTva(0);
            //setPrixTTC(netHt + tva)
            setPrixTTC(netHt);
          } else {
            let netHt = ht;
            if (abonnement.data.remise && abonnement.data.remise > 0) {
              netHt = ht - abonnement.data.remise;
            }
            // let tva = netHt * LOCAL_TVA;
            setTva(0);
            setPrixhtNet(netHt);
            //setPrixTTC(netHt + tva)
            setPrixTTC(netHt);
          }
        } else {
          let ht = abonnement.data.offre.prixMad * abonnement.data.duree.name;
          setPrixht(ht);

          if (abonnement.data.duree.remise) {
            let remis = (ht * abonnement.data.duree.remise) / 100;
            let netHt = ht - remis;
            if (abonnement.data.remise && abonnement.data.remise > 0) {
              netHt = netHt - abonnement.data.remise;
            }
            let tva = netHt * LOCAL_TVA;
            setRemise(remis);
            setPrixhtNet(netHt);
            setTva(tva);
            setPrixTTC(netHt + tva);
          } else {
            let netHt = ht;
            if (abonnement.data.remise && abonnement.data.remise > 0) {
              netHt = ht - abonnement.data.remise;
            }
            let tva = netHt * LOCAL_TVA;
            setTva(tva);
            setPrixhtNet(netHt);
            setPrixTTC(netHt + tva);
          }
        }
      }
      setForm({ ...abonnement.data });
      if (abonnement.data.fournisseur) {
        let frs = {
          value: abonnement.data.fournisseur["@id"],
          label: abonnement.data.fournisseur.societe,
        };
        setForm(_.set({ ...abonnement.data }, "fournisseur", frs));
      }
    }
  }, [form, abonnement.data, setForm]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        !abonnement.loading
          ? form && (
              <div className="flex flex-1 w-full items-center justify-between">
                <div className="flex flex-col items-start max-w-full">
                  <FuseAnimate animation="transition.slideRightIn" delay={300}>
                    <Typography
                      className="normal-case flex items-center sm:mb-12"
                      component={Link}
                      role="button"
                      to="/abonnement"
                      color="inherit"
                    >
                      <Icon className="mr-4 text-20">arrow_back</Icon>
                      Retour
                    </Typography>
                  </FuseAnimate>

                  <div className="flex items-center max-w-full">
                    <div className="flex flex-col min-w-0">
                      <FuseAnimate
                        animation="transition.slideLeftIn"
                        delay={300}
                      >
                        <div className="text-16 sm:text-20 truncate">
                          {abonnement.data.reference
                            ? "Réf. " + abonnement.data.reference
                            : ""}
                        </div>
                      </FuseAnimate>
                    </div>
                  </div>
                </div>

                <div className="flex items-end max-w-full">
                  {tabValue === 1 ? (
                    <Pdf
                      targetRef={ref}
                      filename={form && "factrue_" + form.reference + ".pdf"}
                    >
                      {({ toPdf }) => (
                        <Button
                          variant="contained"
                          color="secondary"
                          className={classes.button}
                          onClick={toPdf}
                        >
                          Télécharger
                        </Button>
                      )}
                    </Pdf>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )
          : ""
      }
      contentToolbar={
        abonnement.loading || !form ? (
          <div className={classes.root}>
            <LinearProgress color="secondary" />
          </div>
        ) : (
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="Détail de l'abonnement" />
            <Tab className="h-64 normal-case" label="Facture" />
          </Tabs>
        )
      }
      content={
        !abonnement.loading
          ? form && (
              <div className="p-10  sm:p-24 max-w-2xl">
                {tabValue === 0 && (
                  <div>
                    <div className="flex justify-between">
                      <div>
                        <table className="mb-16">
                          <tbody>
                            <tr>
                              <td className="pr-16 pb-4">
                                <Typography
                                  className="font-light"
                                  variant="h6"
                                  color="textSecondary"
                                >
                                  ABONNEMENT
                                </Typography>
                              </td>
                              <td className="pb-4">
                                <Typography className="font-light" variant="h6">
                                  {form.reference}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-16">
                                <Typography color="textSecondary">
                                  DATE DE PAIMENT
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {moment(form.datePeiment).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-16">
                                <Typography color="textSecondary">
                                  DATE DE RENOUVELLEMENT
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {moment(form.expired).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="pr-16">
                                <Typography color="textSecondary">
                                  STATUT
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {form.statut === false ? (
                                    !form.expired ||
                                    form.expired === undefined ? (
                                      <span className="text-orange">
                                        En attente
                                      </span>
                                    ) : moment(form.expired) >= moment() ? (
                                      <span className="text-red">Annulée</span>
                                    ) : (
                                      <span className="text-red">
                                        En Expiré
                                      </span>
                                    )
                                  ) : moment(form.expired) >= moment() ? (
                                    <span className="text-green">En cours</span>
                                  ) : (
                                    <span className="text-red">Expiré</span>
                                  )}
                                </Typography>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div
                        className={clsx(
                          classes.seller,
                          "flex items-center p-16"
                        )}
                      >
                        {fournisseur && fournisseur.avatar ? (
                          <img
                            className="w-80 rounded"
                            src={URL_SITE + fournisseur.avatar.url}
                            alt="logo"
                          />
                        ) : (
                          <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded">
                            {fournisseur.firstName[0]}
                          </Avatar>
                        )}
                        <div
                          className={clsx(
                            classes.divider,
                            "w-px ml-8 mr-16 h-96 opacity-50"
                          )}
                        />

                        <div>
                          <Typography color="inherit">
                            {fournisseur && fournisseur.societe}
                          </Typography>

                          {fournisseur && (
                            <Typography color="inherit">
                              {fournisseur.adresse1}
                            </Typography>
                          )}
                          {fournisseur.pays && fournisseur.ville && (
                            <Typography color="inherit">
                              {fournisseur.ville.name +
                                ", " +
                                fournisseur.pays.name}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-64">
                      <Table className="simple">
                        <TableHead>
                          <TableRow>
                            <TableCell>Offre</TableCell>

                            <TableCell align="right">Prix</TableCell>
                            <TableCell align="right">Durée</TableCell>
                            <TableCell align="right">Total HT</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {offre && (
                            <TableRow>
                              <TableCell>
                                <Typography variant="subtitle1">
                                  {offre.name}
                                </Typography>
                              </TableCell>

                              <TableCell align="right">
                                {form &&
                                form.currency &&
                                form.currency.name !== LOCAL_CURRENCY
                                  ? parseFloat(offre.prixEur).toLocaleString(
                                      "fr", // leave undefined to use the browser's locale,
                                      // or use a string like 'en-US' to override it.
                                      { minimumFractionDigits: 2 }
                                    )
                                  : parseFloat(offre.prixMad).toLocaleString(
                                      "fr", // leave undefined to use the browser's locale,
                                      // or use a string like 'en-US' to override it.
                                      { minimumFractionDigits: 2 }
                                    )}
                              </TableCell>
                              <TableCell align="right">
                                {duree && duree.name + " mois"}
                              </TableCell>
                              <TableCell align="right">
                                {parseFloat(prixht).toLocaleString(
                                  "fr", // leave undefined to use the browser's locale,
                                  // or use a string like 'en-US' to override it.
                                  { minimumFractionDigits: 2 }
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>

                      <Table className="simple mt-32">
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography
                                className="font-medium"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                Total HT
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                className="font-medium"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {parseFloat(prixht).toLocaleString(
                                  "fr", // leave undefined to use the browser's locale,
                                  // or use a string like 'en-US' to override it.
                                  { minimumFractionDigits: 2 }
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {duree && duree.remise ? (
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  Remise ({duree.remise}%)
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {parseFloat(remise).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {form.remise ? (
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  Remise
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {parseFloat(form.remise).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : null}
                          {prixhtNet > 0 && prixhtNet !== prixht ? (
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  Montant NET HT
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {parseFloat(prixhtNet).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : null}
                          <TableRow>
                            <TableCell>
                              <Typography
                                className="font-medium"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                TVA (20%)
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                className="font-medium"
                                variant="subtitle1"
                                color="textSecondary"
                              >
                                {parseFloat(tva).toLocaleString(
                                  "fr", // leave undefined to use the browser's locale,
                                  // or use a string like 'en-US' to override it.
                                  { minimumFractionDigits: 2 }
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Typography
                                className="font-light"
                                variant="h4"
                                color="textSecondary"
                              >
                                Montant TTC
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                className="font-light"
                                variant="h4"
                                color="textSecondary"
                              >
                                {parseFloat(prixTTC).toLocaleString(
                                  "fr", // leave undefined to use the browser's locale,
                                  // or use a string like 'en-US' to override it.
                                  { minimumFractionDigits: 2 }
                                ) + " "}
                                {form.currency && form.currency.name}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                {tabValue === 1 && (
                  <Card
                    ref={ref}
                    className="mx-auto w-lg print:w-full shadow-none"
                  >
                    <CardContent className="p-32 print:p-0">
                      <div className="flex flex-row justify-between items-start">
                        <div className="flex flex-col">
                          <div className="flex items-center mb-80 print:mb-0">
                            <img
                              className="w-80"
                              src="/assets/images/logos/3fi.png"
                              alt="logo"
                            />
                            <div
                              className={clsx(
                                classes.divider2,
                                "mx-32 w-px h-128 print:mx-16"
                              )}
                            />

                            <div className="max-w-320">
                              <Typography color="textSecondary">
                                7E-Sky
                              </Typography>

                              <Typography color="textSecondary">
                                36, Rue Imam Al BOUKHARI, 20370 Maarif Extension
                                Casablanca - Maroc
                              </Typography>

                              <Typography color="textSecondary">
                                <span>Tél:</span>
                                +212-522.36.57.97
                              </Typography>
                              <Typography color="textSecondary">
                                <span>Email:</span>
                                3findustrie@gmail.com
                              </Typography>
                              <Typography color="textSecondary">
                                <span>Web:</span>
                                http://www.3findustrie.com
                              </Typography>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="flex justify-end items-center w-80 print:w-60">
                              <Typography
                                variant="h6"
                                className="font-light print:text-16"
                                color="textSecondary"
                              >
                                CLIENT
                              </Typography>
                            </div>

                            <div
                              className={clsx(
                                classes.divider2,
                                "mx-32 w-px h-128 print:mx-16"
                              )}
                            />

                            <div className="max-w-320">
                              <Typography color="textSecondary">
                                {fournisseur && fournisseur.societe}
                              </Typography>

                              {fournisseur && (
                                <Typography color="textSecondary">
                                  {fournisseur.adresse1}
                                </Typography>
                              )}
                              {fournisseur.pays && fournisseur.ville && (
                                <Typography color="textSecondary">
                                  {fournisseur.ville.name +
                                    ", " +
                                    fournisseur.pays.name}
                                </Typography>
                              )}
                              {fournisseur.ice && (
                                <Typography color="textSecondary">
                                  <span>ICE : </span>
                                  {fournisseur.ice}
                                </Typography>
                              )}
                              {fournisseur && (
                                <Typography color="textSecondary">
                                  <span>Tél: </span>
                                  {fournisseur.phone}
                                </Typography>
                              )}
                              {fournisseur.email && (
                                <Typography color="textSecondary">
                                  <span>Email: </span>
                                  {fournisseur.email}
                                </Typography>
                              )}
                              {fournisseur.website && (
                                <Typography color="textSecondary">
                                  <span>Web: </span>
                                  {fournisseur.website}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </div>

                        <table>
                          <tbody>
                            <tr>
                              <td className="pr-16 pb-32">
                                <Typography
                                  className="font-light"
                                  variant="h5"
                                  color="textSecondary"
                                >
                                  Facture N°
                                </Typography>
                              </td>
                              <td className="pb-32">
                                <Typography className="font-light" variant="h5">
                                  {form.reference}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="text-right pr-16">
                                <Typography color="textSecondary">
                                  Date de facturation
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {moment(form.datePeiment).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="text-right pr-16">
                                <Typography color="textSecondary">
                                  Date d'échéance
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {moment(form.expired).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </Typography>
                              </td>
                            </tr>

                            <tr>
                              <td className="text-right pr-16">
                                <Typography color="textSecondary">
                                  Montant TTC
                                </Typography>
                              </td>
                              <td>
                                <Typography>
                                  {parseFloat(prixTTC).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  ) + " "}
                                  {form.currency && form.currency.name}
                                </Typography>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-96 print:mt-0">
                        <Table className="simple">
                          <TableHead>
                            <TableRow>
                              <TableCell>Offre</TableCell>
                              <TableCell align="right">Prix</TableCell>

                              <TableCell align="right">Durée</TableCell>
                              <TableCell align="right">Total HT</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {offre && (
                              <TableRow>
                                <TableCell>
                                  <Typography variant="subtitle1">
                                    {offre.name}
                                  </Typography>
                                </TableCell>

                                <TableCell align="right">
                                  {form &&
                                  form.currency &&
                                  form.currency.name !== LOCAL_CURRENCY
                                    ? parseFloat(offre.prixEur).toLocaleString(
                                        "fr", // leave undefined to use the browser's locale,
                                        // or use a string like 'en-US' to override it.
                                        { minimumFractionDigits: 2 }
                                      )
                                    : parseFloat(offre.prixMad).toLocaleString(
                                        "fr", // leave undefined to use the browser's locale,
                                        // or use a string like 'en-US' to override it.
                                        { minimumFractionDigits: 2 }
                                      )}
                                </TableCell>
                                <TableCell align="right">
                                  {duree && duree.name + " mois"}
                                </TableCell>
                                <TableCell align="right">
                                  {parseFloat(prixht).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                        <Table className="simple">
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  Total HT
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {parseFloat(prixht).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            {duree && duree.remise ? (
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    Remise ({duree.remise}%)
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    {parseFloat(remise).toLocaleString(
                                      "fr", // leave undefined to use the browser's locale,
                                      // or use a string like 'en-US' to override it.
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : null}
                            {form.remise ? (
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    Remise
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    {parseFloat(form.remise).toLocaleString(
                                      "fr", // leave undefined to use the browser's locale,
                                      // or use a string like 'en-US' to override it.
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : null}
                            {prixhtNet > 0 && prixhtNet !== prixht ? (
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    Montant NET HT
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    className="font-medium"
                                    variant="subtitle1"
                                    color="textSecondary"
                                  >
                                    {parseFloat(prixhtNet).toLocaleString(
                                      "fr", // leave undefined to use the browser's locale,
                                      // or use a string like 'en-US' to override it.
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : null}
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  TVA (20%)
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-medium"
                                  variant="subtitle1"
                                  color="textSecondary"
                                >
                                  {parseFloat(tva).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  className="font-light"
                                  variant="h4"
                                  color="textSecondary"
                                >
                                  Montant TTC
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  className="font-light"
                                  variant="h4"
                                  color="textSecondary"
                                >
                                  {parseFloat(prixTTC).toLocaleString(
                                    "fr", // leave undefined to use the browser's locale,
                                    // or use a string like 'en-US' to override it.
                                    { minimumFractionDigits: 2 }
                                  ) + " "}
                                  {form.currency && form.currency.name}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )
          : ""
      }
      innerScroll
    />
  );
}

export default withReducer("abonnementFrsApp", reducer)(Abonnement);
