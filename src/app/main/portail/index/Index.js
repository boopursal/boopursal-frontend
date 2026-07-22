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
    overflowX: "hidden",
  },

  // ===== HERO =====
  heroSection: {
    padding: "100px 20px 60px",
    position: "relative",
    textAlign: "center",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      padding: "160px 16px 40px",
    },
  },

  heroTitle: {
    fontSize: "clamp(2rem, 8vw, 5.5rem)",
    fontWeight: 900,
    color: "var(--portal-text)",
    marginBottom: "24px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    "& span": {
       background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
       "-webkit-background-clip": "text",
       "-webkit-text-fill-color": "transparent",
    }
  },

  heroSubtitle: {
    fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
    color: "var(--portal-muted)",
    fontWeight: 500,
    lineHeight: 1.6,
    maxWidth: "800px",
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
    [theme.breakpoints.down("sm")]: {
      borderRadius: "20px",
      padding: "6px",
    },
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
    [theme.breakpoints.down("sm")]: {
      padding: "32px 16px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "20px 12px",
    },
  },

  statsContainer: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)", // 4 Columns on Desktop
    gap: "24px",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (max-width: 500px)": {
      gridTemplateColumns: "1fr",
    },
  },

  statItem: {
    background: "var(--portal-surface)",
    borderRadius: "32px",
    padding: "32px 24px",
    border: "1px solid var(--portal-border)",
    textAlign: "center",
    transition: "all 0.5s ease",
    boxShadow: "var(--portal-card-shadow)",
    [theme.breakpoints.down("xs")]: {
      padding: "32px 20px",
    },
    "&:hover": {
      transform: "translateY(-8px)",
      borderColor: "var(--portal-primary)",
      boxShadow: "0 20px 40px rgba(255, 90, 90, 0.15)",
    },
    "& h3": {
      fontSize: "2.6rem", // More professional size
      fontWeight: 900,
      color: "var(--portal-primary)",
      marginBottom: "8px",
      [theme.breakpoints.down("sm")]: {
          fontSize: "2.2rem",
      }
    },
    "& p": {
      fontSize: "0.8rem",
      color: "var(--portal-muted)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
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
    [theme.breakpoints.down("sm")]: {
      padding: "40px 16px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "28px 12px",
    },
  },

  // ===== DEMANDES PREMIUM =====
  sectionDeepDark: {
    padding: "100px 20px",
    position: "relative",
    background: "#0a0e17", // Very dark navy/black
    color: "#ffffff",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "0",
      width: "100%",
      height: "200%",
      background: "radial-gradient(ellipse at 50% 0%, rgba(255, 90, 90, 0.08) 0%, transparent 60%)",
      pointerEvents: "none",
    }
  },
  sectionTitleLight: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 900,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "-0.04em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    "& span": {
       display: "inline-block",
       width: "14px",
       height: "14px",
       borderRadius: "50%",
       background: "#ff5a5a",
       boxShadow: "0 0 16px #ff5a5a",
       animation: "$pulseRed 2s infinite",
    }
  },
  sectionSubtitleLight: {
    fontSize: "clamp(1rem, 2vw, 1.15rem)",
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginBottom: "56px",
    maxWidth: "750px",
    margin: "0 auto 56px",
    lineHeight: 1.6,
  },
  demandCardPremium: {
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "36px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    "&::before": {
       content: '""',
       position: "absolute",
       top: 0,
       left: 0,
       width: "100%",
       height: "4px",
       background: "linear-gradient(90deg, #ff5a5a 0%, #ff8a8a 100%)",
       transform: "scaleX(0)",
       transformOrigin: "left",
       transition: "transform 0.5s ease",
    },
    "&:hover": {
      transform: "translateY(-10px)",
      borderColor: "rgba(255, 90, 90, 0.3)",
      boxShadow: "0 20px 50px rgba(255, 90, 90, 0.15)",
      background: "rgba(255, 255, 255, 0.04)",
      "&::before": {
         transform: "scaleX(1)",
      },
      "& $viewMoreButtonPremium": {
         background: "linear-gradient(135deg, #ff5a5a 0%, #ff8a8a 100%)",
         color: "#ffffff",
         borderColor: "transparent",
         transform: "translateX(5px)",
      }
    },
  },
  demandTitlePremium: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: "16px",
    lineHeight: 1.4,
  },
  demandRefPremium: {
    background: "rgba(255, 90, 90, 0.1)",
    color: "#ff8a8a",
    padding: "6px 14px",
    borderRadius: "100px",
    fontSize: "0.75rem",
    fontWeight: 700,
    marginBottom: "20px",
    display: "inline-block",
    border: "1px solid rgba(255, 90, 90, 0.2)",
    alignSelf: "flex-start",
  },
  demandDescriptionPremium: {
    color: "rgba(255,255,255,0.5)",
    fontSize: "1rem",
    lineHeight: 1.7,
    marginBottom: "32px",
    flexGrow: 1,
  },
  viewMoreButtonPremium: {
    padding: "12px 28px",
    background: "transparent",
    color: "#ff5a5a",
    borderRadius: "12px",
    fontWeight: 800,
    fontSize: "0.9rem",
    border: "1px solid rgba(255, 90, 90, 0.3)",
    cursor: "pointer",
    transition: "all 0.4s ease",
    marginTop: "auto",
    width: "fit-content",
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
    [theme.breakpoints.down("sm")]: {
      padding: "40px 16px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "28px 12px",
    },
  },

  ctaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "1fr",
      gap: "24px",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gap: "16px",
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
    borderRadius: "28px",
    overflow: "hidden",
    border: "1px solid rgba(128,128,128,0.15)",
    background: "var(--portal-surface)",
    padding: "0",
    position: "relative",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
    "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: 0.85,
        transition: "transform 10s ease",
    },
    "&:hover img": {
        transform: "scale(1.15)",
        opacity: 1,
    }
  },
  "@keyframes pulseRed": {
    "0%": { opacity: 1, transform: "scale(1)" },
    "50%": { opacity: 0.4, transform: "scale(0.8)" },
    "100%": { opacity: 1, transform: "scale(1)" }
  }
}));

