import React, { useEffect, useState } from "react";
import { Icon, IconButton, Tooltip, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
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
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid #FFFFFF',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  statusBadge: {
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '4px 12px',
    borderRadius: '9999px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 26,
  },
  statusActive: { backgroundColor: '#DEF7EC', color: '#03543F' },
  statusInactive: { backgroundColor: '#FDE2E2', color: '#9B1C1C' },
  dot: { width: 6, height: 6, borderRadius: '50%' }
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
  const [confirmDelete, setConfirmDelete] = useState(null); // id de l'acheteur à supprimer

  useEffect(() => {
    if (acheteurs) {
      const arr = Object.keys(acheteurs).map((id) => acheteurs[id]);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [acheteurs, searchText]);

  if (!filteredData) return null;

  return (
    <>
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer cet acheteur ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} color="default">Annuler</Button>
          <Button
            onClick={() => {
              dispatch(Actions.deleteAcheteur(confirmDelete, parametres));
              setConfirmDelete(null);
            }}
            style={{ color: '#EF4444' }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    <BoopursalTable
      title="Répertoire des Acheteurs"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
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
            <div className="flex items-center gap-12">
               <Avatar
                className={classes.avatar}
                alt={row.original.firstName}
                src={row.original.avatar ? URL_SITE + "/images/avatar/" + row.original.avatar.url : "/assets/images/avatars/profile.jpg"}
              />
              <div className="flex flex-col">
                <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.societe}</Typography>
                <Typography variant="caption" style={{ color: '#64748B' }}>{row.original.firstName} {row.original.lastName}</Typography>
              </div>
            </div>
          ),
          minWidth: 260,
          sortable: false,
        },
        {
          Header: "Coordonnées",
          accessor: "email",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>{row.original.email}</Typography>
              <Typography variant="caption" style={{ color: '#3C50E0', fontWeight: 600 }}>{row.original.phone || 'Pas de numéro'}</Typography>
            </div>
          ),
          minWidth: 200
        },
        {
          Header: "Ville",
          accessor: "ville.name",
          Cell: (row) => (
            <div className="flex items-center gap-6">
              <Icon className="text-16" style={{ color: '#64748B' }}>location_on</Icon>
              <Typography className="text-13" style={{ color: '#1C2434' }}>{row.original.ville?.name || 'Inconnue'}</Typography>
            </div>
          ),
          width: 150
        },
        {
          Header: "État",
          accessor: "isactif",
          Cell: (row) => (
            <div className={clsx(
              classes.statusBadge,
              row.original.isactif ? classes.statusActive : classes.statusInactive
            )}>
              <div className={classes.dot} style={{ backgroundColor: row.original.isactif ? '#10B981' : '#EF4444' }} />
              {row.original.isactif ? 'Actif' : 'Limité'}
            </div>
          ),
          width: 140
        },
        {
          Header: "Actions",
          sortable: false,
          Cell: (row) => (
            <div className="flex items-center gap-4">
              <Tooltip title="Voir le profil">
                <IconButton 
                    size="small" 
                    style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        props.history.push("/users/acheteur/show/" + row.original.id);
                    }}
                >
                  <Icon className="text-18">person_search</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer l'acheteur">
                <IconButton
                  size="small"
                  style={{ color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setConfirmDelete(row.original.id);
                  }}
                >
                  <Icon className="text-18">delete_outline</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ),
          width: 110
        }
      ]}
    />
    </>
  );
}

export default withRouter(AcheteursTable);
