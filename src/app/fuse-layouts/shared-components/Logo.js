import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        transition: 'all 0.3s ease-in-out',
        '& .logo-icon': {
            width: 32,
            height: 32,
            transition: theme.transitions.create(['width', 'height'], {
                duration: theme.transitions.duration.shortest,
                easing: theme.transitions.easing.easeInOut
            })
        },
        "& img": {
            height: 48,
            width: "auto",
            transition: 'all 0.3s ease'
        },
        "&.inverted img": {
            filter: 'brightness(0) invert(1)',
        }
    }
}));

function Logo({ inverted, folded }) {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, "flex items-center", inverted && "inverted")}>
            <Link to="/" className="flex items-center">
                {folded ? (
                    <img className="w-32 h-auto" src="assets/images/logos/icon.png" alt="Boopursal Icon" />
                ) : (
                    <img className="" src="assets/images/logos/logo.png" alt="Boopursal" />
                )}
            </Link>
        </div>
    );
}

export default Logo;
