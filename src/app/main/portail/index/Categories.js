import React from "react";
import { Grid, Typography, Icon } from "@material-ui/core";
import { URL_SITE } from "@fuse";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimateGroup } from "@fuse";

// Palette de dégradés professionnels pour les secteurs sans photo
const SECTOR_GRADIENTS = [
  "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
];

function getSectorGradient(name) {
  if (!name) return SECTOR_GRADIENTS[0];
  const idx = name.charCodeAt(0) % SECTOR_GRADIENTS.length;
  return SECTOR_GRADIENTS[idx];
}

function getSectorIcon(name) {
  if (!name) return 'business';
  const n = name.toLowerCase();
  if (n.includes('acier') || n.includes('metal') || n.includes('tôle')) return 'hardware';
  if (n.includes('agro') || n.includes('aliment')) return 'restaurant';
  if (n.includes('auto') || n.includes('voiture') || n.includes('véhicule')) return 'directions_car';
  if (n.includes('banc') || n.includes('financ') || n.includes('assur')) return 'account_balance';
  if (n.includes('chimie') || n.includes('pharma')) return 'science';
  if (n.includes('énergie') || n.includes('electr')) return 'bolt';
  if (n.includes('btp') || n.includes('construct') || n.includes('bâtiment')) return 'construction';
  if (n.includes('info') || n.includes('tech') || n.includes('digit')) return 'computer';
  if (n.includes('transport') || n.includes('logistique')) return 'local_shipping';
  if (n.includes('textile') || n.includes('habillement')) return 'checkroom';
  if (n.includes('santé') || n.includes('medical') || n.includes('médic')) return 'local_hospital';
  if (n.includes('agriculture') || n.includes('agri')) return 'grass';
  if (n.includes('aéro') || n.includes('aviat')) return 'flight';
  return 'domain';
}

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },
  categoryCard: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "340px",
    borderRadius: "20px",
    overflow: "hidden",
    textDecoration: "none",
    background: "var(--portal-surface)",
    border: "1px solid rgba(128,128,128,0.15)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
    transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
    "&:hover": {
      transform: "translateY(-10px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      "& $bgImage": {
        transform: "scale(1.1)",
      },
      "& $overlayGradient": {
        opacity: 0.85,
      },
      "& $exploreBtn": {
        opacity: 1,
        transform: "translateX(5px)",
      },
      "& $sectorBadge": {
        background: "rgba(255,255,255,0.25)",
      }
    }
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    zIndex: 1,
  },
  overlayGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)",
    zIndex: 2,
    transition: "opacity 0.5s ease",
    opacity: 0.7,
  },
  gradientFallback: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  gradientIcon: {
    fontSize: "80px !important",
    color: "rgba(255,255,255,0.1)",
    transform: "translateY(-20px)",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 3,
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  categoryText: {
    color: "#ffffff",
    fontSize: "1.3rem",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    lineHeight: 1.3,
    marginBottom: "12px",
    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
  },
  exploreBtn: {
    display: "inline-flex",
    alignItems: "center",
    color: "#60a5fa", // Nice modern blue
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    opacity: 0,
    transform: "translateX(-15px)",
    transition: "all 0.4s ease",
    "& .MuiIcon-root": {
      fontSize: "1.2rem",
      marginLeft: "8px",
    }
  },
  sectorBadge: {
    position: "absolute",
    top: "20px",
    left: "20px",
    zIndex: 3,
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    transition: "background 0.3s ease",
  },
  allSectorsCard: {
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& $contentWrapper": {
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      height: "100%",
    },
    "&:hover": {
      "& $iconWrapper": {
        transform: "scale(1.15) rotate(10deg)",
        background: "rgba(255, 255, 255, 0.3)",
        boxShadow: "0 0 30px rgba(255,255,255,0.4)",
      },
      "& $exploreBtnAll": {
        transform: "translateX(5px)",
      }
    }
  },
  iconWrapper: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
  exploreBtnAll: {
    display: "flex",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "0.85rem",
    fontWeight: 700,
    marginTop: "16px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    transition: "all 0.4s ease",
    "& .MuiIcon-root": {
      marginLeft: "8px",
      fontSize: "1.2rem",
    }
  }
}));

function Categories(props) {
  const { categories } = props;
  const classes = useStyles();

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const displayedCategories = categories.slice(0, 7);

  return (
    <div className={classes.gridContainer}>
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpIn",
          stagger: 80,
        }}
      >
        <Grid container spacing={4}>
          {displayedCategories.map((cat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Link to={`/vente-produits/${cat.slug}`} className={classes.categoryCard}>
                <div className={classes.sectorBadge}>Secteur Actif</div>
                {cat.url ? (
                  <img
                    className={classes.bgImage}
                    alt={cat.name}
                    src={
                      cat.url.startsWith("http")
                        ? cat.url
                        : URL_SITE + "/images/secteur/" + cat.url
                    }
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                    }}
                  />
                ) : null}
                
                {/* Fallback gradient si pas d'image */}
                <div
                  className={classes.gradientFallback}
                  style={{
                    background: getSectorGradient(cat.name),
                    display: cat.url ? 'none' : 'flex',
                  }}
                >
                  <Icon className={classes.gradientIcon}>{getSectorIcon(cat.name)}</Icon>
                </div>

                {/* Overlay sombre pour la lisibilité */}
                <div className={classes.overlayGradient} />

                <div className={classes.contentWrapper}>
                  <Typography className={classes.categoryText}>
                    {cat.name}
                  </Typography>
                  <div className={classes.exploreBtn}>
                    Découvrir <Icon>arrow_forward</Icon>
                  </div>
                </div>
              </Link>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link to={`/annuaire-entreprises`} className={clsx(classes.categoryCard, classes.allSectorsCard)}>
              <div className={classes.contentWrapper}>
                <div className={classes.iconWrapper}>
                  <Icon style={{ fontSize: 36, color: "#fff" }}>apps</Icon>
                </div>
                <Typography className={classes.categoryText} style={{ textAlign: "center", marginBottom: 0 }}>
                   Explorer Tout
                </Typography>
                <div className={classes.exploreBtnAll}>
                  Tous les secteurs <Icon>arrow_forward</Icon>
                </div>
              </div>
            </Link>
          </Grid>
        </Grid>
      </FuseAnimateGroup>
    </div>
  );
}

export default Categories;
