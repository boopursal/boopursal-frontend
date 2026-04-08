import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  CardContent,
  Typography,
  Icon,
  Avatar,
  Button,
  Chip,
  Divider,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimate } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import YouTube from "react-youtube";
import Produit from "../../index/Produit";
import * as Actions from "../store/actions";
import { Helmet } from "react-helmet";
import { InlineShareButtons } from "sharethis-reactjs";
import _ from "@lodash";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { URL_SITE } from "@fuse/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1280,
    margin: '0 auto',
    width: '100%',
    padding: '0 24px',
    marginTop: -100,
    position: 'relative',
    zIndex: 50,
    paddingBottom: 100
  },
  mainPaper: {
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 40px 100px -20px rgba(15, 23, 42, 0.15)',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    transition: 'all 0.5s ease'
  },
  leftCol: {
    padding: 48,
    flex: '1 1 50%',
    minWidth: 400,
    borderRight: '1px solid rgba(241, 245, 249, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    [theme.breakpoints.down('sm')]: {
        padding: 24,
        borderRight: 'none',
        borderBottom: '1px solid rgba(241, 245, 249, 0.5)'
    }
  },
  rightCol: {
    padding: 56,
    flex: '1 1 50%',
    minWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
        padding: 32
    }
  },
  imageWrapper: {
    width: '100%',
    height: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'zoom-in',
    overflow: 'hidden',
    borderRadius: 32,
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)',
    '&:hover img': {
        transform: 'scale(1.05)'
    }
  },
  mainImg: {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  thumblist: {
    display: 'flex',
    gap: 16,
    marginTop: 32,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  thumb: {
    width: 80,
    height: 80,
    borderRadius: 20,
    padding: 8,
    border: '2px solid transparent',
    backgroundColor: '#fff',
    cursor: 'pointer',
    objectFit: 'contain',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
    },
    '&.active': {
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(37, 99, 235, 0.2)'
    }
  },
  categoryLabel: {
    fontSize: '0.85rem',
    fontWeight: 900,
    color: '#2563eb',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    '&::before': {
        content: '""',
        width: 12,
        height: 12,
        borderRadius: 4,
        backgroundColor: '#f59e0b'
    }
  },
  productTitle: {
    fontSize: '2.75rem',
    fontWeight: 900,
    color: '#0f172a',
    lineHeight: 1.1,
    marginBottom: 24,
    letterSpacing: '-0.03em'
  },
  priceBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '16px 32px',
    borderRadius: 24,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    border: '1px solid rgba(37, 99, 235, 0.1)',
    marginBottom: 40,
    '& .val': {
      fontSize: '2.25rem',
      fontWeight: 950,
      color: '#1e3a8a',
      marginRight: 12,
      letterSpacing: '-0.02em'
    },
    '& .cur': {
      fontSize: '1rem',
      fontWeight: 800,
      color: '#64748b',
      textTransform: 'uppercase'
    }
  },
  description: {
    fontSize: '1.05rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: 48,
    whiteSpace: 'pre-line',
    fontWeight: 500
  },
  devisBtn: {
    borderRadius: 24,
    padding: '20px 48px',
    fontSize: '1.15rem',
    fontWeight: 900,
    textTransform: 'none',
    boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.4)',
    backgroundColor: '#f59e0b',
    color: 'white',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    '&:hover': {
      backgroundColor: '#d97706',
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.5)'
    },
    '& .MuiIcon-root': {
        fontSize: 28,
        marginRight: 16
    }
  },
  supplierBadge: {
    marginTop: 48,
    padding: '28px',
    borderRadius: 32,
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    transition: 'all 0.4s ease',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    '&:hover': {
      borderColor: '#2563eb',
      transform: 'translateY(-6px)',
      boxShadow: '0 20px 40px rgba(37, 99, 235, 0.08)',
      '& $supplierName': {
          color: '#2563eb'
      }
    }
  },
  supplierAvatar: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#fff',
    border: '1px solid #f1f5f9',
    padding: 10,
    boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
    '& img': {
      objectFit: 'contain'
    }
  },
  supplierName: {
      fontSize: '1.15rem',
      fontWeight: 900,
      color: '#1e293b',
      marginBottom: 4,
      transition: 'color 0.3s ease'
  },
  infoTabs: {
    marginTop: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: 40,
    padding: 48,
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 40px 100px -20px rgba(15, 23, 42, 0.1)'
  }
}));

