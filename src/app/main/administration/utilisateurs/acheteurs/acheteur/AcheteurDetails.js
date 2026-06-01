import React, { useEffect, useState } from "react";
import {
  Tab,
  Tabs,
  InputAdornment,
  Icon,
  Typography,
  Divider,
  Grid,
  Avatar,
  Chip,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate, FusePageCarded, URL_SITE, TextFieldFormsy } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import _ from "@lodash";
import Formsy from "formsy-react";

import LinearProgress from "@material-ui/core/LinearProgress";

import { Link } from "react-router-dom";
import moment from "moment";
import ReactTable from "react-table";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  chip: {
    marginLeft: theme.spacing(1),
    padding: 2,
    background: "#ef5350",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
    height: 20,
  },
  chip2: {
    marginLeft: theme.spacing(1),
    padding: 2,
    background: "#4caf50",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
    height: 20,
  },
  chipOrange: {
    marginLeft: theme.spacing(1),
    padding: 2,
    background: "#ff9800",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
    height: 20,
  },
}));

function AcheteurDetails(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const acheteur = useSelector(
    ({ acheteurDetailsApp }) => acheteurDetailsApp.acheteur
  );
  const [tabValue, setTabValue] = useState(0);
  const params = props.match.params;
  const { acheteurId } = params;

  useEffect(() => {
    function updateAcheteurState() {
      dispatch(Actions.getAcheteur(acheteurId));
      dispatch(Actions.getBlackListByAcheteur(acheteurId));
    }

    updateAcheteurState();
    return () => {
      dispatch(Actions.cleanUpAcheteur());
    };
  }, [dispatch, acheteurId]);

  useEffect(() => {
    if (acheteurId)
      dispatch(Actions.getDemandesByAcheteur(acheteurId, acheteur.parametres));
  }, [dispatch, acheteur.parametres, acheteurId]);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
  }

  //dispatch from function filter
  const run = (parametres) => dispatch(Actions.setParametresDetail(parametres));

  //call run function
  const fn = _.debounce(run, 1000);

  return (
    <FusePageCarded
      classes={{
        toolbar: "p-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        !acheteur.requestAcheteur ? (
          acheteur.data ? (
            <div className="flex flex-1 w-full items-center justify-between">
              <div className="flex flex-col items-start max-w-full">
                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                  <Typography
                    className="normal-case flex items-center sm:mb-12"
                    component={Link}
                    role="button"
                    to="/users/acheteurs"
                    color="inherit"
                  >
                    <Icon className="mr-4 text-20">arrow_back</Icon>
                    Retour
                  </Typography>
                </FuseAnimate>
                <div className="flex items-center max-w-full">
                  <FuseAnimate animation="transition.expandIn" delay={300}>
                    {acheteur.data.avatar ? (
                      <Avatar
                        className="w-32 sm:w-48 mr-8 sm:mr-16 rounded"
                        alt="user photo"
                        src={URL_SITE + acheteur.data.avatar.url}
                      />
                    ) : (
                      <Avatar className="w-32 sm:w-48 mr-8 sm:mr-16 rounded">
                        {(acheteur.data.firstName && acheteur.data.firstName[0]) || 'A'}
                      </Avatar>
                    )}
                  </FuseAnimate>
                  <div className="flex flex-col min-w-0">
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography className="text-16 sm:text-20 truncate">
                        {acheteur.data.firstName && acheteur.data.lastName
                          ? acheteur.data.firstName +
                            " " +
                            acheteur.data.lastName
                          : "NOM & Prénom"}
                      </Typography>
                    </FuseAnimate>
                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                      <Typography variant="caption">
                        {acheteur.data.societe
                          ? acheteur.data.societe
                          : "Société"}{" "}
                        {acheteur.data.email ? " | " + acheteur.data.email : ""}
                      </Typography>
                    </FuseAnimate>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 w-full items-center justify-between p-24">
              <div className="flex flex-col items-start">
                <Typography variant="h5" color="textSecondary">
                  Acheteur introuvable
                </Typography>
                <Typography
                  className="normal-case flex items-center mt-12 cursor-pointer"
                  component={Link}
                  to="/users/acheteurs"
                  color="secondary"
                >
                  <Icon className="mr-4 text-20">arrow_back</Icon>
                  Retour à la liste
                </Typography>
              </div>
            </div>
          )
        ) : (
          <div className={classes.root}>
            <LinearProgress color="secondary" />
          </div>
        )
      }
      contentToolbar={
        !acheteur.requestAcheteur ? (
          acheteur.data && (
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64" }}
            >
              <Tab className="h-64 normal-case" label="Infos société" />
              <Tab
                className="h-64 normal-case"
                label={
                  "Demandes d'achats" +
                  (acheteur.loadingDmd
                    ? "( chargement... )"
                    : acheteur.totalItems > 100
                    ? "( +99 )"
                    : "( " + acheteur.totalItems + " )")
                }
              />
              <Tab
                className="h-64 normal-case"
                label={
                  "Blacklistes " +
                  (acheteur.loadingBL
                    ? "( chargement... )"
                    : acheteur.totalItemsBl > 100
                    ? "( +99 )"
                    : "( " + acheteur.totalItemsBl + " )")
                }
              />
            </Tabs>
          )
        ) : (
          <div className={classes.root}>
            <LinearProgress color="secondary" />
          </div>
        )
      }
      content={
        !acheteur.requestAcheteur
          ? acheteur.data && (
              <div className=" sm:p-10 max-w-2xl">
                {tabValue === 0 && (
                  <Formsy className="flex flex-col">
                    <Grid container spacing={3} className="mb-5">
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            className=""
                            type="text"
                            name="fullname"
                            value={
                              `${acheteur.data.civilite || ''} ${acheteur.data.firstName || ''} ${acheteur.data.lastName || ''}`.trim()
                            }
                            label="Nom complet"
                            InputProps={{
                              readOnly: true,
                            }}
                            fullWidth
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            className=""
                            name="email"
                            value={acheteur.data.email}
                            label="Email"
                            fullWidth
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className="text-20" color="action">
                                    email
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextFieldFormsy
                          className=""
                          type="text"
                          name="phonep"
                          id="phonep"
                          value={acheteur.data.phone}
                          label="Téléphone"
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Icon className="text-20" color="action">
                                  local_phone
                                </Icon>
                              </InputAdornment>
                            ),
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Divider />
                    <Grid container spacing={3} className="mb-5">
                      <Grid item xs={12} sm={8}>
                        <div className="flex">
                          <TextFieldFormsy
                            className="mt-20"
                            label="Raison sociale"
                            id="societe"
                            name="societe"
                            value={acheteur.data.societe}
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            className="mt-20"
                            name="fix"
                            value={acheteur.data.fix}
                            label="Fixe"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className="text-20" color="action">
                                    local_phone
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <TextFieldFormsy
                          id="secteur"
                          className=""
                          name="secteur"
                          label="Secteur"
                          value={
                            acheteur.data.secteur
                              ? acheteur.data.secteur.name
                              : ""
                          }
                          fullWidth
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            id="website"
                            className=""
                            type="text"
                            name="website"
                            value={acheteur.data.website}
                            label="Site Web"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className="text-20" color="action">
                                    language
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <div className="flex">
                          {acheteur.data.ice ? (
                            <TextFieldFormsy
                              className=""
                              type="text"
                              name="ice"
                              id="ice"
                              value={acheteur.data.ice}
                              label="ICE"
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </Grid>
                    </Grid>
                    <Divider />

                    <Grid container spacing={3} className="mb-5">
                      <Grid item xs={12} sm={8}>
                        <div className="flex">
                          <TextFieldFormsy
                            className="mt-20"
                            type="text"
                            name="adresse1"
                            id="adresse1"
                            value={acheteur.data.adresse1}
                            label="Adresse 1"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className="text-20" color="action">
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextFieldFormsy
                          className="mt-20"
                          type="text"
                          name="pays"
                          id="pays"
                          value={
                            acheteur.data.pays ? acheteur.data.pays.name : ""
                          }
                          label="Pays"
                          InputProps={{
                            readOnly: true,
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            className=""
                            type="text"
                            name="adresse2"
                            value={acheteur.data.adresse2}
                            label="Adresse 2"
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Icon className="text-20" color="action">
                                    location_on
                                  </Icon>
                                </InputAdornment>
                              ),
                            }}
                            fullWidth
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <div className="flex">
                          <TextFieldFormsy
                            className=""
                            name="codepostal"
                            value={String(acheteur.data.codepostal)}
                            label="Code Postal"
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextFieldFormsy
                          className=""
                          type="text"
                          name="ville"
                          id="ville"
                          value={
                            acheteur.data.ville ? acheteur.data.ville.name : ""
                          }
                          label="Ville"
                          InputProps={{
                            readOnly: true,
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <Divider />

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <TextFieldFormsy
                          className="mb-5 mt-20  w-full"
                          type="text"
                          name="description"
                          value={acheteur.data.description}
                          label="Présentation"
                          multiline
                          rows="8"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Formsy>
                )}
                {tabValue === 1 && (
                  <ReactTable
                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                    getTheadProps={(state, rowInfo, column) => {
                      return {
                        className: "h-64",
                      };
                    }}
                    data={acheteur.demandes}
                    columns={[
                      {
                        Header: "Référence",
                        className: "font-bold justify-center",
                        filterable: true,
                        accessor: "reference",
                        Cell: (row) => (
                          <Tooltip title="Voir la demande">
                            <Link
                              target="_blank"
                              to={"/demandes_admin/" + row.original.id}
                              onClick={(ev) => ev.stopPropagation()}
                            >
                              {row.original.reference
                                ? "RFQ-" + row.original.reference
                                : "En attente"}
                            </Link>
                          </Tooltip>
                        ),
                        Filter: ({ filter, onChange }) => (
                          <TextField
                            onChange={(event) => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : ""}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  RFQ-
                                </InputAdornment>
                              ),
                            }}
                          />
                        ),
                      },

                      {
                        Header: "Titre",
                        accessor: "titre",
                        className: "justify-center",
                        filterable: true,
                        Cell: (row) => (
                          <div className="flex items-center">
                            {_.capitalize(
                              _.truncate(row.original.titre, {
                                length: 15,
                                separator: " ",
                              })
                            )}
                          </div>
                        ),
                      },
                      {
                        Header: "Date de création",
                        accessor: "created",
                        className: "justify-center",
                        filterable: true,
                        Cell: (row) =>
                          moment(row.original.created).format("DD/MM/YYYY"),
                        Filter: ({ filter, onChange }) => (
                          <TextField
                            onChange={(event) => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : ""}
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        ),
                      },
                      {
                        Header: "Échéance",
                        minWidth: 125,
                        className: "justify-center",
                        filterable: true,
                        accessor: "dateExpiration",
                        Cell: (row) => (
                          <div className="flex items-center">
                            {moment(row.original.dateExpiration).format(
                              "DD/MM/YYYY"
                            )}
                            {moment(row.original.dateExpiration) >= moment() ? (
                              <Chip
                                className={classes.chip2}
                                label={
                                  moment(row.original.dateExpiration).diff(
                                    moment(),
                                    "days"
                                  ) === 0
                                    ? moment(row.original.dateExpiration).diff(
                                        moment(),
                                        "hours"
                                      ) + " h"
                                    : moment(row.original.dateExpiration).diff(
                                        moment(),
                                        "days"
                                      ) + " j"
                                }
                              />
                            ) : (
                              <Chip
                                className={classes.chip}
                                label={
                                  moment(row.original.dateExpiration).diff(
                                    moment(),
                                    "days"
                                  ) === 0
                                    ? moment(row.original.dateExpiration).diff(
                                        moment(),
                                        "hours"
                                      ) + " h"
                                    : moment(row.original.dateExpiration).diff(
                                        moment(),
                                        "days"
                                      ) + " j"
                                }
                              />
                            )}
                          </div>
                        ),
                        Filter: ({ filter, onChange }) => (
                          <TextField
                            onChange={(event) => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : ""}
                            type="date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        ),
                      },
                      {
                        Header: "Statut",
                        accessor: "statut",
                        className: "justify-center",
                        filterable: true,
                        sortable: false,
                        Cell: (row) => (
                          <div className="flex items-center">
                            {row.original.statut === 3 ? (
                              <Chip className={classes.chip2} label="Adjugée" />
                            ) : moment(row.original.dateExpiration) >=
                              moment() ? (
                              row.original.statut === 0 ? (
                                <Chip
                                  className={classes.chipOrange}
                                  label="En attente"
                                />
                              ) : row.original.statut === 1 ? (
                                <Chip
                                  className={classes.chip2}
                                  label="En cours"
                                />
                              ) : (
                                <Chip
                                  className={classes.chip}
                                  label="Refusée"
                                />
                              )
                            ) : (
                              <Chip className={classes.chip} label="Expirée" />
                            )}
                          </div>
                        ),
                        Filter: ({ filter, onChange }) => (
                          <select
                            onChange={(event) => onChange(event.target.value)}
                            style={{ width: "100%" }}
                            value={filter ? filter.value : ""}
                          >
                            <option value="">Tous</option>
                            <option value="0">En attente</option>
                            <option value="1">En cours</option>
                            <option value="2">Refusée</option>
                            <option value="3">Adjugée</option>
                            <option value="4">Expirée</option>
                          </select>
                        ),
                      },
                    ]}
                    manual
                    loading={acheteur.loadingDmd}
                    pages={acheteur.pageCount}
                    defaultPageSize={10}
                    showPageSizeOptions={false}
                    onPageChange={(pageIndex) => {
                      acheteur.parametres.page = pageIndex + 1;
                      dispatch(Actions.setParametresData(acheteur.parametres));
                    }}
                    onSortedChange={(newSorted, column, shiftKey) => {
                      acheteur.parametres.page = 1;
                      acheteur.parametres.filter.id = newSorted[0].id;
                      acheteur.parametres.filter.direction = newSorted[0].desc
                        ? "desc"
                        : "asc";
                      dispatch(Actions.setParametresData(acheteur.parametres));
                    }}
                    onFilteredChange={(filtered) => {
                      acheteur.parametres.page = 1;
                      acheteur.parametres.search = filtered;
                      fn(acheteur.parametres);
                    }}
                    noDataText="Aucune demande trouvée"
                    loadingText="Chargement..."
                    ofText="sur"
                  />
                )}
                {tabValue === 2 && (
                  <ReactTable
                    className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                    getTheadProps={(state, rowInfo, column) => {
                      return {
                        className: "h-64 font-bold",
                      };
                    }}
                    data={acheteur.blacklistes}
                    columns={[
                      {
                        Header: "Fournisseur",
                        className: "font-bold justify-center",
                        filterable: true,
                        accessor: "fournisseur",
                        Cell: (row) => (
                          <Tooltip title="Détails du fournisseur">
                            <Link
                              target="_blank"
                              to={
                                "/users/fournisseur/show/" +
                                row.original.fournisseur.id
                              }
                              onClick={(ev) => ev.stopPropagation()}
                            >
                              {row.original.fournisseur.societe &&
                                row.original.fournisseur.societe}
                            </Link>
                          </Tooltip>
                        ),
                      },
                      {
                        Header: "Raison",
                        accessor: "raison",
                        filterable: true,
                        className: "justify-center",
                      },
                      {
                        Header: "Date de Blackliste",
                        className: "justify-center",
                        id: "created",
                        accessor: (d) =>
                          moment(d.created).format("DD/MM/YYYY HH:mm"),
                      },
                      {
                        Header: "Date de Déblackliste",
                        className: "justify-center",
                        id: "deblacklister",
                        accessor: (d) =>
                          d.deblacklister
                            ? moment(d.deblacklister).format("DD/MM/YYYY HH:mm")
                            : "",
                      },
                      {
                        className: "justify-center",
                        Header: "Etat",
                        accessor: "etat",
                        Cell: (row) =>
                          row.original.etat ? "Blacklisté" : "Retiré",
                      },
                    ]}
                    defaultPageSize={10}
                    loading={acheteur.loadingBL}
                    noDataText="Aucun fournisseur blacklisté"
                    ofText="sur"
                  />
                )}
              </div>
            )
          : ""
      }
      innerScroll
    />
  );
}

export default withReducer("acheteurDetailsApp", reducer)(AcheteurDetails);
