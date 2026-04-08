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
  companyName: {
    fontWeight: 950,
    color: '#1e293b',
    fontSize: '0.95rem',
    letterSpacing: '-0.02em'
  },
  activeBadge: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: 8,
    '&.active': { backgroundColor: '#22c55e', boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.1)' },
    '&.inactive': { backgroundColor: '#ef4444', boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.1)' }
  }
}));

function FournisseursTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const fournisseurs = useSelector(({ fournisseursAdminApp }) => fournisseursAdminApp.fournisseurs.data);
  const loading = useSelector(({ fournisseursAdminApp }) => fournisseursAdminApp.fournisseurs.loading);
  const pageCount = useSelector(({ fournisseursAdminApp }) => fournisseursAdminApp.fournisseurs.pageCount);
  const parametres = useSelector(({ fournisseursAdminApp }) => fournisseursAdminApp.fournisseurs.parametres);
  const searchText = useSelector(({ fournisseursAdminApp }) => fournisseursAdminApp.fournisseurs.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (fournisseurs) {
      const arr = Object.keys(fournisseurs).map((id) => fournisseurs[id]);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [fournisseurs, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
      title="Annuaire des Fournisseurs Homologués"
      icon="business_center"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setFournisseursSearchText(ev))}
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
      onRowClick={(row) => props.history.push("/users/fournisseur/show/" + row.id)}
      columns={[
        {
          Header: "Identité",
          accessor: "avatar",
          Cell: (row) => (
            <Avatar
              className={classes.avatar}
              alt={row.original.firstName}
              src={row.original.avatar ? URL_SITE + "/images/avatar/" + row.original.avatar.url : "assets/images/avatars/profile.jpg"}
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
              <Typography className={classes.companyName}>{row.original.societe}</Typography>
              <Typography variant="caption" className="text-slate-400 font-700">{row.original.firstName} {row.original.lastName}</Typography>
            </div>
          ),
          minWidth: 220
        },
        {
          Header: "Ville / Région",
          accessor: "ville.name",
          Cell: (row) => (
            <div className="flex items-center gap-8">
              <Icon className="text-16 text-slate-400">explore</Icon>
              <Typography className="text-13 font-800 text-slate-600">{row.original.ville?.name || 'Hub Central'}</Typography>
            </div>
          ),
          width: 150
        },
        {
          Header: "État Compte",
          accessor: "isactif",
          Cell: (row) => (
            <div className="flex items-center">
              <div className={clsx(classes.activeBadge, row.original.isactif ? 'active' : 'inactive')} />
              <Typography className="text-11 font-950 uppercase" style={{ color: row.original.isactif ? '#15803d' : '#b91c1c' }}>
                {row.original.isactif ? 'Opérationnel' : 'Suspendu'}
              </Typography>
            </div>
          ),
          width: 140
        },
        {
          Header: "Étape Inscription",
          accessor: "step",
          Cell: (row) => (
            <Typography className="text-12 font-700 text-blue-500 italic">
              {row.original.step === 3 ? "Certifié Complet" : "En cours..."}
            </Typography>
          ),
          width: 150
        },
        {
          Header: "Profil",
          sortable: false,
          Cell: (row) => (
            <IconButton size="small" className="text-slate-300 hover:text-blue-500">
              <Icon className="text-18 font-900">open_in_new</Icon>
            </IconButton>
          ),
          width: 80
        }
      ]}
    />
  );
}

export default withRouter(FournisseursTable);
