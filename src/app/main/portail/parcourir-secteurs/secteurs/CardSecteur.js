import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Typography,
  Icon,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { URL_SITE } from "@fuse/Constants";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
    border: '1px solid #f1f5f9',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      borderColor: theme.palette.primary.main
    }
  },
  actionArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  header: {
    minHeight: 72,
    padding: theme.spacing(3),
    backgroundColor: '#fff'
  },
  media: {
    height: 180,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  title: {
    color: '#0f172a',
    fontSize: '1rem',
    lineHeight: 1.4,
    fontWeight: 800,
    height: '2.8em',
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2, 3),
    borderTop: '1px solid #f8fafc',
    backgroundColor: '#fff'
  },
  viewText: {
    fontSize: '0.75rem',
    fontWeight: 900,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  }
}));

export default function CardSecteur(props) {
  const classes = useStyles();
  const { secteur } = props;
  const targetUrl = `/annuaire-entreprises/${secteur.id}-${secteur.slug}`;

  // Reliable placeholder for business/industrial sectors
  const defaultImage = "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=60";

  return (
    <Card className={classes.root} elevation={0}>
      <CardActionArea
        className={classes.actionArea}
        component={Link}
        to={targetUrl}
      >
        <div className={classes.header}>
          <Typography className={classes.title}>
            {secteur.name}
          </Typography>
        </div>

        <CardMedia
          className={classes.media}
          image={
            secteur.url
              ? URL_SITE + "/images/secteur/" + secteur.url
              : defaultImage
          }
          title={secteur.name}
        />

        <div className={classes.cardActions}>
          <span className={classes.viewText}>
            Explorer le secteur
          </span>
          <Icon size="small" style={{ color: '#cbd5e1' }}>arrow_forward</Icon>
        </div>
      </CardActionArea>
    </Card>
  );
}
