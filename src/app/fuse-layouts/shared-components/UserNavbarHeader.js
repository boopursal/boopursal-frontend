import React from "react";
import { Avatar, Typography, Box } from "@material-ui/core";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { URL_SITE } from "@fuse/Constants";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2),
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative'
  },
  avatarContainer: {
    position: 'relative',
    padding: 3,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #11cdef 0, #1171ef 100%)',
    boxShadow: '0 8px 16px -4px rgba(17, 205, 239, 0.4)',
    marginBottom: 16,
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '0 12px 20px -4px rgba(17, 205, 239, 0.5)',
    }
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    border: '4px solid #ffffff',
    backgroundColor: '#f6f9fc',
    fontSize: '2rem',
    fontWeight: 800,
    color: '#32325d',
    "& > img": {
      borderRadius: "50%",
    },
  },
  displayName: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#32325d',
    letterSpacing: '-0.025em',
    marginBottom: 2,
    lineHeight: 1.2
  },
  email: {
    fontFamily: 'Open Sans, sans-serif',
    fontSize: '0.85rem',
    fontWeight: 400,
    color: '#8898aa',
    marginBottom: 20
  },
  badge: {
    padding: '6px 14px',
    background: '#f6f9fc',
    border: '1px solid #e9ecef',
    borderRadius: 100,
    color: '#5e72e4',
    fontSize: '0.7rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'inline-flex',
    alignItems: 'center'
  }
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ auth }) => auth.user);
  const classes = useStyles();

  if (!user || !user.data) return null;

  return (
    <div className={classes.root}>
      <div className={classes.avatarContainer}>
        <Avatar
          className={classes.avatar}
          alt="User"
          src={
            user.data.photoURL && user.data.photoURL !== ""
              ? URL_SITE + user.data.photoURL
              : "assets/images/avatars/profile.jpg"
          }
        >
          {user.data.displayName ? user.data.displayName[0] : 'B'}
        </Avatar>
      </div>
      
      <Typography className={classes.displayName}>
        {user.data.displayName || 'Compte Admin'}
      </Typography>
      
      <Typography className={classes.email}>
        {user.data.email || 'admin@boopursal.com'}
      </Typography>

      <div className={classes.badge}>
        {user.role && user.role.toString().toUpperCase().includes('ADMIN')
          ? 'Administrateur'
          : user.role && user.role.toString().toUpperCase().includes('ACHETEUR')
            ? 'Acheteur Pro'
            : 'Fournisseur'}
      </div>
    </div>
  );
}

export default UserNavbarHeader;
