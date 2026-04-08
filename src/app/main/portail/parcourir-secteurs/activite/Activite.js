import React, { useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  ListItem,
  Icon,
  Divider,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
import withReducer from "app/store/withReducer";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import HeaderActivite from "./HeaderActivite";
import { URL_SITE } from "@fuse/Constants";
import { Link } from "react-router-dom";
import ContentLoader from "react-content-loader";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    // minHeight      : '100%',
    position: "relative",
    flex: "1 0 auto",
    height: "auto",
    backgroundColor: theme.palette.background.default,
  },
  middle: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      theme.palette.primary.main +
      " 100%)",
    position: "relative",
    marginBottom: theme.spacing(4),
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,.3)",
  },
  inline: {
    display: "inline",
  },
  top5Header: {
    padding: 24,
    background: 'linear-gradient(to right, #1e3a8a, #1d4ed8)',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  top5Title: {
    fontWeight: 800,
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  top5Subtitle: {
    fontSize: 12,
    opacity: 0.8
  },
  top5Icon: {
    fontSize: 48,
    opacity: 0.2,
    position: 'absolute',
    right: -8,
    top: -8
  },
  top5Container: {
    borderRadius: 20,
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    marginTop: 16
  },
  grid: {
    marginBottom: "-16px",
    marginTop: "-16px",
    marginLeft: "auto",
    marginRight: "auto",
    "& > .MuiGrid-item": {
      padding: "16px",
    },
  },
}));

