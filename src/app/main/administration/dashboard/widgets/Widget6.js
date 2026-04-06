import React, { useEffect, useState } from "react";
import { Card, IconButton, Typography, CircularProgress, Collapse, makeStyles, Box, Icon } from "@material-ui/core";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  tableWrapper: {
    padding: theme.spacing(0, 2, 2, 2),
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    "& th": {
      textAlign: 'left',
      padding: theme.spacing(1.5, 1),
      fontSize: "0.75rem",
      fontWeight: 700,
      color: "#9ca3af",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      borderBottom: "1px solid #f3f4f6",
    },
    "& td": {
      padding: theme.spacing(2, 1),
      fontSize: "0.875rem",
      color: "#374151",
      borderBottom: "1px solid #f9fafb",
    }
  },
  socName: {
    fontWeight: 600,
    color: "#111827",
  },
  stats: {
    textAlign: 'right',
    fontWeight: 700,
    color: "#2563eb",
  }
}));

function Widget6(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const widget6 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget6);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    dispatch(Actions.getWidget6());
    return () => dispatch(Actions.cleanUpWidget6());
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography className={classes.title}>Top 10 Exportateurs</Typography>
        <IconButton
          className={clsx(classes.expand, expanded && classes.expandOpen)}
          onClick={() => setExpanded(!expanded)}
          size="small"
        >
          <ExpandMoreIcon />
        </IconButton>
      </div>

      {widget6.loading && (
        <Box p={4} display="flex" justifyContent="center"><CircularProgress size={24} /></Box>
      )}

      {widget6.data && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className={classes.tableWrapper}>
            <table className={classes.table}>
              <thead>
                <tr>
                  <th>Fournisseur</th>
                  <th style={{ textAlign: 'right' }}>Vues</th>
                  <th style={{ textAlign: 'right' }}>Tél</th>
                </tr>
              </thead>
              <tbody>
                {widget6.data.map((row, index) => (
                  <tr key={index}>
                    <td className={classes.socName}>{row.societe}</td>
                    <td className={classes.stats}>{row.visite}</td>
                    <td className={classes.stats} style={{ color: '#6b7280' }}>{row.phone_vu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Collapse>
      )}
    </div>
  );
}

export default React.memo(Widget6);
