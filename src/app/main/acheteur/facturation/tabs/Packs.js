import React, { useEffect /*, useState*/ } from "react";
import {
  Button,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Icon,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { green, red } from "@material-ui/core/colors";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { LOCAL_CURRENCY } from "@fuse";

const useStyles = makeStyles((theme) => ({
  badge: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.getContrastText(theme.palette.error.main),
  },
  price: {
    backgroundColor: theme.palette.primary[600],
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ddd",
  },
  populaire: {
    "&:before": {
      content: "ddddddd",
    },
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  //  dialogPaper: { overflow: 'visible' }
}));

function Packs(props) {
  const classes = useStyles();
  const { currency } = props;
  const dispatch = useDispatch();
  const commande = useSelector(({ facturationApp }) => facturationApp.commande);

  useEffect(() => {
    dispatch(Actions.getOffres());
  }, [dispatch]);

  if (commande.loadingOffres) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <CircularProgress color="secondary" /> &ensp; Chargement ...
      </div>
    );
  }
  function handleSelectOffre(item) {
    dispatch(Actions.openNewCommandeDialog(item));
  }

  return (
    <div>
      <div className="p-24 ">
        <div className="w-full max-w-2xl mx-auto">
        <Grid container>
              <Grid item xs={6} sm={6} md={4} container>
                <Grid item xs={12} className="h-160"></Grid>
                <Grid item xs={12}>
                  <List className={classes.root}>
                    <ListItem classes={{ root: "h-60 sm:h-56 " }}>
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Publication des demandes de devis ( RFQ )"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Réception des devis"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Voir les profils des Fournisseurs"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56" }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Voir les catalogues des Fournisseurs"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Voir le nombre de Fournisseurs Intéressés * "
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Compte anonyme **"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Voir le nombre de diffusions de la ( RFQ )"
                      />
                    </ListItem>

                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Sous-compte Acheteur ***"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Blackliste"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Critère sélection fournisseur"
                      />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem
                      classes={{ root: "h-60 sm:h-56 " }}
                      alignItems="flex-start"
                    >
                      <ListItemText
                        classes={{
                          primary:
                            "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                        }}
                        primary="Critère sélection produit"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              <Grid item xs={6} sm={6} md={8} container spacing={1}>
                {
                  // FREE
                }
                <Grid item xs={12} sm={6} md={4} container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      background:
                        "linear-gradient(to top left, #feb2b2 10%, #feb2b2 30%, #e53e3e 60%, #e53e3e 60%)",
                      borderRadius: "20px 20px 0 0",
                      border: "1px solid #f56565",
                    }}
                    className="text-center h-160 "
                  >
                    <div className="text-black uppercase font-extrabold pt-16 text-24">
                      FREE
                    </div>
                    <div className="flex justify-center mt-12 text-black">
                      <span className=" uppercase text-10 sm:text-12 md:text-14 lg:text-15">
                        {currency === LOCAL_CURRENCY ? LOCAL_CURRENCY : "€"}
                      </span>
                      <span className=" uppercase font-extrabold text-32">
                        00<span className="text-10">,00</span>
                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <List className={classes.root}>
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          justify="center"
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                          
                        />
                      </ListItem>
                    </List>
                    <div className="p-16">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        onClick={() => {
                          const offre = commande.offres?.find(o => o.name === 'Pack Classic');
                          if (offre) handleSelectOffre(offre);
                        }}
                      >
                        S'abonner
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4} container>
                <Grid
                    item
                    xs={12}
                    style={{
                      background:
                        "linear-gradient(to top left, #90cdf4 10%, #90cdf4 30%, #3182ce 60%, #3182ce 60%)",
                      borderRadius: "20px 20px 0 0",
                      border: "1px solid #3182ce",
                    }}
                    className="text-center h-160 "
                  >
                    <div className="text-black uppercase font-extrabold pt-16 text-24">
                      ACHETEUR PRO
                    </div>
                    <div className="flex justify-center mt-12 text-black">
                      <span className=" uppercase text-10 sm:text-12 md:text-14 lg:text-15">
                        {currency === LOCAL_CURRENCY ? LOCAL_CURRENCY : "€"}
                      </span>
                      <span className=" uppercase font-extrabold text-32">
                        {currency === LOCAL_CURRENCY ? "375" : "38"}
                        <span className="text-10">
                          ,00 / mois
                          {currency === LOCAL_CURRENCY && " HT"}
                        </span>
                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <List className={classes.root}>
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          justify="center"
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: red[500] }}>close</Icon>
                          }
                          
                        />
                      </ListItem>
                    </List>
                    <div className="p-16">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        onClick={() => {
                          const offre = commande.offres?.find(o => o.name === 'Pack Business');
                          if (offre) handleSelectOffre(offre);
                        }}
                      >
                        S'abonner
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={4} container>
                  {/* GOLD */}
                <Grid
                    item
                    xs={12}
                    style={{
                      background:
                        "linear-gradient(to top left, #faf089 10%, #faf089 30%, #d69e2e 60%, #d69e2e 60%)",
                      borderRadius: "20px 20px 0 0",
                      border: "1px solid #d69e2e",
                    }}
                    className="text-center h-160 "
                  >
                    <div className="text-black uppercase font-extrabold pt-16 text-24">
                      ACHETEUR PRO PLUS
                    </div>
                    <div className="flex justify-center mt-12 text-black">
                      <span className=" uppercase text-10 sm:text-12 md:text-14 lg:text-15">
                        {currency === LOCAL_CURRENCY ? LOCAL_CURRENCY : "€"}
                      </span>
                      <span className=" uppercase font-extrabold text-32">
                        {currency === LOCAL_CURRENCY ? "500" : "50"}
                        <span className="text-10">
                          ,00 / mois
                          {currency === LOCAL_CURRENCY && " HT"}
                        </span>
                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <List className={classes.root}>
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          justify="center"
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary="illimité"
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15 ",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                          
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                         
                        />
                      </ListItem>
                      <Divider component="li" />
                      <ListItem classes={{ root: "h-60 sm:h-56 text-center" }}>
                        <ListItemText
                          classes={{
                            primary:
                              "font-bold text-10 sm:text-12 md:text-14 lg:text-15",
                          }}
                          primary={
                            <Icon style={{ color: green[500] }}>
                              check_circle
                            </Icon>
                          }
                          
                        />
                      </ListItem>
                    </List>
                    <div className="p-16">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="w-full"
                        onClick={() => {
                          const offre = commande.offres?.find(o => o.name === 'Pack Gold');
                          if (offre) handleSelectOffre(offre);
                        }}
                      >
                        S'abonner
                      </Button>
                    </div>
                  </Grid>
                </Grid>
                {
                  // FIN FREE
                }
              </Grid>
              
            </Grid>
          
        </div>
      </div>
    </div>
    
  );
}

export default Packs;
