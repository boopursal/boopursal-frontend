import React, { useState } from "react";
import { Card, Collapse, IconButton, Tab, Tabs, Typography, makeStyles, Box } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Widget4 from "./widgets/Widget4";
import Widget5 from "./widgets/Widget5";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #f0f0f0",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1f2937",
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  tabsWrapper: {
    padding: theme.spacing(0, 3),
    borderBottom: "1px solid #f3f4f6",
  },
  tabs: {
    minHeight: 48,
    "& .MuiTabs-indicator": {
      height: 3,
      background: "#2563eb",
    }
  },
  tab: {
    textTransform: "none",
    fontWeight: 600,
    minWidth: 120,
    fontSize: "0.9375rem",
    color: "#6b7280",
    "&.Mui-selected": {
      color: "#2563eb",
    }
  }
}));

function ClientParVille(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Clients par ville</Typography>
        <IconButton
          className={clsx(classes.expand, expanded && classes.expandOpen)}
          onClick={() => setExpanded(!expanded)}
          size="small"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div className={classes.tabsWrapper}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            className={classes.tabs}
          >
            <Tab className={classes.tab} label="Fournisseurs" />
            <Tab className={classes.tab} label="Acheteurs" />
          </Tabs>
        </div>

        <Box p={2}>
          {tabValue === 0 && <Widget4 />}
          {tabValue === 1 && <Widget5 />}
        </Box>
      </Collapse>
    </div>
  );
}

export default React.memo(ClientParVille);
