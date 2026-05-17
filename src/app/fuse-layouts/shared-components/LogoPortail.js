import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        transition: "all 0.3s ease",
        "&:hover": {
            transform: "scale(1.02)",
        },
        "& img": {
            height: 70, // Desktop height
            width: "auto",
            display: "block",
            transition: "all 0.3s ease",
            [theme.breakpoints.down("sm")]: {
                height: 48, // Mobile height
            }
        }
    },
}));

function LogoPortail() {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, "flex items-center")}>

            <Link to="/">
                <img className="" src="/assets/images/logos/logo_final_boopursal.png" alt="Boopursal LOGO" />
            </Link>

        </div>
    );
}

export default LogoPortail;