function Activite(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const activites = useSelector(
    ({ parcourirSecteurs }) => parcourirSecteurs.pActivite
  );
  const params = props.match.params;
  const { id, slug, secteur } = params;
  const targetId = id || slug;

  useEffect(() => {
    dispatch(Actions.getSousSecteur(targetId));
    dispatch(Actions.getPCategories(targetId));
  }, [dispatch, targetId]);

  useEffect(() => {
    dispatch(Actions.getTopFounrisseursActivites(targetId));
  }, [dispatch, targetId]);

  return (
    <div
      className={clsx(
        classes.root,
        props.innerScroll && classes.innerScroll,
        "min-h-md"
      )}
    >
      {activites.sousSecteur && (
        <Helmet>
          <title>
            {activites.sousSecteur.name + " | Les Achats Industriels"}
          </title>
          <meta
            name="description"
            content={activites.sousSecteur.name + " | Les Achats Industriels"}
          />
          <meta property="og:title" content={activites.sousSecteur.name} />
          <meta
            property="og:description"
            content={activites.sousSecteur.name + " | Les Achats Industriels"}
          />
        </Helmet>
      )}
      <div
        className={clsx(
          classes.middle,
          "mb-0 relative overflow-hidden flex flex-col flex-shrink-0 "
        )}
      >
        <Grid
          container
          className=" max-w-2xl mx-auto py-8  sm:px-16 items-center z-9999"
        >
          <Grid item sm={12} xs={12}>
            <HeaderActivite {...props} />
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        className={clsx(classes.grid, " max-w-2xl mx-auto py-8  sm:px-16 ")}
      >
        <Grid item sm={8} xs={12}>
          <Paper
            variant="outlined"
            className={clsx(classes.paper, "p-0 my-16")}
          >
            <div className="p-16 pl-32">
              {activites.sousSecteur && activites.sousSecteur.secteur && (
                <Button
                  component={Link}
                  size="small"
                  to={`/annuaire-entreprises/${activites.sousSecteur.secteur.id}-${activites.sousSecteur.secteur.slug}`}
                  color="primary"
                  variant="contained"
                >
                  <Icon className="mr-4 arrow-icon">keyboard_arrow_left</Icon>
                  <span>{activites.sousSecteur.secteur.name}</span>
                </Button>
              )}
            </div>
            <Divider />
            <div className={clsx("p-32 ")}>
              <Typography variant="h6">
                Sélectionnez un produit dans&ensp;
                <span className="font-bold uppercase">
                  {activites.sousSecteur && activites.sousSecteur.name}
                </span>
              </Typography>
              <Grid container spacing={4} className="">
                {activites.loading ? (
                  <React.Fragment>
                    <Grid item sm={6} xs={12}>
                      <ContentLoader
                        viewBox="0 0 400 150"
                        height={130}
                        width={400}
                      >
                        <circle cx="10" cy="20" r="8" />
                        <rect
                          x="25"
                          y="15"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="50" r="8" />
                        <rect
                          x="25"
                          y="45"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="80" r="8" />
                        <rect
                          x="25"
                          y="75"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="110" r="8" />
                        <rect
                          x="25"
                          y="105"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                      </ContentLoader>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <ContentLoader
                        viewBox="0 0 400 150"
                        height={130}
                        width={400}
                      >
                        <circle cx="10" cy="20" r="8" />
                        <rect
                          x="25"
                          y="15"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="50" r="8" />
                        <rect
                          x="25"
                          y="45"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="80" r="8" />
                        <rect
                          x="25"
                          y="75"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                        <circle cx="10" cy="110" r="8" />
                        <rect
                          x="25"
                          y="105"
                          rx="5"
                          ry="5"
                          width="220"
                          height="10"
                        />
                      </ContentLoader>
                    </Grid>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Grid item sm={6} xs={12}>
                      <List dense={true}>
                        {activites.data &&
                          activites.data.map(
                            (categorie, i) =>
                              (i + 1) % 2 !== 0 && (
                                <React.Fragment key={i}>
                                  <ListItem
                                    button
                                    component="a"
                                    href={`/vente-produits/${secteur}/${slug}/${categorie.slug}`}
                                  >
                                    <ListItemText
                                      disableTypography
                                      primary={
                                        <Typography
                                          type="body2"
                                          style={{ fontSize: 12 }}
                                        >
                                          {categorie.name +
                                            " (" +
                                            categorie.count +
                                            ")"}
                                        </Typography>
                                      }
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton edge="end" aria-label="more">
                                        <Icon className="text-16 arrow-icon">
                                          chevron_right
                                        </Icon>
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                  <Divider component="li" />
                                </React.Fragment>
                              )
                          )}
                      </List>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <List dense={true}>
                        {activites.data &&
                          activites.data.map(
                            (categorie, i) =>
                              (i + 1) % 2 === 0 && (
                                <React.Fragment key={i}>
                                  <ListItem
                                    button
                                    component="a"
                                    href={`/vente-produits/${secteur}/${slug}/${categorie.slug}`}
                                  >
                                    <ListItemText
                                      disableTypography
                                      primary={
                                        <Typography
                                          type="body2"
                                          style={{ fontSize: 12 }}
                                        >
                                          {categorie.name +
                                            " (" +
                                            categorie.count +
                                            ")"}
                                        </Typography>
                                      }
                                    />
                                    <ListItemSecondaryAction>
                                      <IconButton edge="end" aria-label="more">
                                        <Icon className="text-16 arrow-icon">
                                          chevron_right
                                        </Icon>
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  </ListItem>
                                  <Divider component="li" />
                                </React.Fragment>
                              )
                          )}
                      </List>
                    </Grid>
                  </React.Fragment>
                )}
              </Grid>

              <div className="bg-gray-300 text-center p-16 mt-16">
                <Typography variant="h6">
                  Et VOTRE entreprise, est-elle référencée dans ce secteur?
                </Typography>
                <Button
                  component={Link}
                  className="mt-8"
                  to="/register"
                  color="secondary"
                  variant="contained"
                >
                  <span>Inscrivez-vous mantenant</span>
                  <Icon className="ml-4 arrow-icon">keyboard_arrow_right</Icon>
                </Button>
              </div>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} className="sticky top-0 ">
          <Paper elevation={0} className={classes.top5Container}>
            <div className={classes.top5Header}>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <Typography className={classes.top5Title}>Top 5</Typography>
                  <Typography className={classes.top5Subtitle}>Entreprises à la une</Typography>
                </div>
                <Icon className={classes.top5Icon}>stars</Icon>
              </div>
            </div>

            {activites.loadingFournisseurs ? (
              <div className="p-24">
                <ContentLoader
                  speed={2}
                  width={300}
                  height={200}
                  viewBox="0 0 300 200"
                >
                  <rect x="0" y="10" rx="10" ry="10" width="300" height="40" />
                  <rect x="0" y="60" rx="10" ry="10" width="300" height="40" />
                  <rect x="0" y="110" rx="10" ry="10" width="300" height="40" />
                </ContentLoader>
              </div>
            ) : (
              <List className="p-0">
                {activites.fournisseurs && activites.fournisseurs.length > 0 ? (
                  activites.fournisseurs.map((fournisseur, index) => {
                    const rankColors = ['#fbbf24', '#94a3b8', '#d97706'];
                    const isPodium = index < 3;

                    return (
                      <React.Fragment key={index}>
                        <ListItem
                          button
                          component="a"
                          href={`/entreprise/${fournisseur.id}-${fournisseur.slug}`}
                          className="px-24 py-16 hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-16 relative">
                              <Avatar
                                className="w-48 h-48 border-2 border-white shadow-sm"
                                alt={fournisseur.societe}
                                src={fournisseur.avatar ? URL_SITE + "/images/avatar/" + fournisseur.avatar.url : null}
                              >
                                {fournisseur.societe[0]}
                              </Avatar>
                              <div
                                className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center text-10 font-900 text-white shadow-md"
                                style={{
                                  background: isPodium ? rankColors[index] : '#64748b',
                                  border: '2px solid white'
                                }}
                              >
                                {index + 1}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <Typography className="font-700 text-14 truncate text-blue-900">
                                {fournisseur.societe}
                              </Typography>
                              <Typography className="text-12 text-gray-500 flex items-center">
                                <Icon className="text-14 mr-4 text-gray-400">location_on</Icon>
                                {fournisseur.pays ? fournisseur.pays.name : 'International'}
                              </Typography>
                            </div>

                            <Icon className="text-16 text-gray-300 ml-8">chevron_right</Icon>
                          </div>
                        </ListItem>
                        {index < activites.fournisseurs.length - 1 && <Divider className="mx-24" />}
                      </React.Fragment>
                    );
                  })
                ) : (
                  <div className="p-32 text-center text-gray-400">
                    <Icon className="text-48 mb-8 opacity-20">business</Icon>
                    <Typography>Aucune entreprise disponible</Typography>
                  </div>
                )}
              </List>
            )}
            <div className="p-16 bg-gray-50 text-center border-t-1 border-gray-100">
              <Button
                component={Link}
                to={`/entreprises?categories.sousSecteurs.id=${id}`}
                className="text-12 font-700 text-blue-700"
              >
                Voir tout le secteur
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withReducer("parcourirSecteurs", reducer)(Activite);
