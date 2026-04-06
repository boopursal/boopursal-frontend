import React from "react";
import { AppBar, Hidden, Toolbar, Typography, Button, IconButton } from "@material-ui/core";
import { Brightness4 } from "@material-ui/icons";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import clsx from "clsx";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import LogoPortail from "app/fuse-layouts/shared-components/LogoPortail";
import { useSelector } from "react-redux";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import history from "@history";
import Search from "../../../main/portail/Search/Search";
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
    color: "var(--portal-nav-link)",
    textDecoration: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    "&:hover": {
      color: "var(--portal-primary)",
      background: "transparent", // Clean hover
    },
    "&.active": {
      color: "var(--portal-primary)",
      background: "transparent", // Clean active
      position: 'relative',
      "&:after": {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '25%',
        height: '3px',
        background: 'var(--portal-primary)',
        borderRadius: '5px'
      }
    }
  },
  searchWrapper: {
    width: "100%",
    maxWidth: 320,
    marginRight: "24px",
  },
  userMenuWrapper: {
    display: "flex",
    alignItems: "center",
    width: 'auto', // Dynamic width
    minWidth: 180,
    justifyContent: "flex-end",
  }
}));

function ToolbarLayout3(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const path = history.location.pathname;
  const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

  const isHome = path === "/" || path === "/portail";
  const classes = useStyles({ isHome });

  if (isAuthPage) {
    return null;
  }

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar id="fuse-toolbar" className={classes.root} position="sticky" color="default" elevation={0}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.logoWrapper}>
            {/* Show toggle button only if navbar is enabled or on mobile */}
            <Hidden lgUp>
              <NavbarMobileToggleButton className="mr-8" />
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
              <Link
                to="/faq"
                className={clsx(classes.navLink, path === "/faq" && "active")}
              >
                Centre d'aide
              </Link>
            </div>
          </Hidden>

          <div className={classes.userMenuWrapper}>
            {!isHome && (
              <div className={classes.searchWrapper}>
                <Hidden xsDown>
                  <Search variant="basic" />
                </Hidden>
              </div>
            )}
            <UserMenu />
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default ToolbarLayout3;
