import React, { useState } from "react";
import { Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "app/auth/store/actions";
import { Link } from "react-router-dom";
import { URL_SITE } from "@fuse";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  userButton: {
    height: 52,
    borderRadius: 30,
    padding: '0 12px',
    background: 'transparent !important',
    border: 'none',
    transition: "all 0.2s ease",
    '&:hover': {
      background: 'var(--portal-nav-hover-bg) !important',
    }
  },
  avatar: {
    width: 32,
    height: 32,
    border: '2px solid var(--portal-border)',
    boxShadow: 'var(--portal-shadow)',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 800,
    color: 'var(--portal-text)',
    marginLeft: 12,
    textTransform: 'none'
  },
  connexionBtn: {
    background: 'linear-gradient(135deg, #ff5a5a 0%, #ff2a2a 100%) !important',
    color: '#ffffff !important',
    borderRadius: '30px',
    padding: '10px 28px',
    fontWeight: 800,
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    boxShadow: '0 4px 15px rgba(255, 90, 90, 0.3) !important',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(255, 90, 90, 0.5) !important',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff3b3b 100%) !important',
    }
  }
}));

function UserMenu() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => setUserMenu(event.currentTarget);
  const userMenuClose = () => setUserMenu(null);

  if (!user.role || user.role.length === 0) {
    return (
        <Button component={Link} to="/login" className={classes.connexionBtn}>
            Connexion
        </Button>
    )
  }

  return (
    <React.Fragment>
      <Button className={classes.userButton} onClick={userMenuClick}>
        {user.data.photoURL ? (
          <Avatar className={classes.avatar} alt="user photo" src={URL_SITE + user.data.photoURL} />
        ) : (
          <Avatar className={classes.avatar}>
            <Icon className="text-16">person</Icon>
          </Avatar>
        )}

        <Typography className={clsx(classes.name, "hidden md:inline-block")}>
          {user.data.displayName}
        </Typography>
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          style: { 
            borderRadius: 16, 
            marginTop: 8, 
            minWidth: 220, 
            border: '1px solid var(--portal-border)', 
            boxShadow: 'var(--portal-shadow)',
            background: 'var(--portal-surface)',
            color: 'var(--portal-text)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <div className="p-8">
           <div className="px-16 py-8 border-b border-gray-100 mb-8">
               <Typography className="text-12 font-800 uppercase tracking-widest text-gray-400">Compte Admin</Typography>
           </div>
          <MenuItem component={Link} to="/dashboard" onClick={userMenuClose} style={{ borderRadius: 8, padding: '12px 16px' }}>
            <ListItemIcon style={{ minWidth: 40 }}><Icon className="text-18" style={{ color: 'var(--portal-text)' }}>dashboard</Icon></ListItemIcon>
            <ListItemText primary={<Typography style={{ fontWeight: 600, color: 'var(--portal-text)' }}>Tableau de bord</Typography>} />
          </MenuItem>

          <MenuItem
            onClick={() => {
              dispatch(authActions.logoutUser());
              userMenuClose();
            }}
            style={{ borderRadius: 8, padding: '12px 16px', color: '#f5365c' }}
          >
            <ListItemIcon style={{ minWidth: 40 }}><Icon className="text-18" style={{ color: '#f5365c' }}>exit_to_app</Icon></ListItemIcon>
            <ListItemText primary={<Typography style={{ fontWeight: 600 }}>Déconnexion</Typography>} />
          </MenuItem>
        </div>
      </Popover>
    </React.Fragment>
  );
}

export default UserMenu;
