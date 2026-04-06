import React from "react";
import { makeStyles } from "@material-ui/styles";
import TarifDetail from "./TarifDetail";
import HeaderTarif from "./HeaderTarif";
import clsx from "clsx";
import { Helmet } from "react-helmet";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    flex: "1 0 auto",
    height: "auto",
    backgroundColor: '#fff',
    fontFamily: 'Muli, Roboto, "Helvetica", Arial, sans-serif !important',
  },
  headerContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 100
  }
}));

function TarifsApp(props) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, "min-h-md")}>
      <Helmet>
        <title>Tarifs & Plans | Boopursal</title>
        <meta
          name="description"
          content="Découvrez les tarifs, abonnements et jetons pour fournisseurs et acheteurs sur Boopursal."
        />
      </Helmet>

      {/* Floating Back Button & Breadcrumbs */}
      <div className={classes.headerContainer}>
        <HeaderTarif {...props} />
      </div>

      <TarifDetail {...props} />
    </div>
  );
}

export default TarifsApp;
