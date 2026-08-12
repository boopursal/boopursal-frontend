import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Avatar, Typography } from '@material-ui/core';
import { URL_SITE, FuseUtils, getImageUrl } from '@fuse';
import { withRouter } from 'react-router-dom';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import moment from 'moment';
import _ from '@lodash';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  productLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    backgroundColor: '#F8FAF9',
    padding: 2
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

function ProduitsTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const produits = useSelector(({ produitsApp }) => produitsApp.produits.data);
  const loading = useSelector(({ produitsApp }) => produitsApp.produits.loading);
  const pageCount = useSelector(({ produitsApp }) => produitsApp.produits.pageCount);
  const parametres = useSelector(({ produitsApp }) => produitsApp.produits.parametres);
  const searchText = useSelector(({ produitsApp }) => produitsApp.produits.searchText);

  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (produits) {
      const arr = Object.keys(produits).map((id) => produits[id]);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [produits, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
      title="Catalogue des Produits"
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
      onRowClick={(row) => props.history.push("/products/" + row.id)}
      columns={[
        {
          Header: "Aperçu",
          accessor: "featuredImageId",
          Cell: (row) => (
            <Avatar
              className={classes.productLogo}
              alt={row.original.reference || row.original.titre}
              src={row.original.featuredImageId ? getImageUrl(row.original.featuredImageId.url, '/images/produits') : "/assets/images/ecommerce/product-placeholder.jpg"}
              variant="rounded"
            />
          ),
          width: 80,
          sortable: false,
        },
        {
          Header: "Désignation & Réf",
          accessor: "titre",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>{row.original.titre}</Typography>
              <Typography variant="caption" style={{ color: '#64748B', fontWeight: 600 }}>Réf: {row.original.reference || 'N/A'}</Typography>
            </div>
          ),
          minWidth: 250
        },
        {
          Header: "Produit",
          accessor: "categorie.name",
          Cell: (row) => (
            <Typography variant="body2">{row.original.categorie?.name || 'SANS CATÉGORIE'}</Typography>
          ),
          minWidth: 150
        },
        {
          Header: "Fournisseur",
          accessor: "fournisseur.societe",
          Cell: (row) => (
            <div className="flex items-center gap-8 px-10 py-4 rounded-4 bg-blue-50/50 border border-blue-100/50">
               <Typography className="text-13 font-600" style={{ color: '#3C50E0' }}>{row.original.fournisseur?.societe || 'N/A'}</Typography>
            </div>
          ),
          minWidth: 180
        },
        {
          Header: "État",
          accessor: "isValid",
          Cell: (row) => (
            <div className={clsx(
              classes.statusBadge,
              row.original.isValid ? classes.statusActive : classes.statusInactive
            )}>
              <div className={classes.dot} style={{ backgroundColor: row.original.isValid ? '#10B981' : '#EF4444' }} />
              {row.original.isValid ? 'Publié' : 'Brouillon'}
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
            </div>
          ),
          width: 80
        }
      ]}
    />
  );
}

export default withRouter(ProduitsTable);
