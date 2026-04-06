import React, { useEffect, useState } from 'react';
import { Icon, IconButton, Tooltip, Avatar, Typography } from '@material-ui/core';
import { URL_SITE, FuseUtils } from '@fuse';
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
    width: 52,
    height: 52,
    borderRadius: 12,
    border: '1px solid #f1f5f9',
    backgroundColor: '#fff'
  },
  productName: {
    fontWeight: 950,
    color: '#1e293b',
    fontSize: '0.925rem',
    letterSpacing: '-0.02em'
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 8,
    '&.active': { backgroundColor: '#22c55e' },
    '&.inactive': { backgroundColor: '#ef4444' }
  }
}));

function ProduitsTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  // FIXING REDUX SELECTOR: WAS produitsApp in Produits.js
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

  const fn = _.debounce((p) => dispatch(Actions.setParametresData(p)), 1000);

  return (
    <BoopursalTable
      title="Validation des Articles Industriels"
      icon="shopping_basket"
      data={filteredData}
      loading={loading}
      pageCount={pageCount}
      page={parametres.page - 1}
      searchText={searchText}
      onSearchChange={(ev) => dispatch(Actions.setProduitsSearchText(ev))}
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
      onRowClick={(row) => props.history.push("/gestion_produit/show/" + row.id)}
      columns={[
        {
          Header: "Aperçu",
          accessor: "logo",
          Cell: (row) => (
            <Avatar
              className={classes.productLogo}
              alt={row.original.name}
              src={row.original.logo ? URL_SITE + row.original.logo.url : "assets/images/defaults/product.png"}
              variant="rounded"
            />
          ),
          width: 70,
          sortable: false,
        },
        {
          Header: "Produit & Marque",
          accessor: "name",
          Cell: (row) => (
            <div className="flex flex-col">
              <Typography className={classes.productName}>{row.original.name}</Typography>
              <Typography variant="caption" className="text-slate-400 font-700 uppercase">{row.original.marque || 'Standard'}</Typography>
            </div>
          ),
          minWidth: 200
        },
        {
          Header: "Fournisseur Hub",
          accessor: "fournisseur.societe",
          Cell: (row) => <Typography className="text-13 font-800 text-blue-600">{row.original.fournisseur?.societe || 'Inconnu'}</Typography>,
          minWidth: 150
        },
        {
          Header: "État",
          accessor: "isactif",
          Cell: (row) => (
            <div className="flex items-center">
              <div className={clsx(classes.badge, row.original.isactif ? 'active' : 'inactive')} />
              <Typography className="text-11 font-900 uppercase tracking-widest" style={{ color: row.original.isactif ? '#15803d' : '#b91c1c' }}>
                {row.original.isactif ? 'En ligne' : 'Inactif'}
              </Typography>
            </div>
          ),
          width: 120
        },
        {
          Header: "Détails",
          sortable: false,
          Cell: (row) => (
            <div className="flex items-center gap-8">
              <Tooltip title="Inventaire">
                <IconButton size="small" className="text-slate-400 hover:text-blue-600">
                  <Icon className="text-18 font-900">inventory_2</Icon>
                </IconButton>
              </Tooltip>
            </div>
          ),
          width: 80
        }
      ]}
    />
  );
}

export default withRouter(ProduitsTable);
