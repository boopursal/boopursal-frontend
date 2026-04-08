import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
  Card,
  CardActionArea,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Chip,
  Icon,
} from "@material-ui/core";
import _ from "@lodash";
import moment from "moment";
import { URL_SITE } from "@fuse/Constants";
import "moment/locale/fr";

const useStyles = makeStyles((theme) => ({
  mediaNews: {
    height: 200,
    backgroundPosition: "center",
    backgroundSize: "cover", // ✅ meilleure option pour uniformiser les tailles
    backgroundRepeat: "no-repeat",
  },
  cardContent: {
    maxHeight: 102,
    minHeight: 102,
  },
  titre: {
    fontSize: "16px",
  },
}));

export default function News(props) {
  const classes = useStyles();
  const { news } = props;
  return (
    <Card className={classes.card}>
      <CardActionArea component="a" href={`/actualite/${news.id}-${news.slug}`}>
        <CardMedia
          className={classes.mediaNews}
          image={news.image ? URL_SITE + "/images/actualite/" + news.image.url : "assets/images/ecommerce/product-placeholder.jpg"}
          title={news.titre}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h6" className={classes.titre}>
            {_.capitalize(
              _.truncate(news.titre, {
                length: 45,
              })
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className="flex justify-between">
        <Chip
          icon={<Icon className="text-16 mr-0">access_time</Icon>}
          label={moment(news.created).fromNow()}
          classes={{
            root: "h-24",
            label: "pl-4 pr-6 py-4 text-11",
            deleteIcon: "w-16 ml-0",
            ...props.classes,
          }}
          variant="outlined"
          className="mr-4"
          onDelete={props.onDelete}
        />

        <Button size="small" color="primary">
          Lire la suite
        </Button>
      </CardActions>
    </Card>
  );
}

News.propTypes = {
  post: PropTypes.object,
};
