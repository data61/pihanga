/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable no-trailing-spaces */
import React from 'react';
//import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Card as PiCard, PiPropTypes } from '@pihanga/core';

import styled from './muiCard.style';

export const MuiCard = styled(({
  cardName,
  title,
  subTitle,
  titleAvatar,
  titleMedia, // {image, title}
  content, // ["para1, "para2"]
  contentCard,
  grid = {},
  mui = {},
  classes,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function addHeader() {
    const h = { title: title || '???' };
    if (subTitle) {
      h.subheader = subTitle;
    }
    if (titleAvatar) {
      h.avatar = (
        <Avatar aria-label="???" className={classes.avatar} {...(mui.titleAvatar || {})}>
          {titleAvatar}
        </Avatar>
      );
    }
    // h.action = (
    //   <IconButton aria-label="settings">
    //     <MoreVertIcon />
    //   </IconButton>
    // )
    return (
      <CardHeader {...h} {...(mui.header || {})} />
    );
  }

  function addMedia() {
    if (titleMedia) {
      return (
        <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />
      );
    } else {
      return null;
    }
  }

  function addParagraph(text, idx) {
    return (
      <Typography paragraph key={idx} >
        {text}
      </Typography>
    );
  }

  function addContent() {
    if (contentCard) {
      return (
        <PiCard cardName={contentCard} parentCard={cardName} />
      );
    } else {
      const ca = content || ['Missing \'content\''];
      return (
        <CardContent>
          { ca.map(addParagraph) }
        </CardContent>
      );
    }
  }

  function addActions() {
    return null;

    // if (false) {
    //   return (
    //     <CardActions disableSpacing>
    //       <IconButton aria-label="add to favorites">
    //         <FavoriteIcon />
    //       </IconButton>
    //       <IconButton aria-label="share">
    //         <ShareIcon />
    //       </IconButton>
    //       <IconButton
    //         className={clsx(classes.expand, {
    //           [classes.expandOpen]: expanded,
    //         })}
    //         onClick={handleExpandClick}
    //         aria-expanded={expanded}
    //         aria-label="show more"
    //       >
    //         <ExpandMoreIcon />
    //       </IconButton>
    //     </CardActions>
    //   );
    // } else {
    //   return null;
    // }
  }

  return (
    <Grid item {...grid} className={classes.outer}>
      <Card className={classes.card}>
        { addHeader() }
        { addMedia() }
        { addContent() }
        { addActions() }
      </Card>
    </Grid>
  );
});

MuiCard.propTypes = {
  title: PiPropTypes.string,
  subTitle: PiPropTypes.string,
  titleAvatar: PiPropTypes.string,
  titleMedia: PiPropTypes.shape(),
  content: PiPropTypes.arrayOf(PiPropTypes.string),
  contentCard: PiPropTypes.string,
};
