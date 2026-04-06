import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { FuseAnimateGroup, FuseAnimate } from "@fuse";
import { URL_SITE } from "@fuse/Constants";
import _ from "@lodash";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { Icon, IconButton, Select, Button, Tooltip, Chip } from "@material-ui/core";
import * as Actions from "../store/actions";

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
  card: {
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
      '& $logoScale': {
        transform: 'scale(1.1)'
      }
    }
  },
  imageWrapper: {
    position: 'relative',
    paddingTop: '75%', // 4:3 ratio for supplier cards
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '2px 10px',
    borderRadius: 30,
    fontSize: '0.65rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    textAlign: 'center'
  },
  title: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#1e293b',
    textDecoration: 'none',
    marginBottom: 8,
    lineHeight: 1.3,
    transition: 'color 0.2s',
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  location: {
    fontSize: '0.75rem',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: 16
  },
  categoryWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    justifyContent: 'center',
    marginBottom: 20
  },
  catChip: {
    fontSize: '0.65rem',
    height: 20,
    backgroundColor: '#f8fafc',
    color: '#64748b',
    border: '0',
    fontWeight: 600
  },
  actionBtn: {
    marginTop: 'auto',
    borderRadius: 12,
    fontWeight: 700,
    textTransform: 'none',
    padding: '8px 0'
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

function FournisseurListItem(props) {
  const dispatch = useDispatch();
  const pageCount = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.pageCount);
  const fournisseurs = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.data);
  const loading = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.loading);
  const parametres = useSelector(({ fournisseursApp }) => fournisseursApp.fournisseurs.parametres);
  const { classes } = props;

  const scrollToTop = () => {
    const el = document.querySelector(".st");
    if (el) el.scrollTop = 0;
  };

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
        {fournisseurs && fournisseurs.map((fournisseur, index) => (
          <div className={classes.card} key={index}>
            <Link
              to={`/entreprise/${fournisseur.id}-${fournisseur.slug}`}
              className={classes.imageWrapper}
            >
              <div className={classes.badge}>Fournisseur</div>
              <img
                className={classes.logoScale}
                alt={fournisseur.societe}
                src={fournisseur.avatar ? URL_SITE + fournisseur.avatar.url : "assets/images/ecommerce/product-placeholder.jpg"}
                onError={(e) => { e.target.src = "assets/images/ecommerce/product-placeholder.jpg" }}
              />
            </Link>

            <div className={classes.content}>
              <Link
                className={classes.title}
                to={`/entreprise/${fournisseur.id}-${fournisseur.slug}`}
              >
                {fournisseur.societe}
              </Link>

              <div className={classes.location}>
                <Icon className="text-14">location_on</Icon>
                {(fournisseur.pays ? fournisseur.pays.name : "") + (fournisseur.ville ? `, ${fournisseur.ville.name}` : "")}
              </div>

              <div className={classes.categoryWrapper}>
                {fournisseur.categories && fournisseur.categories.slice(0, 2).map((item, idx) => (
                  <Chip key={idx} label={item.name} className={classes.catChip} />
                ))}
              </div>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                className={classes.actionBtn}
                onClick={() => dispatch(Actions.openNewContactFournisseurDialog(fournisseur.id))}
              >
                Contactez-nous
              </Button>
            </div>
          </div>
        ))}
      </div>

      {fournisseurs && fournisseurs.length > 0 && (
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

FournisseurListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FournisseurListItem);
