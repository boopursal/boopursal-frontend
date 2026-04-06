import React, { useState } from "react";
import { Card, Tabs, Tab, Typography, Chip } from "@material-ui/core";
import Widget12 from "./widgets/Widget12";
import Widget13 from "./widgets/Widget13";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  chipFournisseur: {
    marginRight: theme.spacing(1),
    padding: 2,
    background: theme.palette.secondary.main,
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
    height: 20,
  },
  chipAcheteur: {
    marginRight: theme.spacing(1),
    padding: 2,
    background: theme.palette.primary.main,
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
    height: 20,
  },
}));
function ClientInscrit(props) {
  const classes = useStyles();
  const { currentRange } = props;
  const [tabValue, setTabValue] = useState(0);
  const [totalFournisseurs, setTotalFournisseurs] = useState(0);
  const [totalAcheteurs, setTotalAcheteurs] = useState(0);

  function handleChangeTab(event, tabValue) {
    setTabValue(tabValue);
    setTotalFournisseurs(0);
    setTotalAcheteurs(0);
  }

  function onChangeTotal(totalFournisseur, totalAcheteur) {
    setTotalFournisseurs(totalFournisseur);
    setTotalAcheteurs(totalAcheteur);
  }
  return (
    <Card className="w-full rounded-16 shadow-2 hover:shadow-4 transition-shadow duration-300 border-0 bg-white">
      <div className="p-16 pr-4 flex flex-row items-center justify-between">
        <Typography className="h3" color="textSecondary">
          Clients inscrits
        </Typography>
      </div>
      <div className="relative pl-16 pb-8 flex flex-row items-center justify-between">
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          classes={{ root: "w-ful" }}
        >
          <Tab className="normal-case" label={`En ${currentRange}`} />
          <Tab className="normal-case" label="Les dernières 10 ans" />
        </Tabs>
        <div>
          {totalFournisseurs ? (
            <Chip
              className={classes.chipFournisseur}
              label={`${totalFournisseurs} fournisseur(s)`}
            />
          ) : (
            ""
          )}
          {totalAcheteurs ? (
            <Chip
              className={classes.chipAcheteur}
              label={`${totalAcheteurs} acheteur(s)`}
            />
          ) : (
            ""
          )}
        </div>
      </div>

      {tabValue === 0 && (
        <Widget12
          currentRange={currentRange}
          handleChangeTotal={onChangeTotal}
        />
      )}
      {tabValue === 1 && <Widget13 handleChangeTotal={onChangeTotal} />}
    </Card>
  );
}

export default React.memo(ClientInscrit);
