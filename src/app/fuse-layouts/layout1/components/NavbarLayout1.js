import React from 'react';
import { Hidden, Icon } from '@material-ui/core';
import clsx from 'clsx';
import Logo from 'app/fuse-layouts/shared-components/Logo';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#ffffff', // TailAdmin Light Sidebar
        color: '#1C2434',
        zIndex: 1000,
        fontFamily: 'Outfit, sans-serif'
    },
    logoBar: {
        backgroundColor: '#ffffff',
        height: 100,
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        padding: props => props.folded ? '0 16px' : '0 32px', // Reduce padding when folded
        justifyContent: props => props.folded ? 'center' : 'flex-start',
        zIndex: 10,
        transition: 'all 0.3s ease'
    },
    content: {
        overflowX: 'hidden',
        overflowY: 'auto',
        '-webkit-overflow-scrolling': 'touch',
        background: 'transparent',
    }
}));

function NavbarLayout1(props) {
    const classes = useStyles(props);

    return (
        <div className={clsx(classes.root, "flex flex-col h-full", props.className)}>

            {/* ARGON LOGO AREA - CLEAN & POSITIONED */}
            <div className={classes.logoBar}>
                <div className={clsx("flex flex-1 items-center", props.folded ? "justify-center" : "justify-center lg:justify-start")}>
                    <Logo inverted={false} folded={props.folded} />
                </div>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-32 h-32 p-0 text-slate-400">
                        <Icon>close</Icon>
                    </NavbarMobileToggleButton>
                </Hidden>
            </div>

            <div className={clsx(classes.content, "flex-1 overflow-x-hidden overflow-y-auto")}>
                <Navigation layout="vertical" />
            </div>

            {/* TAILADMIN FOOTER BRANDING */}
            <div className={clsx("p-24 border-t border-[#f1f5f9] flex items-center gap-12", props.folded ? "justify-center" : "justify-center")}>
                <Icon className="text-16 text-[#3c50e0]">stars</Icon>
                {!props.folded && (
                    <div className="text-10 font-800 uppercase text-[#64748b] tracking-[.15em]">
                        Boopursal Engine V3
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavbarLayout1;
