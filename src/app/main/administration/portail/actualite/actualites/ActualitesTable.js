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
    width: 60,
    height: 40,
    borderRadius: 6,
    border: '1px solid #E2E8F0',
    objectFit: 'cover',
    backgroundColor: '#F8FAF9'
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
  statusInactive: { backgroundColor: '#F1F5F9', color: '#475569' },
  dot: { width: 6, height: 6, borderRadius: '50%' }
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
      title="Actualités du Portail"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setSearchText(ev))}
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
          Header: "Image",
          accessor: "image",
          Cell: (row) => (
            <img
              className={classes.newsImage}
              alt="News"
              src={row.original.image ? URL_SITE + "/images/actualite/" + row.original.image.url : "/assets/images/defaults/news-placeholder.jpg"}
            />
          ),
          width: 90,
          sortable: false,
        },
        {
          Header: "Article",
          accessor: "titre",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{_.truncate(row.original.titre, { length: 60 })}</Typography>
              <Typography variant="caption" style={{ color: '#64748B' }}>
                Publié le {moment(row.original.created).format("DD/MM/YYYY")}
              </Typography>
            </div>
          ),
          minWidth: 300
        },
        {
          Header: "Statut",
          accessor: "isActive",
          Cell: (row) => (
            <div className={clsx(
              classes.statusBadge,
              row.original.isActive ? classes.statusActive : classes.statusInactive
            )}>
              <div className={classes.dot} style={{ backgroundColor: row.original.isActive ? '#10B981' : '#64748B' }} />
              {row.original.isActive ? 'Publié' : 'Brouillon'}
            </div>
          ),
          width: 130
        },
        {
          Header: "Actions",
          sortable: false,
          Cell: (row) => (
            <div className="flex items-center gap-8">
              <IconButton 
                  size="small" 
                  style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
              >
                <Icon className="text-18">edit</Icon>
              </IconButton>
              <IconButton 
                  size="small" 
                  style={{ color: '#D34053', backgroundColor: 'rgba(211, 64, 83, 0.05)' }}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    dispatch(Actions.removeActualite(row.original, parametres));
                  }}
              >
                <Icon className="text-18">delete</Icon>
              </IconButton>
            </div>
          ),
          width: 100
        }
      ]}
    />
  );
}

export default withRouter(ActualitesTable);
