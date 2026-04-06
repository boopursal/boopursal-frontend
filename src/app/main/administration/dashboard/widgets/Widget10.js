import React, { useEffect } from "react";
import { CircularProgress, Tooltip, makeStyles, Icon } from "@material-ui/core";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    borderRadius: 12,
    transition: 'background 0.2s ease',
    '&:hover': {
      background: '#f9fafb',
    }
  },
  socName: {
    fontSize: "0.9375rem",
    fontWeight: 600,
    color: "#111827",
    textDecoration: 'none',
    '&:hover': {
      color: "#2563eb",
      textDecoration: 'underline',
    }
  },
  date: {
    fontSize: "0.8125rem",
    color: "#9ca3af",
    fontWeight: 500,
  }
}));

function Widget10(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const widget10 = useSelector(({ dashboardAdmin }) => dashboardAdmin.widget10);
  const { handleChangeTotal } = props;

  useEffect(() => {
    dispatch(Actions.getWidget10());
    return () => dispatch(Actions.cleanUpWidget10());
  }, [dispatch]);

  useEffect(() => {
    if (widget10.total) handleChangeTotal(widget10.total);
  }, [widget10.total, handleChangeTotal]);

  return (
    <div className={classes.root}>
      {widget10.loading && (
        <div className="flex p-32 justify-center"><CircularProgress size={24} /></div>
      )}
      {widget10.data && (
        <ul className={classes.list}>
          {widget10.data.map((row, index) => (
            <li key={index} className={classes.listItem}>
              <Tooltip title="Voir le profil fournisseur" placement="left">
                <Link to={"/users/fournisseur/show/" + row.id} className={classes.socName}>
                  {row.societe}
                </Link>
              </Tooltip>
              <span className={classes.date}>
                {moment(row.created).format("DD MMM · HH:mm")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default React.memo(Widget10);
