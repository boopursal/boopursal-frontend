import React from "react";
import { Typography, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimateGroup, URL_SITE } from "@fuse";

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
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px",
  },
  professionalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    [theme.breakpoints.up("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    [theme.breakpoints.up("md")]: {
      gridTemplateColumns: "repeat(4, 1fr)",
    }
  },
  categoryCard: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background: "rgba(30, 41, 59, 0.4)", // Fallback Dark surface
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    textDecoration: "none !important",
    color: "#ffffff",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    height: "170px",
    "&:hover": {
      textDecoration: "none !important",
      borderColor: "rgba(56, 189, 248, 0.4)", // Sky blue accent
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
      "& $bgImage": {
        transform: "scale(1.1)",
      },
      "& $overlay": {
        background: "linear-gradient(to top, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.5))",
      },
      "& $iconBox": {
        background: "rgba(56, 189, 248, 0.25)",
        color: "#38bdf8",
        transform: "scale(1.1)",
      },
      "& $arrowIcon": {
        opacity: 1,
        transform: "translateX(0)",
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
    transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(to top, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.6))",
    zIndex: 2,
    transition: "background 0.3s ease",
  },
  contentWrapper: {
    position: "relative",
    zIndex: 3,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  iconBox: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255, 255, 255, 0.9)",
    transition: "all 0.3s ease",
    "& .MuiIcon-root": {
      fontSize: "22px",
    }
  },
  categoryTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginTop: "16px",
    lineHeight: 1.3,
    color: "#ffffff",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  exploreText: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
  },
  arrowIcon: {
    color: "#38bdf8",
    fontSize: "18px !important",
    opacity: 0,
    transform: "translateX(-10px)",
    transition: "all 0.3s ease",
    marginLeft: "4px",
  },
  allSectorsCard: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", // Deep blue professional gradient
    border: "1px solid rgba(59, 130, 246, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
      transform: "translateY(-4px)",
      borderColor: "rgba(59, 130, 246, 0.6)",
      boxShadow: "0 12px 30px rgba(37, 99, 235, 0.3)",
      "& $arrowIconAll": {
        opacity: 1,
        transform: "translateX(0)",
      },
      "& $iconBoxAll": {
        transform: "scale(1.1)",
        background: "rgba(255, 255, 255, 0.2)",
      }
    }
  },
  iconBoxAll: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    transition: "all 0.3s ease",
    "& .MuiIcon-root": {
      fontSize: "24px",
    }
  },
  allSectorsTitle: {
    fontSize: "1.1rem",
    fontWeight: 800,
    marginTop: "16px",
    color: "#ffffff",
  },
  arrowIconAll: {
    color: "#ffffff",
    fontSize: "18px !important",
    opacity: 0.7,
    transform: "translateX(-10px)",
    transition: "all 0.3s ease",
    marginLeft: "4px",
  }
}));

function Categories({ categories }) {
  const classes = useStyles();

  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  // Display top 7 + 1 "See All" = 8 items total, fits perfectly in a 4-column grid (2 rows)
  const displayedCategories = categories.slice(0, 7);

  return (
    <div className={classes.container}>
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpIn",
          stagger: 60,
        }}
      >
        <div className={classes.professionalGrid}>
          {displayedCategories.map((cat, index) => (
            <Link 
              to={`/vente-produits/${cat.slug}`} 
              className={classes.categoryCard} 
              key={index}
            >
              {cat.url && (
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
                  }}
                />
              )}
              <div className={classes.overlay} />

              <div className={classes.contentWrapper}>
                <Typography className={classes.categoryTitle}>
                  {cat.name}
                </Typography>
                <div className={classes.cardFooter}>
                  <span className={classes.exploreText}>
                    Découvrir <Icon className={classes.arrowIcon}>arrow_forward</Icon>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Last Card: Explorer Tout */}
          <Link 
            to={`/annuaire-entreprises`} 
            className={clsx(classes.categoryCard, classes.allSectorsCard)}
          >
            <div className={classes.contentWrapper} style={{ zIndex: 4 }}>
              <div className={classes.iconBoxAll}>
                <Icon>apps</Icon>
              </div>
              <Typography className={classes.allSectorsTitle}>
                 Tous les secteurs
              </Typography>
              <div className={classes.cardFooter}>
                <span className={classes.exploreText} style={{ color: "rgba(255,255,255,0.9)" }}>
                  Annuaire Complet <Icon className={classes.arrowIconAll}>arrow_forward</Icon>
                </span>
              </div>
            </div>
          </Link>
        </div>
      </FuseAnimateGroup>
    </div>
  );
}

export default Categories;
