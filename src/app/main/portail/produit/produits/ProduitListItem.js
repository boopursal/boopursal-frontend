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

const stringToColor = (string) => {
  if (!string) return '#94a3b8';
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
};

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
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    height: '100%',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08), 0 0 0 2px rgba(255, 90, 90, 0.1)',
      '& $imageOverlay': {
        opacity: 1
      },
      '& $img': {
        transform: 'scale(1.08)'
      }
    }
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '100%', // Square ratio
    background: 'radial-gradient(circle, #ffffff 0%, #f8fafc 100%)',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(226, 232, 240, 0.6)'
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: 5
  },
  badge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald gradient
    color: 'white',
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: '0.75rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)'
  },
  content: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '20px',
    }
  },
  category: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 8
  },
  title: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: '#0f172a',
    textDecoration: 'none',
    marginBottom: 16,
    lineHeight: 1.4,
    height: '2.8em',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    transition: 'color 0.2s',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.05rem',
      marginBottom: 12,
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px dashed #e2e8f0'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: theme.palette.primary.main,
    letterSpacing: '-0.02em',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.35rem',
    }
  },
  quoteBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    color: '#475569',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: 'white',
      transform: 'translateY(-4px) rotate(-5deg)',
      boxShadow: '0 10px 20px -5px rgba(255, 90, 90, 0.4)'
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
    // Try the Fuse layout scroll container first
    const stEl = document.querySelector(".st");
    if (stEl) {
      stEl.scrollTo({ top: 0, behavior: "smooth" });
    }
    // Also scroll the window and body as fallback
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    document.body.scrollTo({ top: 0, behavior: "smooth" });
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
                {produit.featuredImageId ? (
                  <img
                    className={classes.img}
                    alt={produit.titre}
                    src={URL_SITE + "/images/produits/" + produit.featuredImageId.url}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div 
                    className={classes.img} 
                    style={{
                      backgroundColor: stringToColor(produit.titre),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '4rem',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}
                  >
                    {getInitials(produit.titre)}
                  </div>
                )}
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

                <div className="flex items-center text-slate-500 text-xs font-semibold mb-20 bg-slate-50 w-fit px-10 py-6 rounded-8 border border-slate-100">
                  <span className="text-slate-400 mr-4">REF:</span> {produit.reference || 'N/A'}
                </div>

                <div className={classes.priceRow}>
                  <div className={classes.price}>
                    {produit.pu && parseFloat(produit.pu) > 0
                      ? parseFloat(produit.pu).toLocaleString(undefined, { minimumFractionDigits: 0 }) + " " + (produit.currency ? (produit.currency.name || produit.currency) : "MAD")
                      : <span className="text-sm font-bold bg-slate-100 text-slate-600 px-12 py-6 rounded-full inline-block" style={{ fontSize: '0.85rem' }}>PRIX SUR DEVIS</span>
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
