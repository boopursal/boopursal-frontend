import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { FuseAnimateGroup } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import _ from "@lodash";
import { Link } from "react-router-dom";
import { Icon, IconButton, Select, Button, Tooltip } from "@material-ui/core";
import * as Actions from "../store/actions";
import clsx from 'clsx';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
    paddingTop: '24px'
  },
  productCard: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'white',
    border: '1px solid #f1f5f9',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    height: '100%',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)',
      borderColor: theme.palette.primary.light,
      '& $imageOverlay': {
        opacity: 1
      },
      '& $img': {
        transform: 'scale(1.05)'
      }
    }
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '100%', // Square ratio
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottom: '1px solid #f1f5f9'
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '24px',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 5
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#10b981', // Emerald green for a premium look
    color: 'white',
    padding: '4px 12px',
    borderRadius: 30,
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  },
  content: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: 800,
    color: '#1e293b',
    textDecoration: 'none',
    marginBottom: 12,
    lineHeight: 1.4,
    height: '2.8em',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    transition: 'color 0.2s',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  priceRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 'auto'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '-0.02em'
  },
  quoteBtn: {
    minWidth: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    color: '#475569',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      transform: 'rotate(-5deg) scale(1.1)'
    }
  },
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: '8px',
    borderRadius: 50,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    marginTop: 64,
    border: '1px solid #f1f5f9',
    width: 'fit-content',
    margin: '64px auto 0'
  },
  pageBtn: {
    minWidth: 44,
    height: 44,
    borderRadius: '50%',
    margin: '0 4px',
    fontSize: '0.875rem',
    fontWeight: 700,
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
    }
  }
});

function ProduitListItem(props) {
  const dispatch = useDispatch();
  const pageCount = useSelector(({ produitsApp }) => produitsApp.produits.pageCount);
  const produits = useSelector(({ produitsApp }) => produitsApp.produits.data);
  const loading = useSelector(({ produitsApp }) => produitsApp.produits.loading);
  const parametres = useSelector(({ produitsApp }) => produitsApp.produits.parametres);
  const { classes } = props;

  function scrollToTop() {
    const el = document.querySelector(".st");
    if (el) el.scrollTop = 0;
  }

  const handlePageChange = (newPage) => {
    dispatch(Actions.setParametresData({ ...parametres, page: newPage }));
    scrollToTop();
  };

  if (loading) {
    return (
      <div className={classes.gridContainer}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <div key={n} className="bg-white rounded-20 overflow-hidden border border-slate-100 shadow-sm animate-pulse h-450">
            <div className="bg-slate-50 h-280" />
            <div className="p-24 space-y-16">
              <div className="h-20 bg-slate-50 rounded-full w-3/4" />
              <div className="h-24 bg-slate-50 rounded-full w-full" />
              <div className="flex justify-between items-center pt-12">
                <div className="h-32 bg-slate-50 rounded-full w-100" />
                <div className="h-44 bg-slate-50 rounded-12 w-44" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.gridContainer}>
        {produits && produits.length > 0 ? (
          produits.map((produit, index) => (
            <div className={classes.productCard} key={index}>
              <Link
                to={`/detail-produit/${produit.sousSecteurs ? produit.sousSecteurs.slug : 'slug'}/${produit.categorie ? produit.categorie.slug : 'slug'}/${produit.id}-${produit.slug}`}
                className={classes.imageWrapper}
              >
                <div className={classes.badge}>Premium</div>
                <img
                  className={classes.img}
                  alt={produit.titre}
                  src={produit.featuredImageId ? URL_SITE + produit.featuredImageId.url : "assets/images/ecommerce/product-placeholder.jpg"}
                  onError={(e) => { e.target.src = "assets/images/ecommerce/product-placeholder.jpg" }}
                />
                <div className={classes.imageOverlay}>
                  <Icon className="text-white text-48 drop-shadow-lg">visibility</Icon>
                </div>
              </Link>

              <div className={classes.content}>
                <div className={classes.category}>
                  {produit.categorie ? produit.categorie.name : 'Produit'}
                </div>
                <Link
                  className={classes.title}
                  to={`/detail-produit/${produit.sousSecteurs ? produit.sousSecteurs.slug : 'slug'}/${produit.categorie ? produit.categorie.slug : 'slug'}/${produit.id}-${produit.slug}`}
                >
                  {produit.titre}
                </Link>

                <div className="flex items-center text-slate-400 text-xs font-medium mb-20 bg-slate-50 w-fit px-8 py-4 rounded-4">
                  REF: {produit.reference}
                </div>

                <div className={classes.priceRow}>
                  <div className={classes.price}>
                    {produit.pu
                      ? parseFloat(produit.pu).toLocaleString(undefined, { minimumFractionDigits: 0 }) + " " + (produit.currency ? produit.currency.name : "MAD")
                      : <span className="text-sm font-bold text-slate-400">PRIX SUR DEVIS</span>
                    }
                  </div>

                  {produit["@id"] && (
                    <Tooltip title="Demander un devis" placement="top">
                      <IconButton
                        className={classes.quoteBtn}
                        onClick={() => dispatch(Actions.openNewDemandeDevisDialog(produit["@id"]))}
                      >
                        <Icon>shopping_cart</Icon>
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {produits && produits.length > 0 && (
        <div className={classes.paginationContainer}>
          <IconButton
            disabled={parametres.page === 1}
            onClick={() => handlePageChange(parametres.page - 1)}
            className="hover:bg-slate-50"
          >
            <Icon>west</Icon>
          </IconButton>

          {[...Array(pageCount)].map((_, i) => {
            const pageNum = i + 1;
            const isEdge = pageNum === 1 || pageNum === pageCount;
            const isNear = Math.abs(pageNum - parametres.page) <= 1;

            if (isEdge || isNear) {
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={clsx(classes.pageBtn, parametres.page === pageNum && "active")}
                >
                  {pageNum}
                </Button>
              );
            }
            if (pageNum === 2 || pageNum === pageCount - 1) return <span key={pageNum} className="px-4 text-slate-300">...</span>;
            return null;
          })}

          <IconButton
            disabled={parametres.page === pageCount}
            onClick={() => handlePageChange(parametres.page + 1)}
            className="hover:bg-slate-50"
          >
            <Icon>east</Icon>
          </IconButton>
        </div>
      )}
    </div>
  );
}

ProduitListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProduitListItem);
