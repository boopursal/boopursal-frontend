import React, { useState } from "react";
import { AppBar, Hidden, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box } from "@material-ui/core";
import { Brightness4 } from "@material-ui/icons";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import clsx from "clsx";
import { Menu, Close } from "@material-ui/icons";
import LogoPortail from "app/fuse-layouts/shared-components/LogoPortail";
import { useSelector } from "react-redux";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import history from "@history";
import { Link } from "react-router-dom";

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
  navLink: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#1e293b", // Slate 800 - Very dark for high visibility
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    "&:hover": {
      color: "#0f172a", // Slate 900
      background: "rgba(15, 23, 42, 0.04)", // Light gray hover background
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
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const user = useSelector(({ auth }) => auth.user);
  const path = history.location.pathname;
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

  const isHome = path === "/" || path === "/portail";
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const classes = useStyles({ isHome });

  if (isAuthPage) {
    return null;
  }

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
                Accueil
              </Link>
              <Link
                to="/annuaire-entreprises"
                className={clsx(classes.navLink, path === "/annuaire-entreprises" && "active")}
              >
                Secteurs
              </Link>
              <Link
                to="/vente-produits"
                className={clsx(classes.navLink, path === "/vente-produits" && "active")}
              >
                Produits
              </Link>
              <Link
                to="/entreprises"
                className={clsx(classes.navLink, path.startsWith("/entreprise") && "active")}
              >
                Entreprises
              </Link>
              <Link
                to="/tarifs/plans"
                className={clsx(classes.navLink, path === "/tarifs/plans" && "active")}
              >
                Tarifs
              </Link>
              <Link
                to="/actualites"
                className={clsx(classes.navLink, path === "/actualites" && "active")}
              >
                Actualités
              </Link>
            </div>
          </Hidden>

          <div className={classes.userMenuWrapper}>
            <Hidden smDown>
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
              { label: "Accueil", to: "/" },
              { label: "Secteurs", to: "/annuaire-entreprises" },
              { label: "Produits", to: "/vente-produits" },
              { label: "Entreprises", to: "/entreprises" },
              { label: "Tarifs", to: "/tarifs/plans" },
              { label: "Actualités", to: "/actualites" },
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

          {!user.role || user.role.length === 0 ? (
            <Box className="mt-24 px-10">
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
                Se connecter
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
                Tableau de bord
              </Button>
            </Box>
          )}
        </div>
      </Drawer>
    </ThemeProvider>
  );
}

export default ToolbarLayout3;
