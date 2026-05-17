import React, { useState, useEffect } from 'react';
import { Fab, Zoom, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: 30,
    left: 30,
    zIndex: 999,
    background: 'linear-gradient(135deg, #ff5a5a 0%, #ff2a2a 100%) !important',
    color: '#ffffff !important',
    boxShadow: '0 8px 25px rgba(255, 90, 90, 0.4) !important',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 35px rgba(255, 90, 90, 0.6) !important',
    }
  },
}));

function BackToTop() {
  const classes = useStyles();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we are scrolling on the main content or window
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      setVisible(scrollPos > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also check inside FuseScrollbars if possible, but window scroll is standard for portal
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // Fallback for Fuse layout which might use a custom scroll container
    const scrollContainer = document.querySelector('#fuse-layout .st');
    if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Zoom in={visible}>
      <Fab
        className={classes.root}
        onClick={scrollToTop}
        size="medium"
        aria-label="back to top"
      >
        <Icon>keyboard_arrow_up</Icon>
      </Fab>
    </Zoom>
  );
}

export default BackToTop;