// Slider arrows
function SampleNextArrow(props) {
  const { style, onClick, className } = props;
  const isMobile = window.innerWidth < 768;
  if (isMobile) return null;
  return (
    <div className={className} style={{
      ...style, display: "flex", alignItems: "center", justifyContent: "center",
      width: "48px", height: "48px", borderRadius: "50%",
      background: "var(--portal-surface)", border: "1px solid var(--portal-border)",
      right: "-24px", zIndex: 10, color: "var(--portal-text)",
    }} onClick={onClick}>
      <Icon style={{ fontSize: 20 }}>arrow_forward_ios</Icon>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { style, onClick, className } = props;
  const isMobile = window.innerWidth < 768;
  if (isMobile) return null;
  return (
    <div className={className} style={{
      ...style, display: "flex", alignItems: "center", justifyContent: "center",
      width: "48px", height: "48px", borderRadius: "50%",
      background: "var(--portal-surface)", border: "1px solid var(--portal-border)",
      left: "-24px", zIndex: 10, color: "var(--portal-text)",
    }} onClick={onClick}>
      <Icon style={{ fontSize: 20, marginLeft: "6px" }}>arrow_back_ios</Icon>
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
          width: '100%', maxWidth: '800px', height: '600px',
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

      {/* ===================== BANNER ADS ===================== */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '32px 0', textAlign: 'center' }}>
        <Container maxWidth="xl">
          <a href="https://www.3findustrie.com" target="_blank" rel="noopener noreferrer" style={{ display: 'block', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <img 
              src="/assets/images/banner_3f_industrie2.png" 
              alt="Publicité 3F Industrie" 
              style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} 
            />
          </a>
        </Container>
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

      <section className={classes.sectionDeepDark}>
        <Container maxWidth="xl">
          <h2 className={classes.sectionTitleLight}>
            <span /> Dernières demandes de devis
          </h2>
          <p className={classes.sectionSubtitleLight}>
            Découvrez en temps réel les besoins de nos acheteurs certifiés et proposez vos meilleures offres.
          </p>

          <Grid container spacing={4}>
            {portail.loading ? (
              <ContentLoader speed={2} width={1200} height={200} viewBox="0 0 1200 200"
                style={{ width: '100%', height: 'auto', opacity: 0.1 }}>
                <rect x="0" y="0" rx="16" ry="16" width="380" height="180" />
                <rect x="400" y="0" rx="16" ry="16" width="380" height="180" />
                <rect x="800" y="0" rx="16" ry="16" width="380" height="180" />
              </ContentLoader>
            ) : (
              <FuseAnimateGroup enter={{ animation: 'transition.slideUpBigIn' }} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', margin: '-16px' }}>
                {portail.data && portail.data.slice(0, 6).map((item, index) => {
                  const countryMapping = {
                    "États-Unis": "us", Allemagne: "de", France: "fr",
                    Maroc: "ma", Espagne: "es", Italie: "it", "Royaume-Uni": "gb",
                  };
                  const code = countryMapping[item.pays] || null;

                  return (
                    <Grid item xs={12} md={6} lg={4} key={index} style={{ padding: '16px' }}>
                      <Link to={`/demandes-achat/${item.id}-${item.slug}`} style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                        <div className={classes.demandCardPremium}>
                          <span className={classes.demandRefPremium}>RFQ-{item.reference}</span>
                          <h3 className={classes.demandTitlePremium}>{item.titre}</h3>
                          <p className={classes.demandDescriptionPremium}>
                            {item.description.length > 130 ? item.description.slice(0, 130) + '…' : item.description}
                          </p>
                          <div className="flex items-center justify-between flex-wrap gap-16 mt-auto">
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
                                {code && (
                                  <img src={`https://flagcdn.com/w20/${code}.png`} alt={item.pays}
                                    style={{ width: '20px', height: '15px', borderRadius: '3px' }} />
                                )}
                                <span className="font-600 text-12">{item.ville}, {item.pays}</span>
                              </div>
                              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                Expire le {moment(item.dateExpiration).format('DD/MM/YYYY')}
                              </div>
                            </div>
                            <button className={classes.viewMoreButtonPremium}>Voir plus →</button>
                          </div>
                        </div>
                      </Link>
                    </Grid>
                  );
                })}
              </FuseAnimateGroup>
            )}
          </Grid>

          <Box className="text-center mt-64">
            <Link to="/demandes-achats" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" style={{
                borderRadius: '16px', padding: '16px 48px',
                borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff',
                fontWeight: 800, textTransform: 'none', fontSize: '1.1rem',
                backdropFilter: 'blur(10px)', transition: 'all 0.3s ease'
              }} onMouseOver={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#000000'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}>
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
