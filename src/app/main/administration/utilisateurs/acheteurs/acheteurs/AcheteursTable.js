import React, { useEffect, useState } from "react";
import { Icon, IconButton, Tooltip, Avatar, Typography } from "@material-ui/core";
import { URL_SITE, FuseUtils } from "@fuse";
import { withRouter } from "react-router-dom";
import * as Actions from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import moment from "moment";
import _ from "@lodash";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 48,
    height: 48,
    border: '2px solid #fff',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  },
  clientName: {
    fontWeight: 950,
    color: '#1e293b',
    fontSize: '0.95rem'
  },
  activeBadge: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 8,
    '&.active': { backgroundColor: '#22c55e' },
    '&.inactive': { backgroundColor: '#ef4444' }
  }
}));

function AcheteursTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const acheteurs = useSelector(({ acheteursAdminApp }) => acheteursAdminApp.acheteurs.data);
  const loading = useSelector(({ acheteursAdminApp }) => acheteursAdminApp.acheteurs.loading);
  const pageCount = useSelector(({ acheteursAdminApp }) => acheteursAdminApp.acheteurs.pageCount);
  const parametres = useSelector(({ acheteursAdminApp }) => acheteursAdminApp.acheteurs.parametres);
  const searchText = useSelector(({ acheteursAdminApp }) => acheteursAdminApp.acheteurs.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (acheteurs) {
      const arr = Object.keys(acheteurs).map((id) => acheteurs[id]);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [acheteurs, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
      title="Répertoire des Acheteurs Industriels"
      icon="supervised_user_circle"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setAcheteursSearchText(ev))}
      onPageChange={(pageIndex) => {
        parametres.page = pageIndex + 1;
        dispatch(Actions.setParametresData(parametres));
      }}
      onSortedChange={(newSorted) => {
        parametres.page = 1;
        parametres.filter.id = newSorted[0].id;
        parametres.filter.direction = newSorted[0].desc ? "desc" : "asc";
        dispatch(Actions.setParametresData(parametres));
      }}
      onRowClick={(row) => props.history.push("/users/acheteur/show/" + row.id)}
      columns={[
        {
          Header: "Identité",
          accessor: "avatar",
          Cell: (row) => (
            <Avatar
              className={classes.avatar}
              alt={row.original.firstName}
              src={row.original.avatar ? URL_SITE + row.original.avatar.url : "assets/images/avatars/profile.jpg"}
            />
          ),
          width: 80,
          sortable: false,
        },
        {
          Header: "Société & Contact",
          accessor: "societe",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className={classes.clientName}>{row.original.societe}</Typography>
              <Typography variant="caption" className="text-slate-400 font-700">{row.original.firstName} {row.original.lastName}</Typography>
            </div>
          ),
          minWidth: 220
        },
        {
          Header: "Email & Téléphone",
          accessor: "email",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className="text-13 font-700 text-slate-600">{row.original.email}</Typography>
              <Typography variant="caption" className="text-blue-500 font-800">{row.original.phone || 'Pas de numéro'}</Typography>
            </div>
          ),
          minWidth: 180
        },
        {
          Header: "Localisation",
          accessor: "ville.name",
          Cell: (row) => (
            <div className="flex items-center gap-4">
              <Icon className="text-14 text-slate-300">location_on</Icon>
              <Typography className="text-12 font-800 text-slate-400">{row.original.ville?.name || 'Inconnue'}</Typography>
            </div>
          ),
          width: 140
        },
        {
          Header: "État",
          accessor: "isactif",
          Cell: (row) => (
            <div className="flex items-center">
              <div className={clsx(classes.activeBadge, row.original.isactif ? 'active' : 'inactive')} />
              <Typography className="text-11 font-950 uppercase" style={{ color: row.original.isactif ? '#15803d' : '#b91c1c' }}>
                {row.original.isactif ? 'Actif' : 'Limité'}
              </Typography>
            </div>
          ),
          width: 130
        },
        {
          Header: "Profil",
          sortable: false,
          Cell: (row) => (
            <IconButton size="small" className="text-slate-300 hover:text-blue-500">
              <Icon className="text-18 font-900">person_search</Icon>
            </IconButton>
          ),
          width: 80
        }
      ]}
    />
  );
}

export default withRouter(AcheteursTable);
