import React, { useEffect, useState } from "react";
import {
  Icon,
  Typography,
  Grid,
  Button,
  Container,
  Box,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate, FuseAnimateGroup } from "@fuse";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import clsx from "clsx";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import BioAcheteur from "./BioAcheteur";
import BioFournisseur from "./BioFournisseur";
import News from "./News";
import Produit from "./Produit";
import Slider from "react-slick";
import * as Actions from "./store/actions";
import reducer from "./store/reducers";
import ContentLoader from "react-content-loader";
import Search from "../Search/Search";
import { Helmet } from "react-helmet";
import Categories from "./Categories";
import moment from 'moment';
import 'moment/locale/fr';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "var(--portal-bg)",
    color: "var(--portal-text)",
    fontFamily: "'Inter', sans-serif",
  },

  // ===== HERO =====
  heroSection: {
    padding: "100px 20px 80px",
    position: "relative",
    textAlign: "center",
    zIndex: 1,
  },

  heroTitle: {
    fontSize: "clamp(3rem, 8vw, 5.5rem)",
    fontWeight: 900,
    color: "var(--portal-text)",
    marginBottom: "32px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    "& span": {
       background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
       "-webkit-background-clip": "text",
       "-webkit-text-fill-color": "transparent",
    }
  },

  heroSubtitle: {
    fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
    color: "var(--portal-muted)",
    fontWeight: 500,
    lineHeight: 1.6,
    maxWidth: "1000px",
    margin: "0 auto 56px",
  },

  searchBox: {
    background: "rgba(255, 255, 255, 0.04)",
    borderRadius: "100px",
    padding: "10px",
    border: "1px solid var(--portal-border)",
    backdropFilter: "blur(40px)",
    maxWidth: "1400px",
    margin: "0 auto",
    transition: "all 0.5s ease",
    boxShadow: "0 40px 100px rgba(0, 0, 0, 0.5)",
    "&:focus-within": {
      borderColor: "var(--portal-primary)",
      boxShadow: "0 10px 40px rgba(255, 90, 90, 0.15)",
    }
  },

  // ===== STATS =====
  statsSection: {
    padding: "60px 20px",
    position: "relative",
    zIndex: 2,
  },

  statsContainer: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "32px",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },

  statItem: {
    background: "var(--portal-surface)",
    borderRadius: "32px",
    padding: "50px 32px",
    border: "1px solid var(--portal-border)",
    textAlign: "center",
    transition: "all 0.5s ease",
    boxShadow: "var(--portal-card-shadow)",
    "&:hover": {
      transform: "translateY(-8px)",
      borderColor: "var(--portal-primary)",
      boxShadow: "0 20px 40px rgba(255, 90, 90, 0.15)",
    },
    "& h3": {
      fontSize: "3.5rem",
      fontWeight: 900,
      color: "var(--portal-primary)",
      marginBottom: "12px",
    },
    "& p": {
      fontSize: "0.9rem",
      color: "var(--portal-muted)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.15em",
    },
  },

  // ===== SECTION HEADERS =====
  sectionTitle: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 900,
    color: "var(--portal-text)",
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "-0.04em",
  },

  sectionSubtitle: {
    fontSize: "clamp(1rem, 2vw, 1.15rem)",
    color: "var(--portal-muted)",
    textAlign: "center",
    marginBottom: "56px",
    maxWidth: "750px",
    margin: "0 auto 56px",
    lineHeight: 1.6,
  },

  // ===== SECTION WRAPPER =====
  sectionDark: {
    padding: "70px 20px",
    position: "relative",
  },

  // ===== DEMANDES =====
  demandCard: {
    background: "var(--portal-surface)",
    borderRadius: "28px",
    padding: "36px",
    marginBottom: "24px",
    border: "1px solid var(--portal-border)",
    transition: "all 0.4s ease",
    boxShadow: "var(--portal-card-shadow)",
    "&:hover": {
      transform: "translateY(-6px)",
      borderColor: "var(--portal-primary)",
      boxShadow: "0 15px 30px rgba(255, 90, 90, 0.12)",
    },
  },

  demandTitle: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "var(--portal-text)",
    marginBottom: "12px",
  },

  demandRef: {
    background: "rgba(255, 90, 90, 0.1)",
    color: "#ff5a5a",
    padding: "5px 14px",
    borderRadius: "100px",
    fontSize: "0.75rem",
    fontWeight: 700,
    marginBottom: "14px",
    display: "inline-block",
  },

  demandDescription: {
    color: "var(--portal-muted)",
    fontSize: "1rem",
    lineHeight: 1.7,
    marginBottom: "20px",
  },

  viewMoreButton: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    fontWeight: 800,
    fontSize: "0.9rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(255, 90, 90, 0.25)",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    }
  },

  // ===== PRODUITS (Slider) =====
  produitsSection: {
    padding: "40px 20px 20px",
    position: "relative",
    "& .slick-slider": {
      marginBottom: 0,
    },
    "& .slick-slide": {
      padding: "0 16px",
    },
    "& .slick-track": {
      display: "flex",
      alignItems: "stretch",
    },
    "& .slick-slide > div": {
      height: "100%",
    },
    "& .slick-dots": {
      position: "relative",
      bottom: "auto",
      marginTop: "24px",
      lineHeight: 1,
    },
    "& .slick-dots li button:before": {
      color: "var(--portal-muted) !important",
      fontSize: "10px !important",
    },
    "& .slick-dots li.slick-active button:before": {
      color: "var(--portal-primary) !important",
    },
  },

  // ===== NEWS =====
  newsSection: {
    padding: "40px 20px",
    position: "relative",
  },

  // ===== CTA (BioAcheteur/BioFournisseur) =====
  ctaSection: {
    padding: "70px 20px",
    position: "relative",
  },

  ctaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "64px",
    maxWidth: "1400px",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
    },
  },

  ctaCard: {
    background: "var(--portal-surface)",
    borderRadius: "32px",
    padding: "48px 36px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "1px solid var(--portal-border)",
    transition: "all 0.5s ease",
    boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
    "&:hover": {
      transform: "translateY(-8px)",
      borderColor: "var(--portal-primary)",
      boxShadow: "0 25px 50px rgba(255, 90, 90, 0.1)",
    }
  },

  // ===== NEWSLETTER =====
  newsletterSection: {
    padding: "60px 20px",
    background: "var(--portal-bg)",
    borderTop: "1px solid var(--portal-border)",
  },

  // ===== FOOTER =====
  footerSection: {
    padding: "60px 20px 40px",
    borderTop: "1px solid var(--portal-border)",
    color: "var(--portal-muted)",
  },
  bannerSide: {
    height: "100%",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid var(--portal-border)",
    background: "var(--portal-surface)",
    padding: "0",
    "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: 0.85,
        transition: "all 0.4s ease",
    },
    "&:hover img": {
        transform: "scale(1.05)",
        opacity: 1,
    }
  }
}));

