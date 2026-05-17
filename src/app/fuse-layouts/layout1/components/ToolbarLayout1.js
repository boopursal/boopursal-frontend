import React, { useState } from 'react';
import { AppBar, Hidden, Toolbar, Typography, Icon, InputBase, Drawer, IconButton } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { FuseSearch } from '@fuse';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'var(--portal-surface) !important',
        boxShadow: 'none !important',
        borderBottom: '1px solid var(--portal-border)',
        position: 'relative',
        zIndex: 999,
        width: '100%',
        color: 'var(--portal-text) !important'
    },
    toolbar: {
        padding: '0.5rem 2rem !important',
        minHeight: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        [theme.breakpoints.down('sm')]: {
            padding: '0.5rem 1rem !important',
            minHeight: 64,
        },
    },
    pageTitle: {
        fontSize: '1.25rem',
        fontWeight: 700,
        color: 'var(--portal-text)',
        marginRight: 'auto',
        textTransform: 'none',
        letterSpacing: 'normal'
    },
    searchPill: {
        background: 'var(--portal-bg)',
        borderRadius: 8,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: 300,
        transition: 'all 0.3s',
        border: '1px solid transparent',
        '&:focus-within': {
            background: '#ffffff',
            borderColor: 'var(--portal-primary)',
            '& .MuiIcon-root, & input': {
                color: 'var(--portal-text)'
            }
        }
    },
    searchInput: {
        flex: 1,
        color: 'var(--portal-text)',
        fontSize: '0.875rem',
        fontWeight: 500
    },
    mobileSearchIcon: {
        color: 'var(--portal-text)',
        marginLeft: 'auto',
        marginRight: 8,
    },
}));

function ToolbarLayout1(props) {
    const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
    const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
    const classes = useStyles(props);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    
    const isAuthPage = window.location.pathname.startsWith("/login") || window.location.pathname.startsWith("/register");
    if (isAuthPage) {
        return null;
    }

    return (
        <ThemeProvider theme={toolbarTheme}>
            <AppBar id="fuse-toolbar" className={clsx(classes.root, "flex z-10")} color="default">
                <Toolbar className={classes.toolbar}>

                    <NavbarMobileToggleButton className="mr-4 lg:mr-6" />

                    <Typography className={clsx(classes.pageTitle, "hidden md:flex")}>
                        {/* Empty or can be Global Title */}
                    </Typography>

                    {/* Desktop search pill */}
                    <div className={clsx(classes.searchPill, "hidden lg:flex ml-auto mr-16")}>
                        <Icon className="text-18 text-[#64748b]">search</Icon>
                        <InputBase
                            placeholder="Type to search..."
                            className={classes.searchInput}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div>

                    {/* Mobile search icon button */}
                    <Hidden lgUp>
                        <IconButton
                            className={classes.mobileSearchIcon}
                            aria-label="Rechercher"
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            size="small"
                        >
                            <Icon style={{ fontSize: 22 }}>search</Icon>
                        </IconButton>
                    </Hidden>

                    <div className="flex items-center">
                        <UserMenu />
                    </div>
                </Toolbar>

                {/* Mobile search expandable bar */}
                {mobileSearchOpen && (
                    <div style={{
                        padding: '8px 16px 12px',
                        borderTop: '1px solid var(--portal-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: 'var(--portal-surface)',
                    }}>
                        <Icon style={{ color: 'var(--portal-muted)', fontSize: 20 }}>search</Icon>
                        <InputBase
                            autoFocus
                            placeholder="Rechercher..."
                            style={{ flex: 1, fontSize: '0.9rem', color: 'var(--portal-text)' }}
                            inputProps={{ 'aria-label': 'Rechercher sur mobile' }}
                        />
                        <IconButton size="small" onClick={() => setMobileSearchOpen(false)}>
                            <Icon style={{ fontSize: 18 }}>close</Icon>
                        </IconButton>
                    </div>
                )}
            </AppBar>
        </ThemeProvider>
    );
}

export default ToolbarLayout1;
