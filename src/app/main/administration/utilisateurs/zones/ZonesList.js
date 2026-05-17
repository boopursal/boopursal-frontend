import React, { useEffect, useState } from "react";
import {
  Icon,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Avatar,
} from "@material-ui/core";
import { FuseUtils, URL_SITE } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import * as Actions from "./store/actions";
//import AdminsMultiSelectMenu from './AdminsMultiSelectMenu';
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";

import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
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
    dot: { width: 6, height: 6, borderRadius: '50%' },
    countBadge: {
        backgroundColor: 'rgba(60, 80, 224, 0.05)',
        color: '#3C50E0',
        fontWeight: 600,
        fontSize: '12px',
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(60, 80, 224, 0.1)',
        minWidth: 40,
        textAlign: 'center',
        cursor: 'help'
    }
}));

function ZonesList(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const zones = useSelector(({ zonesApp }) => zonesApp.zones.entities);
  const loadingZone = useSelector(({ zonesApp }) => zonesApp.zones.loadingZone);
  const searchText = useSelector(({ zonesApp }) => zonesApp.zones.searchText);

  const [filteredData, setFilteredData] = useState(null);

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      maxWidth: 240,
      fontSize: 12,
      backgroundColor: '#1C2434',
      color: '#FFFFFF',
      borderRadius: '8px',
      padding: '8px 12px',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    },
  }))(Tooltip);

  useEffect(() => {
    if (zones) {
      const arr = Object.values(zones);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [zones, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
        title="Administrateurs Commerciaux"
        data={filteredData}
        loading={loadingZone}
        searchText={searchText}
        onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
        onRowClick={(row) => dispatch(Actions.openEditZonesDialog(row))}
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
                        <Typography variant="caption" style={{ color: '#64748B' }}>
                            Inscrit le {moment(row.original.created).format('DD/MM/YYYY')}
                        </Typography>
                    </div>
                ),
                width: 160
            },
            {
                Header: "Pays Gérés",
                width: 100,
                Cell: (row) => (
                    <HtmlTooltip
                        title={
                            <div className="flex flex-col gap-4">
                                {Object.keys(row.original.pays || {}).length === 0 ? (
                                    "Aucun pays assigné"
                                ) : (
                                    Object.values(row.original.pays).map((p, i) => (
                                        <div key={i} className="flex items-center gap-6 text-11 font-500">
                                            <div className="w-4 h-4 rounded-full bg-white/30" /> {p.name}
                                        </div>
                                    ))
                                )}
                            </div>
                        }
                    >
                        <div className={classes.countBadge}>
                            {Object.keys(row.original.pays || {}).length} Pays
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
                        {row.original.isactif ? 'Opérationnel' : 'Suspendu'}
                    </div>
                ),
            },
            {
                Header: "Actions",
                width: 100,
                sortable: false,
                Cell: row => (
                    <div className="flex items-center gap-8">
                         <IconButton 
                            size="small" 
                            style={{ color: '#319795', backgroundColor: 'rgba(49, 151, 149, 0.05)' }}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(Actions.openEditZonesDialog(row.original));
                            }}
                        >
                            <Icon className="text-18">edit</Icon>
                        </IconButton>
                        <IconButton 
                            size="small" 
                            style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                            onClick={(ev) => {
                                ev.stopPropagation();
                                dispatch(Actions.openDialog({
                                    children: (
                                        <React.Fragment>
                                            <DialogTitle>Confirmation</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>Voulez-vous vraiment supprimer cet administrateur ? Cette action est définitive.</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => dispatch(Actions.closeDialog())}>Annuler</Button>
                                                <Button 
                                                    variant="contained" 
                                                    style={{ backgroundColor: '#D34053', color: 'white' }}
                                                    onClick={() => {
                                                        dispatch(Actions.removeZone(row.original));
                                                        dispatch(Actions.closeDialog());
                                                    }}
                                                >
                                                    Supprimer
                                                </Button>
                                            </DialogActions>
                                        </React.Fragment>
                                    )
                                }));
                            }}
                        >
                            <Icon className="text-18">delete</Icon>
                        </IconButton>
                    </div>
                ),
            }
        ]}
    />
  );
}

export default ZonesList;
