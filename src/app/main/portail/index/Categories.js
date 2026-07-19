import React from "react";
import { Grid, Typography, Icon } from "@material-ui/core";
import { URL_SITE } from "@fuse";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimateGroup } from "@fuse";

// Palette de dégradés professionnels pour les secteurs sans photo
const SECTOR_GRADIENTS = [
  "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)",
  "linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 50%, #3a3a3c 100%)",
  "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)",
  "linear-gradient(135deg, #111827 0%, #1f2937 50%, #374151 100%)",
  "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
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
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "0 24px",
  },
  categoryCard: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "clamp(220px, 45vw, 360px)",
    borderRadius: "32px",
    overflow: "hidden",
    textDecoration: "none",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    background: "var(--portal-surface)",
    border: "1px solid var(--portal-border)",
    [theme.breakpoints.down("xs")]: {
      height: "220px",
      borderRadius: "20px",
    },
    "&:hover": {
      transform: "translateY(-12px) scale(1.02)",
      borderColor: "rgba(255, 90, 90, 0.3)",
      boxShadow: "0 40px 80px rgba(0, 0, 0, 0.6)",
      "& $bgImage": {
        transform: "scale(1.15)",
        filter: "brightness(0.5) saturate(1.2)",
      },
      "& $contentOverlay": {
        background: "linear-gradient(to top, rgba(255, 90, 90, 0.1) 0%, transparent 100%)",
      },
      "& $exploreBtn": {
        opacity: 1,
        transform: "translateY(0)",
      }
    },
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
    filter: "brightness(0.6)",
    zIndex: 1
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
    gap: "12px",
  },
  gradientIcon: {
    fontSize: "60px !important",
    color: "rgba(255,255,255,0.15)",
    filter: "drop-shadow(0 4px 24px rgba(255,255,255,0.05))",
  },
  gradientLetter: {
    fontSize: "5rem",
    fontWeight: 900,
    color: "rgba(255,255,255,0.08)",
    lineHeight: 1,
    userSelect: "none",
    position: "absolute",
    bottom: "10px",
    right: "20px",
    letterSpacing: "-0.05em",
  },
  contentOverlay: {
    position: "relative",
    zIndex: 2,
    padding: "32px",
    background: "linear-gradient(to top, var(--portal-bg) 0%, transparent 100%)",
    width: "100%",
    transition: "all 0.4s ease",
  },
  categoryText: {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "var(--portal-text)",
    lineHeight: 1.2,
    marginBottom: "12px",
  },
  exploreBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#ff5a5a",
    fontSize: "0.85rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.15em",
    opacity: 0,
    transform: "translateY(10px)",
    transition: "all 0.4s ease",
  },
  allSectorsCard: {
    background: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)",
    border: "none",
    "& $contentOverlay": {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
    },
    "& $iconWrapper": {
      width: "80px",
      height: "80px",
      borderRadius: "24px",
      background: "rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.15)",
    },
    "&:hover": {
      boxShadow: "0 40px 80px rgba(30, 41, 59, 0.5)",
      transform: "translateY(-12px) scale(1.02)",
      "& $iconWrapper": {
        transform: "rotate(10deg) scale(1.1)",
        background: "rgba(255, 255, 255, 0.2)",
      }
    }
  },
  iconWrapper: {
    transition: "all 0.5s ease",
  },
  sectorBadge: {
    position: "absolute",
    top: "24px",
    left: "24px",
    zIndex: 3,
    padding: "6px 14px",
    background: "var(--portal-surface)",
    backdropFilter: "blur(12px)",
    border: "1px solid var(--portal-border)",
    borderRadius: "100px",
    color: "var(--portal-text)",
    fontSize: "0.7rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
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
                 <div
                   className={classes.gradientFallback}
                   style={{
                     background: getSectorGradient(cat.name),
                     display: cat.url ? 'none' : 'flex',
                   }}
                 >
                   <Icon className={classes.gradientIcon}>{getSectorIcon(cat.name)}</Icon>
                   <span className={classes.gradientLetter}>
                     {cat.name ? cat.name.charAt(0).toUpperCase() : ''}
                   </span>
                 </div>
                <div className={classes.contentOverlay}>
                  <Typography className={classes.categoryText}>
                    {cat.name}
                  </Typography>
                  <div className={classes.exploreBtn}>
                    Analyser <Icon style={{ fontSize: 18 }}>analytics</Icon>
                  </div>
                </div>
              </Link>
            </Grid>
          ))}

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link to={`/annuaire-entreprises`} className={clsx(classes.categoryCard, classes.allSectorsCard)}>
              <div className={classes.contentOverlay}>
                <div className={classes.iconWrapper}>
                  <Icon style={{ fontSize: 40, color: "#fff" }}>rocket_launch</Icon>
                </div>
                <Typography className={classes.categoryText} style={{ textAlign: "center", color: "#fff" }}>
                   Explorer Tout
                </Typography>
                <Typography style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Tous les secteurs →
                </Typography>
              </div>
            </Link>
          </Grid>
        </Grid>
      </FuseAnimateGroup>
    </div>
  );
}

export default Categories;
