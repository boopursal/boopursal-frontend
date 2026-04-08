import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Avatar, Typography, Chip } from '@material-ui/core';
import { FuseAnimate, URL_SITE, FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import moment from 'moment';
import _ from '@lodash';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  newsImage: {
    width: 64,
    height: 44,
    borderRadius: 8,
    border: '1px solid #f1f5f9',
    objectFit: 'cover'
  },
  newsTitle: {
    fontWeight: 900,
    color: '#1e293b',
    fontSize: '0.95rem',
    letterSpacing: '-0.01em'
  },
  statusBadge: {
    fontWeight: 900,
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    height: 22,
    borderRadius: 6,
    '&.active': { background: '#f0fdf4', color: '#166534', border: '1px solid #bcf0da' },
    '&.inactive': { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }
  }
}));

function ActualitesTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const actualites = useSelector(({ actualiteApp }) => actualiteApp.actualites.data);
  const loading = useSelector(({ actualiteApp }) => actualiteApp.actualites.loading);
  const pageCount = useSelector(({ actualiteApp }) => actualiteApp.actualites.pageCount);
  const parametres = useSelector(({ actualiteApp }) => actualiteApp.actualites.parametres);
  const searchText = useSelector(({ actualiteApp }) => actualiteApp.actualites.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (actualites) {
      const arr = Object.keys(actualites).map((id) => actualites[id]);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [actualites, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
      title="Gestion du Portail Actualités"
      icon="newspaper"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setActualitesSearchText(ev))}
      onPageChange={(pageIndex) => {
        parametres.page = pageIndex + 1;
        dispatch(Actions.setParametresData(parametres))
      }}
      onSortedChange={(newSorted) => {
        parametres.page = 1;
        parametres.filter.id = newSorted[0].id;
        parametres.filter.direction = newSorted[0].desc ? 'desc' : 'asc';
        dispatch(Actions.setParametresData(parametres))
      }}
      onRowClick={(row) => props.history.push('/portail/actualites/' + row.id)}
      columns={[
        {
          Header: "Illustration",
          accessor: "image",
          Cell: (row) => (
            <img
              className={classes.newsImage}
              alt="News"
              src={row.original.image ? URL_SITE + "/images/actualite/" + row.original.image.url : "assets/images/defaults/news-placeholder.jpg"}
            />
          ),
          width: 100,
          sortable: false,
        },
        {
          Header: "Titre de l'Actualité",
          accessor: "titre",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className={classes.newsTitle}>{_.truncate(row.original.titre, { length: 50 })}</Typography>
              <Typography variant="caption" className="text-slate-400 font-600">
                Publié le {moment(row.original.created).format("DD/MM/YYYY")}
              </Typography>
            </div>
          ),
          minWidth: 300
        },
        {
          Header: "Visibilité",
          accessor: "isActive",
          Cell: (row) => (
            <Chip
              className={clsx(classes.statusBadge, row.original.isActive ? 'active' : 'inactive')}
              label={row.original.isActive ? "Publié" : "Brouillon"}
            />
          ),
          width: 120
        },
        {
          Header: "Actions",
          sortable: false,
          Cell: (row) => (
            <div className="flex items-center gap-8">
              <Tooltip title="Éditer">
                <IconButton size="small" className="text-slate-400 hover:text-blue-600">
                  <Icon className="text-18">edit</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <IconButton size="small" className="text-slate-400 hover:text-red-600" onClick={(ev) => {
                  ev.stopPropagation();
                  dispatch(Actions.removeActualite(row.original, parametres));
                }}>
                  <Icon className="text-18">delete</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ),
          width: 100
        }
      ]}
    />
  );
}

export default withRouter(ActualitesTable);
