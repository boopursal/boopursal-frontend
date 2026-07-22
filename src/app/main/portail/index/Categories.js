import React from "react";
import { Typography, Icon } from "@material-ui/core";
import { URL_SITE } from "@fuse";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimateGroup } from "@fuse";

const SECTOR_GRADIENTS = [
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #141e30 0%, #243b55 100%)",
  "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
  "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
  "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
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
  "@keyframes shine": {
    "0%": { left: "-100%" },
    "100%": { left: "100%" }
  },
  "@keyframes pulseDot": {
    "0%": { opacity: 1, transform: "scale(1)" },
    "50%": { opacity: 0.4, transform: "scale(0.8)" },
    "100%": { opacity: 1, transform: "scale(1)" }
  },
  "@keyframes gradientMove": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" }
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },
  bentoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
      gridAutoRows: "220px",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(4, 1fr)",
      gridAutoRows: "220px",
    }
  },
  bentoItem: {
    position: "relative",
    borderRadius: "24px",
    overflow: "hidden",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    background: "var(--portal-surface)",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    border: "1px solid rgba(128,128,128,0.15)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    "&:hover": {
      transform: "translateY(-6px) scale(1.01)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      "& $bgImage": {
        transform: "scale(1.08) rotate(1deg)",
      },
      "& $exploreBtn": {
        opacity: 1,
        transform: "translateX(0)",
      },
      "& $overlayGradient": {
        opacity: 0.9,
      },
      "&::after": {
        animation: "$shine 1.2s ease",
      }
    },
    // Shine effect
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "50%",
      height: "100%",
      background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
      transform: "skewX(-25deg)",
      zIndex: 4,
    }
  },
  // Specific grid sizing for medium and up
  item0: {
    [theme.breakpoints.down("xs")]: { height: "260px" },
    [theme.breakpoints.up("sm")]: {
      gridColumn: "span 2",
      gridRow: "span 2",
    },
    [theme.breakpoints.up("md")]: {
      gridColumn: "span 2",
      gridRow: "span 2",
      "& $categoryText": {
        fontSize: "2.2rem", // Adjusted from 2.8rem
      }
    }
  },
  itemAll: {
    [theme.breakpoints.down("xs")]: { height: "200px" },
    [theme.breakpoints.up("md")]: {
      gridColumn: "span 2",
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
    background: "linear-gradient(to top, rgba(10, 15, 30, 0.95) 0%, rgba(10, 15, 30, 0.3) 60%, transparent 100%)",
    zIndex: 2,
    transition: "opacity 0.5s ease",
    opacity: 0.75,
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
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  categoryText: {
    color: "#ffffff",
    fontSize: "1.4rem",
    fontWeight: 900,
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
    marginBottom: "16px",
    textShadow: "0 4px 15px rgba(0,0,0,0.6)",
  },
  exploreBtn: {
    display: "inline-flex",
    alignItems: "center",
    color: "#38bdf8", // Sky blue
    fontSize: "0.85rem",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "2px",
    opacity: 0,
    transform: "translateX(-20px)",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    "& .MuiIcon-root": {
      fontSize: "1.3rem",
      marginLeft: "8px",
    }
  },
  sectorBadge: {
    position: "absolute",
    top: "24px",
    left: "24px",
    zIndex: 3,
    background: "rgba(10, 10, 10, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    padding: "8px 16px",
    borderRadius: "30px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    color: "#ffffff",
    fontSize: "0.65rem",
    fontWeight: 800,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    "&::before": {
      content: '""',
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#10b981",
      boxShadow: "0 0 10px #10b981",
      animation: "$pulseDot 2s infinite",
    }
  },
  allSectorsCard: {
    background: "linear-gradient(270deg, #1e1b4b, #312e81, #4338ca, #3b82f6, #1e1b4b)",
    backgroundSize: "400% 400%",
    animation: "$gradientMove 15s ease infinite",
    border: "none",
    "& $contentWrapper": {
      alignItems: "flex-start",
      justifyContent: "flex-end",
      height: "100%",
    },
    [theme.breakpoints.up("md")]: {
      "& $contentWrapper": {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      "& $iconWrapper": {
        marginBottom: 0,
        marginRight: "24px",
      }
    },
    "&:hover": {
      "& $iconWrapper": {
        transform: "scale(1.1) rotate(180deg)",
        background: "rgba(255, 255, 255, 0.25)",
        boxShadow: "0 0 40px rgba(255,255,255,0.3)",
      },
      "& $exploreBtnAll": {
        transform: "translateX(10px)",
      }
    }
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    transition: "all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  exploreBtnAll: {
    display: "inline-flex",
    alignItems: "center",
    color: "#ffffff",
    fontSize: "0.9rem",
    fontWeight: 800,
    marginTop: "16px",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    transition: "all 0.4s ease",
    "& .MuiIcon-root": {
      marginLeft: "10px",
      fontSize: "1.4rem",
    }
  }
}));

function Categories({ categories }) {
  const classes = useStyles();

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const displayedCategories = categories.slice(0, 7);

  return (
    <div className={classes.container}>
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpIn",
          stagger: 80,
        }}
      >
        <div className={classes.bentoGrid}>
          {displayedCategories.map((cat, index) => (
            <Link 
              to={`/vente-produits/${cat.slug}`} 
              className={clsx(classes.bentoItem, index === 0 && classes.item0)} 
              key={index}
            >
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
              </div>

              <div className={classes.overlayGradient} />

              <div className={classes.contentWrapper}>
                <Typography className={classes.categoryText}>
                  {cat.name}
                </Typography>
                <div className={classes.exploreBtn}>
                  Découvrir <Icon>east</Icon>
                </div>
              </div>
            </Link>
          ))}

          {/* Last Card: Explorer Tout */}
          <Link 
            to={`/annuaire-entreprises`} 
            className={clsx(classes.bentoItem, classes.itemAll, classes.allSectorsCard)}
          >
            <div className={classes.contentWrapper}>
              <div>
                <div className={classes.iconWrapper}>
                  <Icon style={{ fontSize: 40, color: "#fff" }}>widgets</Icon>
                </div>
                <Typography className={classes.categoryText} style={{ marginBottom: 4 }}>
                   Explorer Tout
                </Typography>
                <Typography style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 600 }}>
                  Accéder à l'annuaire complet
                </Typography>
              </div>
              <div className={classes.exploreBtnAll}>
                Tous les secteurs <Icon>east</Icon>
              </div>
            </div>
          </Link>
        </div>
      </FuseAnimateGroup>
    </div>
  );
}

export default Categories;
