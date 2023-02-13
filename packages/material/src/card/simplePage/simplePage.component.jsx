import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Card, PiPropTypes } from '@pihanga/core';

import styled from './simplePage.style';

// eslint-disable-next-line react/prop-types
function SignatureBlock({ signature, className }) {
  if (signature) {
    return (
      <Box className={className}>
        <Typography variant="body2" color="textSecondary" align="center">
          {signature}
        </Typography>
      </Box>
    );
  }
  return null;
}

const SimplePageComponent = styled(({
  cardName,
  contentCard, // what to display on this page
  signature, // what, if anything to display as simple signature (e.g. 'Built with love by ...')
  maxWidth = '100%', // max width of content page (MUI Paper)
  grid = { sm: 10 }, // enclosing grid constraints
  classes,
}) => (
  <div>
    <CssBaseline />
    <Grid
      item
      container
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item {...grid} className={classes.inner} style={{ maxWidth }}>
        <Paper
          className={classes.paper2}
          elevation={1}
        >
          <Card key={0} cardName={contentCard} parentCard={cardName} />
        </Paper>
        <SignatureBlock signature={signature} className={classes.signature} />
      </Grid>

    </Grid>
  </div>
));

SimplePageComponent.propTypes = {
  contentCard: PiPropTypes.string,
};

export default SimplePageComponent;
