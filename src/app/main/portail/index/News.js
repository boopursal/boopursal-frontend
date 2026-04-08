import React from "react";
import PropTypes from "prop-types";
import { Typography, Card, CardActionArea, CardContent, CardActions, Button, CardMedia, Chip, Icon } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import _ from "@lodash";
import moment from "moment";
import { URL_SITE } from "@fuse/Constants";

const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    borderRadius: 24,
    background: "var(--portal-surface)",
    border: "1px solid var(--portal-border)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    boxShadow: "var(--portal-card-shadow)",
    "&:hover": {
      transform: "translateY(-8px)",
      borderColor: "var(--portal-primary)",
      background: "var(--portal-surface)",
      boxShadow: "0 20px 40px rgba(255, 90, 90, 0.15)",
      "& $media": {
        transform: "scale(1.05)",
      },
      "& $readMore": {
        color: "#ff8a8a",
        gap: 8,
      }
    },
  },
  mediaWrapper: {
    overflow: "hidden",
    position: "relative",
    height: 220,
    background: "var(--portal-bg)",
  },
  media: {
    height: "100%",
    width: "100%",
    transition: "transform 0.8s ease",
  },
  tag: {
    position: "absolute",
    top: 16,
    left: 16,
    background: "rgba(255, 90, 90, 0.15)",
    color: "#ff5a5a",
    fontWeight: 800,
    fontSize: "0.7rem",
    textTransform: "uppercase",
    padding: "6px 14px",
    borderRadius: "8px",
    boxShadow: "none",
    zIndex: 1,
  },
  cardContent: {
    padding: "28px 24px 16px",
    flexGrow: 1,
  },
  titre: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "var(--portal-text)",
    lineHeight: 1.4,
    letterSpacing: "-0.01em",
    height: "3.5em",
    overflow: "hidden",
    display: "-webkit-box",
    "-webkit-line-clamp": 2,
    "-webkit-box-orient": "vertical",
    marginBottom: 8,
    transition: "color 0.3s ease",
  },
  footer: {
    padding: "0 24px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--portal-muted)",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  readMore: {
    fontSize: "0.95rem",
    fontWeight: 800,
    color: "#ff5a5a",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.3s ease",
    "&:hover": {
      color: "#ff8a8a",
    }
  }
}));

export default function News(props) {
  const classes = useStyles();
  const { news } = props;

  if (!news) return null;

  return (
    <Card className={classes.card} elevation={0}>
      <CardActionArea component="a" href={`/actualite/${news.id}-${news.slug}`}>
        <div className={classes.mediaWrapper}>
          <div className={classes.tag}>Actualité</div>
          <CardMedia
            className={classes.media}
            image={news.image ? URL_SITE + "/images/actualite/" + news.image.url : "assets/images/ecommerce/product-placeholder.jpg"}
            title={news.titre}
          />
        </div>
        <CardContent className={classes.cardContent}>
          <Typography className={classes.titre}>
            {_.capitalize(news.titre)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <div className={classes.footer}>
        <div className={classes.date}>
          <Icon style={{ fontSize: 16 }}>calendar_today</Icon>
          {moment(news.created).format("DD MMM YYYY")}
        </div>
        <a href={`/actualite/${news.id}-${news.slug}`} className={classes.readMore}>
          Lire <Icon style={{ fontSize: 18 }}>arrow_forward</Icon>
        </a>
      </div>
    </Card>
  );
}

News.propTypes = {
  news: PropTypes.object,
};
