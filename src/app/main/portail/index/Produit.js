import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Icon
} from "@material-ui/core";
import _ from "@lodash";
import { URL_SITE } from "@fuse/Constants";

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: "32px",
    background: "var(--portal-surface)",
    border: "1px solid var(--portal-border)",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "var(--portal-card-shadow)",
    "&:hover": {
      transform: "translateY(-12px)",
      boxShadow: "0 25px 50px rgba(255, 90, 90, 0.15)",
      borderColor: "var(--portal-primary)",
      "& $media": {
        transform: "scale(1.1) rotate(1deg)",
      },
      "& $viewDetail": {
        opacity: 1,
        transform: "translate(-50%, -50%) scale(1)",
      }
    },
  },
  mediaWrapper: {
    overflow: "hidden",
    position: "relative",
    height: 260,
    background: "var(--portal-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  media: {
    height: "85%",
    width: "85%",
    backgroundSize: "contain",
    transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  viewDetail: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%) scale(0.8)",
    background: "var(--portal-surface)",
    backdropFilter: "blur(12px)",
    color: "var(--portal-primary)",
    padding: "14px 28px",
    borderRadius: "40px",
    fontWeight: 900,
    fontSize: "0.9rem",
    boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
    opacity: 0,
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    pointerEvents: "none",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  cardContent: {
    padding: "24px 28px 32px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 900,
    color: "var(--portal-text)",
    lineHeight: 1.25,
    marginBottom: "12px",
    height: "2.5em", 
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    letterSpacing: "-0.01em"
  },
  referenceWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "var(--portal-muted)",
    marginBottom: "20px",
    padding: "4px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "10px",
    width: "fit-content"
  },
  reference: {
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  },
  badgeOverlay: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    zIndex: 3,
  },
  glassBadge: {
    background: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    height: 34,
    fontWeight: 800,
    fontSize: "0.75rem",
    color: "var(--portal-text)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    "& .MuiChip-icon": {
      fontSize: 18,
      color: "#2563eb",
    }
  }
}));

export default function Produit(props) {
  const classes = useStyles();
  const { produit } = props;

  if (!produit) return null;

  const imageUrl = produit.featuredImageId
    ? URL_SITE + produit.featuredImageId.url
    : "assets/images/ecommerce/product-placeholder.jpg";

  return (
    <Card className={classes.card} elevation={0}>
      <CardActionArea
        component="a"
        href={`/detail-produit/${produit.sousSecteurs?.slug}/${produit.categorie?.slug}/${produit.id}-${produit.slug}`}
      >
        <div className={classes.mediaWrapper}>
          <div className={classes.badgeOverlay}>
            {produit.images?.length > 0 && (
              <Chip
                icon={<Icon>image</Icon>}
                label={produit.images.length}
                className={classes.glassBadge}
              />
            )}
            {produit.videos && (
              <Chip
                icon={<Icon>videocam</Icon>}
                label="Vidéo"
                className={classes.glassBadge}
              />
            )}
            {produit.ficheTechnique && (
              <Chip
                icon={<Icon>description</Icon>}
                label="Doc"
                className={classes.glassBadge}
              />
            )}
          </div>

          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={produit.titre}
            style={{ backgroundSize: 'contain' }}
          />

          <div className={classes.viewDetail}>
            Voir les détails <Icon style={{ fontSize: 18 }}>arrow_forward</Icon>
          </div>
        </div>

        <CardContent className={classes.cardContent}>
          <Typography className={classes.title}>
            {_.capitalize(produit.titre)}
          </Typography>

          <div className={classes.referenceWrapper}>
            <Icon style={{ fontSize: 16 }}>qr_code</Icon>
            <span className={classes.reference}>
              {produit.reference || "REF-POOL-2026"}
            </span>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography style={{ color: '#ff5a5a', fontWeight: 900, fontSize: '0.9rem' }}>
              Demander Prix
            </Typography>
            <Icon style={{ color: '#cbd5e1' }}>more_horiz</Icon>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

Produit.propTypes = {
  produit: PropTypes.object,
};
