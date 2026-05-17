import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Avatar, Tooltip } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { FuseUtils, URL_SITE } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import * as Actions from './store/actions';
import clsx from 'clsx';

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
    dot: { width: 6, height: 6, borderRadius: '50%' },
    cityBadge: {
        backgroundColor: 'rgba(60, 80, 224, 0.05)',
        color: '#3C50E0',
        fontWeight: 600,
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(60, 80, 224, 0.1)',
        minWidth: 40,
        textAlign: 'center'
    }
}));

function CommercialsList(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const commercials = useSelector(({ commercialsApp }) => commercialsApp.commercials.entities);
  const loadingComl = useSelector(({ commercialsApp }) => commercialsApp.commercials.loadingComl);
  const searchText = useSelector(({ commercialsApp }) => commercialsApp.commercials.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      maxWidth: 220,
      fontSize: 12,
      backgroundColor: '#1C2434',
      color: '#FFFFFF',
      borderRadius: '8px',
      padding: '8px 12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    },
  }))(Tooltip);

  useEffect(() => {
    if (commercials) {
      const arr = Object.values(commercials);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [commercials, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
        title="Équipe Commerciale"
        data={filteredData}
        loading={loadingComl}
        searchText={searchText}
        onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
        onRowClick={(row) => dispatch(Actions.openEditCommercialsDialog(row))}
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
                Cell: row => (
                    <div className="flex flex-col">
                        <Typography className="text-13" style={{ color: '#1C2434' }}>{row.original.phone || 'N/A'}</Typography>
                        <Typography variant="caption" style={{ color: '#3C50E0', fontWeight: 600 }}>
                            {row.original.parent1 ? `Resp: ${row.original.parent1.firstName}` : 'Sans Responsable'}
                        </Typography>
                    </div>
                ),
                width: 160
            },
            {
                Header: "Villes",
                width: 80,
                Cell: (row) => (
                    <HtmlTooltip
                        title={
                            <div className="flex flex-col gap-4">
                                {Object.keys(row.original.villes || {}).length === 0 ? (
                                    "Aucune ville assignée"
                                ) : (
                                    Object.values(row.original.villes).map((v, i) => (
                                        <div key={i} className="flex items-center gap-4 text-11 font-500">
                                            <div className="w-4 h-4 rounded-full bg-white/30" /> {v.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        }
                    >
                        <div className={classes.cityBadge}>
                            {Object.keys(row.original.villes || {}).length}
                        </div>
                    </HtmlTooltip>
                ),
            },
            {
                Header: "Statut",
                width: 130,
                Cell: (row) => (
                    <div 
                        className={clsx(classes.statusBadge, row.original.isactif ? classes.statusActive : classes.statusInactive)}
                        style={{ cursor: 'pointer' }}
                        onClick={(ev) => {
                            ev.stopPropagation();
                            dispatch(Actions.activeAccount(row.original, !row.original.isactif));
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
                                dispatch(Actions.openEditCommercialsDialog(row.original));
                            }}
                        >
                            <Icon className="text-18">edit</Icon>
                        </IconButton>
                        <IconButton
                            size="small"
                            style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
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
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Voulez-vous vraiment supprimer ce commercial ?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
          <Button 
            variant="contained" 
            style={{ backgroundColor: '#D34053', color: 'white' }}
            onClick={() => {
              dispatch(Actions.removeCommercial(item));
              dispatch(Actions.closeDialog());
            }}
          >
            Confirmer
          </Button>
        </DialogActions>
      </React.Fragment>
    ),
});

export default CommercialsList;
