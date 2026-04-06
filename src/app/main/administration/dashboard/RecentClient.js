import React, { useState } from "react";
import { Card, Tab, Tabs, Typography, makeStyles, Divider, Box } from "@material-ui/core";
import Widget10 from "./widgets/Widget10";
import Widget11 from "./widgets/Widget11";

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #f0f0f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing(3, 3, 0),
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: theme.spacing(2),
  },
  tabsWrapper: {
    padding: theme.spacing(0, 3),
    borderBottom: "1px solid #f3f4f6",
  },
  tabs: {
    minHeight: 48,
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: "3px 3px 0 0",
      background: "#2563eb",
    }
  },
  tab: {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.9375rem",
    minWidth: 100,
    color: "#6b7280",
    "&.Mui-selected": {
      color: "#2563eb",
    }
  },
  content: {
    flexGrow: 1,
    overflow: 'auto',
  }
}));

function RecentClient(props) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const [totalFournisseurs, setTotalFournisseurs] = useState(0);
  const [totalAcheteurs, setTotalAcheteurs] = useState(0);

  const handleChangeTab = (event, newValue) => setTabValue(newValue);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Dernières inscriptions</Typography>
      </div>

      <div className={classes.tabsWrapper}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          className={classes.tabs}
          variant="fullWidth"
        >
          <Tab
            className={classes.tab}
            label={<span>Fournisseurs <small style={{ opacity: 0.5 }}>{totalFournisseurs || ''}</small></span>}
          />
          <Tab
            className={classes.tab}
            label={<span>Acheteurs <small style={{ opacity: 0.5 }}>{totalAcheteurs || ''}</small></span>}
          />
        </Tabs>
      </div>

      <div className={classes.content}>
        {tabValue === 0 && (
          <Widget10 handleChangeTotal={setTotalFournisseurs} />
        )}
        {tabValue === 1 && (
          <Widget11 handleChangeTotal={setTotalAcheteurs} />
        )}
      </div>
    </div>
  );
}

export default React.memo(RecentClient);
