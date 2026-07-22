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

  // ===== DEMANDES PREMIUM LIGHT =====
  sectionDeepDark: {
    padding: "100px 20px",
    position: "relative",
    background: "linear-gradient(180deg, #ffffff 0%, #f4f7f9 100%)",
    color: "var(--portal-text)",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "radial-gradient(circle at 80% 20%, rgba(255, 90, 90, 0.04) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.04) 0%, transparent 40%)",
      pointerEvents: "none",
    }
  },
  sectionTitleLight: {
    fontSize: "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 900,
    color: "#0f172a",
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "-0.04em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    "& span": {
       display: "inline-block",
       width: "12px",
       height: "12px",
       borderRadius: "50%",
       background: "#ff5a5a",
       boxShadow: "0 0 12px rgba(255, 90, 90, 0.6)",
       animation: "$pulseRed 2s infinite",
    }
  },
  sectionSubtitleLight: {
    fontSize: "clamp(1rem, 2vw, 1.15rem)",
    color: "#64748b",
    textAlign: "center",
    maxWidth: "750px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  demandCardPremium: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
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
       opacity: 0,
       transition: "opacity 0.4s ease",
    },
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      borderColor: "rgba(255, 90, 90, 0.2)",
      "&::before": {
         opacity: 1,
      },
      "& $viewMoreButtonPremium": {
         color: "#ff5a5a",
         transform: "translateX(4px)",
      }
    },
  },
  demandTitlePremium: {
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "16px",
    lineHeight: 1.4,
  },
  demandRefPremium: {
    background: "rgba(255, 90, 90, 0.08)",
    color: "#e11d48",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: 700,
    display: "inline-block",
  },
  demandDescriptionPremium: {
    color: "#475569",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    marginBottom: "24px",
    flexGrow: 1,
  },
  viewMoreButtonPremium: {
    color: "#94a3b8",
    fontWeight: 700,
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
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
          <div className="flex flex-col items-center justify-center text-center mb-64">
            <span style={{ 
                background: 'rgba(255, 90, 90, 0.1)', color: '#ff5a5a', padding: '8px 16px', 
                borderRadius: '100px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px',
                display: 'inline-flex', alignItems: 'center', gap: '8px' 
            }}>
                <span style={{ width: '8px', height: '8px', background: '#ff5a5a', borderRadius: '50%', animation: 'pulseRed 2s infinite' }} />
                EN TEMPS RÉEL
            </span>
            <h2 className={classes.sectionTitleLight} style={{ marginBottom: '16px' }}>
              Dernières demandes de devis
            </h2>
            <p className={classes.sectionSubtitleLight} style={{ margin: 0 }}>
              Découvrez les besoins de nos acheteurs certifiés et proposez vos meilleures offres.
            </p>
          </div>

          <Grid container spacing={4} alignItems="stretch">
            {portail.loading ? (
              <Grid item xs={12}>
                <div style={{ width: '100%', height: '200px' }}>
                  <ContentLoader speed={2} width={1200} height={200} viewBox="0 0 1200 200"
                    style={{ width: '100%', height: 'auto', opacity: 0.2 }}>
                    <rect x="0" y="0" rx="16" ry="16" width="380" height="180" />
                    <rect x="400" y="0" rx="16" ry="16" width="380" height="180" />
                    <rect x="800" y="0" rx="16" ry="16" width="380" height="180" />
                  </ContentLoader>
                </div>
              </Grid>
            ) : (
              portail.data && portail.data.slice(0, 6).map((item, index) => {
                const countryMapping = {
                  "États-Unis": "us", Allemagne: "de", France: "fr",
                  Maroc: "ma", Espagne: "es", Italie: "it", "Royaume-Uni": "gb",
                };
                const code = countryMapping[item.pays] || null;

                return (
                  <Grid item xs={12} md={6} lg={4} key={index} style={{ display: 'flex' }}>
                    <FuseAnimate animation="transition.slideUpIn" delay={100 * index} style={{ width: '100%' }}>
                      <Link to={`/demandes-achat/${item.id}-${item.slug}`} style={{ textDecoration: 'none', width: '100%' }}>
                        <div className={classes.demandCardPremium}>
                          <div className="flex justify-between items-start mb-16">
                              <span className={classes.demandRefPremium}>RFQ-{item.reference}</span>
                              <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '12px', color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>
                                <Icon style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '4px' }}>timer</Icon>
                                {moment(item.dateExpiration).format('DD/MM/YYYY')}
                              </div>
                          </div>
                          
                          <h3 className={classes.demandTitlePremium}>{item.titre}</h3>
                          <p className={classes.demandDescriptionPremium}>
                            {item.description.length > 120 ? item.description.slice(0, 120) + '…' : item.description}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-24" style={{ borderTop: '1px solid #f1f5f9' }}>
                            <div className="flex items-center gap-8" style={{ color: '#475569' }}>
                              {code && <img src={`https://flagcdn.com/w20/${code}.png`} alt={item.pays} style={{ width: '20px', borderRadius: '2px' }} />}
                              <span className="font-600 text-13">{item.ville}, {item.pays}</span>
                            </div>
                            <div className={classes.viewMoreButtonPremium}>
                                Voir plus <Icon style={{ fontSize: '16px', marginLeft: '4px', verticalAlign: 'middle' }}>arrow_forward</Icon>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </FuseAnimate>
                  </Grid>
                );
              })
            )}
          </Grid>

          <Box className="text-center mt-64">
            <Link to="/demandes-achats" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" style={{
                borderRadius: '16px', padding: '16px 48px',
                borderColor: 'rgba(0,0,0,0.1)', color: '#0f172a',
                fontWeight: 800, textTransform: 'none', fontSize: '1.1rem',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }} onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}>
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
