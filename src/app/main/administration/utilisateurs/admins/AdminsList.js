import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar } from '@material-ui/core';
import { FuseUtils, URL_SITE } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';
import moment from 'moment';
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

function AdminsList(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const admins = useSelector(({ adminsApp }) => adminsApp.admins.entities);
  const user = useSelector(({ auth }) => auth.user);
  const searchText = useSelector(({ adminsApp }) => adminsApp.admins.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (admins) {
      const arr = Object.values(admins);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [admins, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
        title="Administrateurs Système"
        data={filteredData}
        searchText={searchText}
        onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
        onRowClick={(row) => dispatch(Actions.openEditAdminsDialog(row))}
        columns={[
            {
                Header: "Identité",
                accessor: "lastName",
                Cell: (row) => (
                    <div className="flex items-center gap-12">
                        <Avatar
                            className={classes.avatar}
                            alt={row.original.firstName}
                            src={row.original.avatar ? URL_SITE + row.original.avatar.url : "/assets/images/avatars/images.png"}
                        />
                        <div className="flex flex-col">
                            <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                                {row.original.firstName} {row.original.lastName}
                                {user.id === row.original.id && (
                                    <span className="ml-8 px-6 py-1 rounded-4 bg-blue-100 text-blue-700 text-10 font-700 uppercase">Moi</span>
                                )}
                            </Typography>
                            <Typography variant="caption" style={{ color: '#64748B' }}>
                                {row.original.email}
                            </Typography>
                        </div>
                    </div>
                ),
                minWidth: 240
            },
            {
                Header: "Contact",
                accessor: "phone",
                Cell: row => <Typography className="text-13" style={{ color: '#1C2434' }}>{row.original.phone || 'N/A'}</Typography>,
                width: 150
            },
            {
                Header: "Date Création",
                accessor: "created",
                Cell: row => <Typography className="text-13" style={{ color: '#64748B' }}>{moment(row.original.created).format("DD/MM/YYYY")}</Typography>,
                width: 130
            },
            {
                Header: "Statut",
                width: 130,
                Cell: (row) => (
                    <div 
                        className={clsx(
                            classes.statusBadge, 
                            row.original.isactif ? classes.statusActive : classes.statusInactive
                        )}
                        style={{ cursor: user.id !== row.original.id ? 'pointer' : 'default', opacity: user.id === row.original.id ? 0.7 : 1 }}
                        onClick={(ev) => {
                            ev.stopPropagation();
                            if (user.id !== row.original.id) {
                                dispatch(Actions.activeAccount(row.original, !row.original.isactif));
                            }
                        }}
                    >
                        <div className={classes.dot} style={{ backgroundColor: row.original.isactif ? '#10B981' : '#EF4444' }} />
                        {row.original.isactif ? 'Activé' : 'Bloqué'}
                    </div>
                ),
            },
            {
                Header: "Actions",
                width: 100,
                Cell: (row) => (
                    <div className="flex items-center gap-8">
                        <IconButton
                            size="small"
                            style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(Actions.openEditAdminsDialog(row.original));
                            }}
                        >
                            <Icon className="text-18">edit</Icon>
                        </IconButton>
                        <IconButton
                            size="small"
                            style={{ 
                                color: user.id !== row.original.id ? '#D34053' : '#CBD5E1', 
                                backgroundColor: user.id !== row.original.id ? 'rgba(211, 64, 83, 0.05)' : 'rgba(0,0,0,0.02)' 
                            }}
                            disabled={user.id === row.original.id}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(openDeleteDialog(row.original, dispatch));
                            }}
                        >
                            <Icon className="text-18">delete</Icon>
                        </IconButton>
                    </div>
                ),
            },
        ]}
    />
  );
}

const openDeleteDialog = (item, dispatch) => Actions.openDialog({
    children: (
      <React.Fragment>
        <DialogTitle>Suppression Admin</DialogTitle>
        <DialogContent>
          <DialogContentText>Voulez-vous vraiment supprimer cet administrateur ? Cette action est irréversible.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
          <Button 
            variant="contained" 
            style={{ backgroundColor: '#D34053', color: 'white' }}
            onClick={() => {
              dispatch(Actions.removeAdmin(item));
              dispatch(Actions.closeDialog());
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </React.Fragment>
    ),
});

export default AdminsList;