function DetailProduit(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const produit = useSelector(({ produitsApp }) => produitsApp.detailProduit);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (produit.data?.images) {
      setImages(produit.data.images.map((item) => URL_SITE + "/images/produits/" + item.url));
    }
  }, [produit.data]);

  const similarSliderSettings = {
    dots: true,
    infinite: produit.produitsSimilaires?.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 2 } }
    ]
  };

  if (produit.loading) {
    return (
      <div className={classes.root}>
        <Paper className={classes.mainPaper}>
          <div className={classes.leftCol} style={{ minHeight: 400 }}>
            <CircularProgress color="primary" />
          </div>
          <div className={classes.rightCol} style={{ gap: 24 }}>
            <div className="h-32 w-3/4 bg-slate-100 rounded animate-pulse" />
            <div className="h-100 w-full bg-slate-100 rounded animate-pulse" />
          </div>
        </Paper>
      </div>
    );
  }

  if (!produit.data) return null;

  const data = produit.data;

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{`${data.titre} | Boopursal`}</title>
      </Helmet>

      <Paper className={classes.mainPaper}>
        {/* Gallery Section */}
        <div className={classes.leftCol} style={{ flexBasis: '50%' }}>
          <div className={classes.imageWrapper} onClick={() => setIsOpen(true)}>
            {images.length > 0 ? (
              <img
                src={images[photoIndex]}
                className={classes.mainImg}
                alt={data.titre}
              />
            ) : (
              <div className="flex flex-col items-center gap-16">
                <Icon className="text-128 text-slate-200">image</Icon>
                <Typography className="text-slate-300 font-bold uppercase tracking-widest text-xs">Aucun visuel disponible</Typography>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className={classes.thumblist}>
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className={clsx(classes.thumb, photoIndex === idx && "active")}
                  onClick={() => setPhotoIndex(idx)}
                  alt={`thumbnail ${idx}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className={classes.rightCol}>
          <div className={classes.categoryLabel}>
            {data.sousSecteurs?.name || 'Catégorie'} • Réf: {data.reference || 'N/A'}
          </div>

          <Typography className={classes.productTitle}>
            {data.titre}
          </Typography>

          <div className={classes.priceBadge}>
            <span className="val">
              {data.pu ? parseFloat(data.pu).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : "Sur demande"}
            </span>
            {data.pu ? <span className="cur">{data.currency?.name || 'MAD'} HT</span> : <span className="cur">Estimation gratuite</span>}
          </div>

          <Typography className={classes.description}>
            {_.truncate(data.description, { length: 450 })}
          </Typography>

          <Button
            variant="contained"
            fullWidth
            className={classes.devisBtn}
            onClick={() => dispatch(Actions.openNewDemandeDevisDialog(data["@id"]))}
          >
            <Icon>receipt_long</Icon>
            Demander un devis personnalisé
          </Button>

          {/* Supplier Info */}
          <Link
            to={data.fournisseur ? `/entreprise/${data.fournisseur.id}-${data.fournisseur.slug}` : "#"}
            className={classes.supplierBadge}
          >
            <Avatar
              src={data.fournisseur?.avatar?.url ? URL_SITE + "/images/avatar/" + data.fournisseur.avatar.url : ""}
              variant="rounded"
              className={classes.supplierAvatar}
            >
              <Icon>business</Icon>
            </Avatar>
            <div className="flex-1">
              <Typography className={classes.supplierName}>{data.fournisseur?.societe}</Typography>
              <Typography className="text-sm text-slate-400 font-bold flex items-center gap-8">
                <Icon style={{ fontSize: 16, color: '#94a3b8' }}>location_on</Icon>
                {data.fournisseur?.ville?.name}, {data.fournisseur?.pays?.name}
              </Typography>
            </div>
            <Icon className="text-slate-300">arrow_forward_ios</Icon>
          </Link>
        </div>
      </Paper>

      {/* Detailed Tabs Area */}
      <div className={classes.infoTabs}>
        <Grid container spacing={4}>
          <Grid item md={7} xs={12}>
            <Typography variant="h6" className="font-900 text-slate-800 mb-16 uppercase text-14 tracking-widest">Description Complète</Typography>
            <Typography className="text-slate-500 whitespace-pre-line leading-relaxed">
              {data.description}
            </Typography>

            {data.videos && (
              <div className="mt-40">
                <Typography variant="h6" className="font-900 text-slate-800 mb-24 uppercase text-14 tracking-widest">Présentation Vidéo</Typography>
                <div className="rounded-24 overflow-hidden shadow-xl">
                  <YouTube videoId={data.videos} opts={{ width: '100%', playerVars: { rel: 0 } }} />
                </div>
              </div>
            )}
          </Grid>
          <Grid item md={5} xs={12}>
            {data.ficheTechnique && (
              <div className="p-32 bg-slate-50 rounded-24 flex flex-col items-center border border-slate-100">
                <Icon className="text-64 text-blue-500 mb-16">cloud_download</Icon>
                <Typography variant="h6" className="font-900 text-slate-800 mb-8">Documentation</Typography>
                <Typography className="text-slate-400 text-center mb-32 text-13">Consultez la fiche technique détaillée (PDF) pour plus de caractéristiques.</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="rounded-12 font-bold px-32 shadow-xl"
                  onClick={() => dispatch(Actions.getFile(data.ficheTechnique))}
                >
                  Télécharger
                </Button>
              </div>
            )}

            <div className="mt-32 p-32 bg-white rounded-24 border border-slate-100">
              <Typography className="font-black text-slate-300 uppercase text-xs tracking-widest mb-16">Partager le produit</Typography>
              <InlineShareButtons
                key={data.id}
                config={{
                  alignment: 'left',
                  enabled: true,
                  networks: ['whatsapp', 'messenger', 'linkedin', 'facebook', 'email'],
                  radius: 12,
                  size: 36,
                  title: data.titre
                }}
              />
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Similarities Area */}
      {produit.produitsSimilaires?.length > 1 && (
        <div className="mt-64">
          <div className="flex items-center gap-16 mb-40">
            <div className="w-12 h-32 bg-yellow-400 rounded-full" />
            <Typography variant="h4" className="font-900 text-slate-800 tracking-tight">Ceci peut vous intéresser</Typography>
          </div>
          <Slider {...similarSliderSettings}>
            {produit.produitsSimilaires.map((item, idx) => (
              item["@id"] !== data["@id"] && (
                <div key={idx} className="px-12">
                  <Produit produit={item} />
                </div>
              )
            ))}
          </Slider>
        </div>
      )}

      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}
    </div>
  );
}

export default React.memo(DetailProduit);
