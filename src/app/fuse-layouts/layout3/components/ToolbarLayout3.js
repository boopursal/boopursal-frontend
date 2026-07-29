import React, { useState } from "react";
import { AppBar, Hidden, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@material-ui/core";
import { Brightness4 } from "@material-ui/icons";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import clsx from "clsx";
import { Menu, Close } from "@material-ui/icons";
import LogoPortail from "app/fuse-layouts/shared-components/LogoPortail";
import { useSelector } from "react-redux";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import LanguageSwitcher from "app/fuse-layouts/shared-components/LanguageSwitcher";
import history from "@history";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  root: {
    background: "var(--portal-header-bg) !important",
    backdropFilter: "saturate(180%) blur(20px)",
    WebkitBackdropFilter: "saturate(180%) blur(20px)",
    color: "var(--portal-text)",
    boxShadow: "var(--portal-shadow) !important",
    borderBottom: "1px solid var(--portal-border)",
    zIndex: 1100,
    transition: "all 0.3s ease",
  },
  toolbar: {
    padding: "0 40px",
    height: 100, // Reduced from 110 for better proportion
    maxWidth: 1440, // Reduced from 1600 to avoid "stretched" look on ultra-wide screens
    margin: "0 auto",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px", // Added gap between main sections
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px",
      height: 72,
    },
  },
  logoWrapper: {
    width: 'auto', // Dynamic width instead of fixed 280
    minWidth: 180,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px", // Space for the toggle button
    "& img": {
      height: 70, // Consistent with LogoPortail.js
      width: "auto"
    }
  },
  navWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center", 
    gap: "4px", 
    flex: 1,
    padding: "0 20px",
  },
  "@keyframes borderGlow": {
    "0%, 100%": {
      boxShadow: "0 0 0 0 rgba(245, 166, 35, 0.0), inset 0 0 0 0 rgba(245, 166, 35, 0)"
    },
    "50%": {
      boxShadow: "0 0 20px 4px rgba(245, 166, 35, 0.25), inset 0 0 0 0 rgba(245, 166, 35, 0)"
    }
  },
  pulseButton: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    animation: "$borderGlow 2.4s ease-in-out infinite",
    background: "#1C2434", // Marine profond — couleur principale du logo
    color: "#F5A623",      // Doré — couleur accent du logo
    fontWeight: 800,
    fontSize: "0.88rem",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    borderRadius: "12px",
    padding: "10px 22px",
    marginRight: "12px",
    border: "1.5px solid #F5A623",
    boxShadow: "0 4px 16px rgba(28, 36, 52, 0.2)",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    // Trait doré vertical à gauche (accent)
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "20%",
      bottom: "20%",
      width: 3,
      borderRadius: "0 2px 2px 0",
      background: "#F5A623",
      transition: "all 0.3s ease"
    },
    "&:hover": {
      background: "#F5A623",
      color: "#1C2434",
      borderColor: "#F5A623",
      textDecoration: "none",
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(245, 166, 35, 0.4)",
      "&::before": {
        background: "#1C2434"
      }
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: 0,
      marginBottom: "16px",
      width: "100%",
      padding: "16px",
      fontSize: "0.9rem",
      borderRadius: "12px",
      justifyContent: "center"
    }
  },
  navLink: {
    fontSize: "1.4rem", // Restored and enlarged text size
    fontWeight: 600,
    color: "#475569", 
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    "&:hover": {
      color: "#0f172a", 
      background: "rgba(15, 23, 42, 0.04)", 
    },
    "&.active": {
      color: "var(--portal-primary)",
      fontWeight: 800,
      background: "transparent",
      position: 'relative',
      "&:after": {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '15%',
        right: '15%',
        height: '3px',
        background: 'var(--portal-primary)',
        borderRadius: '5px'
      }
    }
  },
  userMenuWrapper: {
    display: "flex",
    alignItems: "center",
    width: 'auto', // Dynamic width
    minWidth: 180,
    justifyContent: "flex-end",
  },
  mobileNav: {
    width: 280,
    padding: "20px",
    background: "var(--portal-bg)",
    height: "100%",
    color: "var(--portal-text)",
  },
  mobileNavLink: {
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "8px",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--portal-text)",
    transition: "all 0.2s ease",
    "&.active": {
      background: "rgba(255, 90, 90, 0.1)",
      color: "var(--portal-primary)",
    }
  }
}));

