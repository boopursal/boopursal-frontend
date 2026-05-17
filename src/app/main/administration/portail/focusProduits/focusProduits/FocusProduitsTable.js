import React, { useEffect, useState } from "react";
import { Icon, IconButton, Typography } from "@material-ui/core";
import { URL_SITE, FuseUtils } from "@fuse";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import BoopursalTable from '@fuse/components/BoopursalTable/BoopursalTable';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
     productImage: {
        width: 80,
        height: 54,
        borderRadius: 8,
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
    dot: { width: 6, height: 6, borderRadius: '50%' }
}));

function FocusProduitsTable(props) {
  const classes = useStyles();
  const focusProduits = useSelector(({ focusProduitsApp }) => focusProduitsApp.focusProduits.data);
  const searchText = useSelector(({ focusProduitsApp }) => focusProduitsApp.focusProduits.searchText);
  const loading = useSelector(({ focusProduitsApp }) => focusProduitsApp.focusProduits.loading);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    if (focusProduits) {
      const arr = Object.values(focusProduits);
      setFilteredData(searchText.length === 0 ? arr : FuseUtils.filterArrayByString(arr, searchText));
    }
  }, [focusProduits, searchText]);

  if (!filteredData) return null;

  return (
    <BoopursalTable
        title="Gestion des Emplacements (Top Deals)"
        data={filteredData}
        loading={loading}
        searchText={searchText}
        onSearchChange={(ev) => {/* Logic for search if needed */}}
        onRowClick={(row) => props.history.push("/admin/focus-produits/" + row.id)}
        columns={[
          {
            Header: "Emplacement",
            accessor: "id",
            Cell: (row) => (
                <div className="px-12 py-4 rounded-8 font-700 text-13" style={{ backgroundColor: '#F1F5F9', color: '#1C2434', width: 'fit-content' }}>
                    Slot #{row.original.id}
                </div>
            ),
            width: 140
          },
          {
            Header: "Image du produit assigné",
            accessor: "produit.image_produit",
            Cell: (row) => (
                <img
                  className={classes.productImage}
                  src={row.original.produit?.featuredImageId ? URL_SITE + row.original.produit.featuredImageId.url : "/assets/images/ecommerce/product-image-placeholder.png"}
                  alt=""
                />
            ),
            width: 130,
            sortable: false,
          },
          {
            Header: "Produit Actuel",
            accessor: "produit.titre",
            Cell: (row) => (
                <div className="flex flex-col">
                    <Typography className="font-600 text-14" style={{ color: '#1C2434' }}>
                        {row.original.produit ? row.original.produit.titre : 'Aucun produit assigné (Vide)'}
                    </Typography>
                    <Typography variant="caption" style={{ color: '#64748B' }}>
                        Réf: {row.original.produit?.reference || 'N/A'} • {row.original.produit?.categorie?.name || 'Sans Catégorie'}
                    </Typography>
                </div>
            ),
            minWidth: 250
          },
          {
            Header: "Fournisseur",
            accessor: "produit.fournisseur.societe",
            Cell: (row) => (
                <Typography className="text-13 font-500" style={{ color: '#1C2434' }}>
                    {row.original.produit?.fournisseur?.societe || 'N/A'}
                </Typography>
            ),
            width: 200
          },
          {
            Header: "Dernière modification",
            accessor: "updated",
            Cell: (row) => (
                <div className={clsx(classes.statusBadge, classes.statusActive)}>
                    <div className={classes.dot} style={{ backgroundColor: '#10B981' }} />
                    {moment(row.original.updated).fromNow()}
                </div>
            ),
            width: 180
          },
          {
            Header: "Actions",
            width: 80,
            Cell: (row) => (
              <div className="flex items-center">
                <IconButton 
                    size="small"
                    style={{ color: '#3C50E0', backgroundColor: 'rgba(60, 80, 224, 0.05)' }}
                    onClick={(ev) => {
                        ev.stopPropagation();
                        props.history.push("/admin/focus-produits/" + row.original.id);
                    }}
                >
                  <Icon className="text-18">edit</Icon>
                </IconButton>
              </div>
            ),
          },
        ]}
    />
  );
}

export default withRouter(FocusProduitsTable);
