import React from "react";
import { Grid, Typography, Icon, Box } from "@material-ui/core";
import { URL_SITE } from "@fuse";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { FuseAnimateGroup } from "@fuse";

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
    height: "360px",
    borderRadius: "32px",
    overflow: "hidden",
    textDecoration: "none",
    transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    background: "var(--portal-surface)",
    border: "1px solid var(--portal-border)",
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
    background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
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
      background: "rgba(255, 255, 255, 0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "24px",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    "&:hover": {
      boxShadow: "0 40px 80px rgba(255, 90, 90, 0.3)",
      "& $iconWrapper": {
        transform: "rotate(10deg) scale(1.1)",
        background: "rgba(255, 255, 255, 0.25)",
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
                <img
                  className={classes.bgImage}
                  alt={cat.name}
                  src={cat.url ? URL_SITE + "/images/secteur/" + cat.url : "assets/images/ecommerce/product-placeholder.jpg"}
                />
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
                <Typography className={classes.categoryText} style={{ textAlign: "center" }}>
                   Intelligence Totale
                </Typography>
                <Typography style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Voir tous les secteurs
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