function ToolbarLayout3(props) {
  const { t } = useTranslation();
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ auth }) => auth.user);
  const path = history.location.pathname;
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register") || path.startsWith("/forgot-password");

  const isHome = path === "/" || path === "/portail";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const classes = useStyles({ isHome });

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className={classes.root} position="sticky" color="default" elevation={0}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoWrapper}>
            <Hidden mdUp>
              <IconButton 
                className="mr-8" 
                onClick={() => setMobileDrawerOpen(true)}
                style={{ color: 'var(--portal-text)' }}
              >
                <Menu />
              </IconButton>
            </Hidden>
            <LogoPortail />
          </div>

          <Hidden mdDown>
            <div className={classes.navWrapper}>
              <Link
                to="/"
                className={clsx(classes.navLink, (path === "/" || path === "/portail") && "active")}
              >
                {t('common.home', 'Accueil')}
              </Link>
              <Link
                to="/annuaire-entreprises"
                className={clsx(classes.navLink, path === "/annuaire-entreprises" && "active")}
              >
                {t('common.sectors', 'Secteurs')}
              </Link>
              <Link
                to="/vente-produits"
                className={clsx(classes.navLink, path === "/vente-produits" && "active")}
              >
                {t('common.products', 'Produits')}
              </Link>
              <Link
                to="/entreprises"
                className={clsx(classes.navLink, path.startsWith("/entreprise") && "active")}
              >
                {t('common.companies', 'Entreprises')}
              </Link>
              <Link
                to="/tarifs/plans"
                className={clsx(classes.navLink, path === "/tarifs/plans" && "active")}
              >
                {t('common.pricing', 'Tarifs')}
              </Link>
              <Link
                to="/actualites"
                className={clsx(classes.navLink, path === "/actualites" && "active")}
              >
                {t('common.news', 'Actualités')}
              </Link>
            </div>
          </Hidden>

          <div className={classes.userMenuWrapper}>
            <Hidden smDown>
              <Button component={Link} to="/register/1" className={classes.pulseButton}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                {t('start_free', 'Commencez gratuitement')}
              </Button>
              <LanguageSwitcher />
              <UserMenu />
            </Hidden>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <div className={classes.mobileNav}>
          <div className="flex items-center justify-between mb-32 px-10">
            <LogoPortail />
            <IconButton onClick={() => setMobileDrawerOpen(false)} style={{ color: 'var(--portal-text)' }}>
              <Close />
            </IconButton>
          </div>
          <List>
            {[
              { label: t('common.home', 'Accueil'), to: "/" },
              { label: t('common.sectors', 'Secteurs'), to: "/annuaire-entreprises" },
              { label: t('common.products', 'Produits'), to: "/vente-produits" },
              { label: t('common.companies', 'Entreprises'), to: "/entreprises" },
              { label: t('common.pricing', 'Tarifs'), to: "/tarifs/plans" },
              { label: t('common.news', 'Actualités'), to: "/actualites" },
            ].map((link) => (
              <ListItem
                button
                component={Link}
                to={link.to}
                key={link.to}
                onClick={() => setMobileDrawerOpen(false)}
                className={clsx(classes.mobileNavLink, (path === link.to || (link.to === "/" && isHome)) && "active")}
              >
                <ListItemText 
                   primary={link.label} 
                   primaryTypographyProps={{ style: { fontWeight: 700, fontSize: '1.2rem' } }} 
                />
              </ListItem>
            ))}
          </List>

          <div className="flex justify-center my-16">
              <LanguageSwitcher />
          </div>

          {!user.role || user.role.length === 0 ? (
            <Box className="mt-24 px-10">
              <Button
                component={Link}
                to="/register/1"
                fullWidth
                variant="contained"
                className={classes.pulseButton}
                onClick={() => setMobileDrawerOpen(false)}
              >
                {t('start_free', 'Commencez gratuitement')}
              </Button>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="contained"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  background: 'linear-gradient(135deg, #ff5a5a 0%, #ff2a2a 100%)',
                  color: '#ffffff',
                  borderRadius: '16px',
                  padding: '16px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 20px rgba(255, 90, 90, 0.3)',
                  textTransform: 'none'
                }}
              >
                {t('auth.login', 'Se connecter')}
              </Button>
            </Box>
          ) : (
            <Box className="mt-24 px-10">
              <Button
                component={Link}
                to="/mydashboard"
                fullWidth
                variant="outlined"
                onClick={() => setMobileDrawerOpen(false)}
                style={{
                  borderColor: 'var(--portal-primary)',
                  color: 'var(--portal-primary)',
                  borderRadius: '16px',
                  padding: '14px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none'
                }}
              >
                {t('nav.dashboard', 'Tableau de bord')}
              </Button>
            </Box>
          )}
        </div>
      </Drawer>
    </ThemeProvider>
  );
}

export default ToolbarLayout3;