// Slider arrows
function SampleNextArrow(props) {
  const { style, onClick, className } = props;
  return (
    <div className={className} style={{
      ...style, display: "flex", alignItems: "center", justifyContent: "center",
      width: "56px", height: "56px", borderRadius: "50%",
      background: "var(--portal-surface)", border: "1px solid var(--portal-border)",
      right: "-28px", zIndex: 10, color: "var(--portal-text)",
    }} onClick={onClick}>
      <Icon style={{ fontSize: 24 }}>arrow_forward_ios</Icon>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { style, onClick, className } = props;
  return (
    <div className={className} style={{
      ...style, display: "flex", alignItems: "center", justifyContent: "center",
      width: "56px", height: "56px", borderRadius: "50%",
      background: "var(--portal-surface)", border: "1px solid var(--portal-border)",
      left: "-28px", zIndex: 10, color: "var(--portal-text)",
    }} onClick={onClick}>
      <Icon style={{ fontSize: 24, marginLeft: "8px" }}>arrow_back_ios</Icon>
    </div>
  );
}

function Index(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const title = "Boopursal | Place de marché B2B";
  const description = "Boopursal - La place de marché B2B qui connecte +1000 entreprises.";
  const portail = useSelector(({ IndexApp }) => IndexApp.poratilIndex);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    dispatch(Actions.getCategories());
    dispatch(Actions.getFocusProduct());
    dispatch(Actions.getdemandeDevis());
    dispatch(Actions.getNews());
    return () => {
      dispatch(Actions.cleanUpCategories());
      dispatch(Actions.cleanUpProduct());
      dispatch(Actions.cleanUpDevis());
      dispatch(Actions.cleanUpNew());
    };
  }, [dispatch]);

  return (
    <div className={clsx(classes.root, "modern-dark-portal")}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Helmet>

      {/* ===================== HERO ===================== */}
      <section className={classes.heroSection}>
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '600px',
          background: 'radial-gradient(circle, rgba(255, 90, 90, 0.07) 0%, transparent 70%)',
          zIndex: -1, pointerEvents: 'none'
        }} />

        <Container maxWidth="lg">
          <FuseAnimate animation="transition.slideUpIn" duration={800}>
            <h1 className={classes.heroTitle}>
              Propulsez votre <span>B2B</span><br />au niveau supérieur
            </h1>
          </FuseAnimate>

          <FuseAnimate animation="transition.slideUpIn" duration={800} delay={200}>
            <p className={classes.heroSubtitle}>
              Trouvez vos fournisseurs, recevez des devis et développez votre réseau professionnel
            </p>
          </FuseAnimate>

          <FuseAnimate animation="transition.slideUpIn" duration={800} delay={400}>
            <div className={classes.searchBox}>
              <Search
                className="w-full"
                variant="basic"
                inline={true}
                onResultsVisibilityChange={setSearchResultsVisible}
              />
            </div>
          </FuseAnimate>
        </Container>
      </section>

      {/* ===================== STATS ===================== */}
      <section className={classes.statsSection}>
        <div className={classes.statsContainer}>
          <div className={classes.statItem}><h3>+1000</h3><p>Entreprises inscrites</p></div>
          <div className={classes.statItem}><h3>+5000</h3><p>Produits référencés</p></div>
          <div className={classes.statItem}><h3>+200K</h3><p>Visiteurs mensuels</p></div>
          <div className={classes.statItem}><h3>24/7</h3><p>Support disponible</p></div>
        </div>
      </section>

      {/* ===================== CATEGORIES ===================== */}
      <section className={classes.sectionDark}>
        <Container maxWidth="xl">
          <h2 className={classes.sectionTitle}>Explorez nos secteurs d'activité</h2>
          <p className={classes.sectionSubtitle}>
            Découvrez une large gamme de catégories pour trouver exactement ce dont vous avez besoin
          </p>
          <Categories categories={portail.categories} />
        </Container>
      </section>

      <section className={classes.sectionDark}>
        <Container maxWidth="xl">
          <h2 className={classes.sectionTitle}>Dernières demandes de devis</h2>
          <p className={classes.sectionSubtitle}>
            Réponsez aux demandes et développez votre portefeuille clients
          </p>

          <Grid container spacing={3}>
            {/* Left Banner */}
            <Hidden mdDown>
              <Grid item lg={2}>
                <div className={classes.bannerSide} style={{ height: '700px' }}>
                  <img src="assets/images/ad_network.png" alt="Networking" />
                </div>
              </Grid>
            </Hidden>

            {/* Center Content */}
            <Grid item xs={12} lg={8}>
              {portail.loading ? (
                <ContentLoader speed={2} width={1200} height={200} viewBox="0 0 1200 200"
                  style={{ width: '100%', height: 'auto', opacity: 0.5 }}>
                  <rect x="0" y="0" rx="16" ry="16" width="1200" height="180" />
                </ContentLoader>
              ) : (
                <FuseAnimateGroup enter={{ animation: 'transition.slideUpBigIn' }}>
                  {portail.data && portail.data.slice(0, 6).map((item, index) => {
                    const countryMapping = {
                      "États-Unis": "us", Allemagne: "de", France: "fr",
                      Maroc: "ma", Espagne: "es", Italie: "it", "Royaume-Uni": "gb",
                    };
                    const code = countryMapping[item.pays] || null;

                    return (
                      <Link key={index} to={`/demandes-achat/${item.id}-${item.slug}`} style={{ textDecoration: 'none' }}>
                        <div className={classes.demandCard}>
                          <span className={classes.demandRef}>RFQ-{item.reference}</span>
                          <h3 className={classes.demandTitle}>{item.titre}</h3>
                          <p className={classes.demandDescription}>
                            {item.description.length > 150 ? item.description.slice(0, 150) + '…' : item.description}
                          </p>
                          <div className="flex items-center justify-between flex-wrap gap-16">
                            <div className="flex items-center gap-10" style={{ color: 'var(--portal-muted)' }}>
                              {code && (
                                <img src={`https://flagcdn.com/w20/${code}.png`} alt={item.pays}
                                  style={{ width: '20px', height: '15px', borderRadius: '3px' }} />
                              )}
                              <span className="font-600">{item.ville}, {item.pays}</span>
                            </div>
                            <div style={{ color: 'var(--portal-muted)', fontSize: '0.9rem' }}>
                              Expire le {moment(item.dateExpiration).format('DD/MM/YYYY')}
                            </div>
                            <button className={classes.viewMoreButton}>Voir plus →</button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </FuseAnimateGroup>
              )}
            </Grid>

            {/* Right Banner */}
            <Hidden mdDown>
              <Grid item lg={2}>
                <div className={classes.bannerSide} style={{ height: '700px' }}>
                  <img src="assets/images/ad_pro.png" alt="Pro" />
                </div>
              </Grid>
            </Hidden>
          </Grid>

          <Box className="text-center mt-40">
            <Link to="/demandes-achats" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" style={{
                borderRadius: '16px', padding: '14px 40px',
                borderColor: 'var(--portal-border)', color: 'var(--portal-text)',
                fontWeight: 800, textTransform: 'none', fontSize: '1.1rem'
              }}>
                Toutes les demandes
              </Button>
            </Link>
          </Box>
        </Container>
      </section>

      {/* ===================== PRODUITS EN VEDETTE ===================== */}
      <section className={classes.produitsSection}>
        <Container maxWidth="xl">
          <h2 className={classes.sectionTitle}>Produits en vedette</h2>
          <p className={classes.sectionSubtitle}>
            Les produits les plus demandés par nos acheteurs certifiés
          </p>

          {portail.loadingProduits ? (
            <ContentLoader speed={2} width={1200} height={300} viewBox="0 0 1200 300"
              style={{ width: '100%', opacity: 0.5 }}>
              <rect x="0" y="0" rx="16" ry="16" width="280" height="280" />
              <rect x="310" y="0" rx="16" ry="16" width="280" height="280" />
              <rect x="620" y="0" rx="16" ry="16" width="280" height="280" />
              <rect x="930" y="0" rx="16" ry="16" width="280" height="280" />
            </ContentLoader>
          ) : portail.produits && portail.produits.length > 0 ? (
            <Slider {...settings}>
              {portail.produits.map((item, index) => (
                <div key={index}><Produit produit={item.produit} /></div>
              ))}
            </Slider>
          ) : (
            <Typography className="text-center" style={{ color: '#64748b' }}>
              Aucun produit en vedette pour le moment
            </Typography>
          )}
        </Container>
      </section>

      {/* ===================== ACTUALITES ===================== */}
      <section className={classes.newsSection}>
        <Container maxWidth="lg">
          <h2 className={classes.sectionTitle}>Actualités & Tendances</h2>
          <p className={classes.sectionSubtitle}>
            Restez informé des dernières nouvelles du marché B2B
          </p>

          {portail.loadingNews ? (
            <ContentLoader speed={2} width={1200} height={300} viewBox="0 0 1200 300"
              style={{ width: '100%', opacity: 0.5 }}>
              <rect x="0" y="0" rx="16" ry="16" width="380" height="280" />
              <rect x="410" y="0" rx="16" ry="16" width="380" height="280" />
              <rect x="820" y="0" rx="16" ry="16" width="380" height="280" />
            </ContentLoader>
          ) : portail.news && portail.news.length > 0 ? (
            <Grid container spacing={4}>
              {portail.news.slice(0, 3).map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <News news={item} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography className="text-center" style={{ color: '#64748b' }}>
              Aucune actualité pour le moment
            </Typography>
          )}
        </Container>
      </section>

      {/* ===================== CTA: FOURNISSEUR / ACHETEUR ===================== */}
      <section className={classes.ctaSection}>
        <Container maxWidth="lg">
          <h2 className={classes.sectionTitle}>Rejoignez l'écosystème Boopursal</h2>
          <p className={classes.sectionSubtitle}>
            Que vous soyez fournisseur ou acheteur, notre plateforme vous connecte aux bonnes opportunités
          </p>

          <div className={classes.ctaGrid}>
            <div className={classes.ctaCard}>
              <BioFournisseur />
            </div>
            <div className={classes.ctaCard}>
              <BioAcheteur />
            </div>
          </div>
        </Container>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section className={classes.newsletterSection}>
        <Container maxWidth="md">
          <h2 className={clsx(classes.sectionTitle, "mb-16")} style={{ fontSize: '2rem' }}>
            Restez connecté
          </h2>
          <p className={classes.sectionSubtitle} style={{ marginBottom: '32px' }}>
            Recevez les dernières tendances et opportunités directement dans votre boîte mail
          </p>
          <Newsletter />
        </Container>
      </section>
    </div>
  );
}

export default withReducer("IndexApp", reducer)(Index);