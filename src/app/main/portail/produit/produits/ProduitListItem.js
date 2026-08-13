import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { FuseAnimateGroup } from "@fuse";
import { URL_SITE, getImageUrl } from "@fuse/Constants";
import _ from "@lodash";
import { Link } from "react-router-dom";
import { Icon, IconButton, Select, Button, Tooltip, Avatar, Chip } from "@material-ui/core";
import * as Actions from "../store/actions";
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getTranslatedField } from '../../../../../utils/translationHelper';

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '20px',
    paddingTop: '8px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px',
      paddingTop: '4px'
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr',
      gap: '10px'
    }
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'white',
    border: '1px solid #f1f5f9',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    height: '100%',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none'
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
      borderColor: 'transparent',
      '&::after': {
          opacity: 1
      },
      '& $logoScale, & $fallbackAvatar': {
        transform: 'scale(1.1)'
      },
      '& $title': {
        color: theme.palette.primary.main
      }
    }
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '60%',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    borderBottom: '1px solid #f1f5f9',
  },
  logoScale: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    padding: '30px',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  fallbackWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackAvatar: {
    width: 80,
    height: 80,
    fontSize: '2.5rem',
    fontWeight: 800,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '12px',
    }
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#1e293b',
    textDecoration: 'none',
    marginBottom: 12,
    lineHeight: 1.3,
    transition: 'color 0.2s',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.15rem',
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  location: {
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginBottom: 16,
    fontWeight: 800
  },
  categoryWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    justifyContent: 'center',
    marginBottom: 20
  },
  catChip: {
    fontSize: '0.95rem',
    height: 'auto',
    padding: '6px 12px',
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    color: '#475569',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    fontWeight: 700,
    borderRadius: 12,
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        borderColor: theme.palette.primary.main
    }
  },
  actionBtn: {
    marginTop: 'auto',
    borderRadius: 40,
    fontWeight: 700,
    fontSize: '1rem',
    textTransform: 'none',
    padding: '10px 0',
    letterSpacing: 0,
    boxShadow: 'none',
    '&:hover': {
        boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}66`
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
    marginTop: 48,
    border: '1px solid #f1f5f9',
    width: 'fit-content',
    margin: '48px auto 80px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: 96 // give space for the floating filter button on mobile
    }
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
  const { t, i18n } = useTranslation();

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
        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
          <div key={n} className="bg-white rounded-20 overflow-hidden border border-slate-100 animate-pulse h-350">
            <div className="bg-slate-50 h-160" />
            <div className="p-20 space-y-12 flex flex-col items-center">
              <div className="h-20 bg-slate-50 rounded-full w-3/4" />
              <div className="h-16 bg-slate-50 rounded-full w-1/2" />
              <div className="h-36 bg-slate-50 rounded-12 w-full mt-12" />
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
          produits.map((produit, index) => {
            const translatedTitre = getTranslatedField(produit, 'titre', i18n.language);
            return (
            <div className={classes.card} key={index}>
              <Link
                to={`/detail-produit/${produit.sousSecteurs ? produit.sousSecteurs.slug : 'slug'}/${produit.categorie ? produit.categorie.slug : 'slug'}/${produit.id}-${produit.slug}`}
                className={classes.imageWrapper}
              >
                {produit.featuredImageId ? (
                  <img
                    className={classes.logoScale}
                    alt={translatedTitre}
                    src={getImageUrl(produit.featuredImageId.url, '/images/produits/')}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className={classes.fallbackWrapper}>
                    <Avatar className={classes.fallbackAvatar}>
                      {getInitials(translatedTitre)}
                    </Avatar>
                  </div>
                )}
              </Link>

              <div className={classes.content}>
                <Link
                  className={classes.title}
                  to={`/detail-produit/${produit.sousSecteurs ? produit.sousSecteurs.slug : 'slug'}/${produit.categorie ? produit.categorie.slug : 'slug'}/${produit.id}-${produit.slug}`}
                >
                  {translatedTitre}
                </Link>



                <div className={classes.categoryWrapper}>
                  {produit.categorie && (
                    <Chip label={getTranslatedField(produit.categorie, 'name', i18n.language)} className={classes.catChip} />
                  )}
                  {produit.reference && (
                    <Chip label={`REF: ${produit.reference}`} className={classes.catChip} />
                  )}
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  className={classes.actionBtn}
                  onClick={(e) => {
                    if (produit["@id"]) dispatch(Actions.openNewDemandeDevisDialog(produit["@id"]));
                  }}
                >
                  {t('portail.ask_quote', 'Demander un devis')}
                </Button>
              </div>
            </div>
          );
          })
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
            const isVisible = pageNum === 1 || pageNum === pageCount || Math.abs(pageNum - parametres.page) <= 1;

            if (isVisible) {
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
