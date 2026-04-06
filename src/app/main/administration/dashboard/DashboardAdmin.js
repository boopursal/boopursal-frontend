import React, { useState } from "react";
import { FuseAnimate } from "@fuse";
import Widget1 from "./widgets/Widget1";
import Widget2 from "./widgets/Widget2";
import Widget3 from "./widgets/Widget3";
import ClientParVille from "./ClientParVille";
import RecentClient from "./RecentClient";
import Widget6 from "./widgets/Widget6";
import Widget7 from "./widgets/Widget7";
import Widget8 from "./widgets/Widget8";
import Widget9 from "./widgets/Widget9";
import WidgetNow from "./widgets/WidgetNow";
import ClientInscrit from "./ClientInscrit";
import withReducer from "app/store/withReducer";
import reducer from "./store/reducers";
import { makeStyles, Grid } from "@material-ui/core";
import moment from "moment";
import { Helmet } from "react-helmet";


const useStyles = makeStyles((theme) => ({
  root: {
    background: "var(--portal-bg)",
    minHeight: "100%",
    color: "var(--portal-text)",
    padding: '30px', // TailAdmin uses 30px padding for the main container
    fontFamily: '"Outfit", sans-serif'
  },
  card: {
    background: 'var(--portal-surface)',
    border: '1px solid var(--portal-border)',
    boxShadow: 'var(--portal-shadow)',
    borderRadius: '16px', // Standard TailAdmin 16px radius
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }
}));

function DashboardAdmin() {
  const classes = useStyles();
  const [currentRange, setCurrentRange] = useState(moment().format("Y"));

  return (
    <div className={classes.root}>
      <Helmet>
        <title>Dashboard | Boopursal (TailAdmin Style)</title>
      </Helmet>

      <FuseAnimate animation="transition.slideUpIn" duration={400}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}><div className={classes.card}><Widget3 currentRange={currentRange} /></div></Grid>
          <Grid item xs={12} sm={6} md={3}><div className={classes.card}><Widget1 currentRange={currentRange} /></div></Grid>
          <Grid item xs={12} sm={6} md={3}><div className={classes.card}><Widget2 currentRange={currentRange} /></div></Grid>
          <Grid item xs={12} sm={6} md={3}><div className={classes.card}><WidgetNow /></div></Grid>
          
          <Grid item xs={12} lg={8}><div className={classes.card}><Widget7 currentRange={currentRange} /></div></Grid>
          <Grid item xs={12} lg={4}><div className={classes.card}><Widget8 currentRange={currentRange} /></div></Grid>
          
          <Grid item xs={12}><div className={classes.card}><Widget9 currentRange={currentRange} /></div></Grid>
        </Grid>
      </FuseAnimate>
    </div>
  );
}

export default withReducer("dashboardAdmin", reducer)(DashboardAdmin);
