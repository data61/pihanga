import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined';
import Typography from '@material-ui/core/Typography';

import styled from './answer.style';

export const AnswerComponent = styled(({
  answer,
  question,
  onNewRequest,
  classes
}) => {
  function pluralize(word, count = 1) {
    return count === 1 ? word : word + 's';
  }

  return (
    <div className={classes.card}>
      <Avatar className={classes.avatar}>
        <VerifiedUserOutlined />
      </Avatar>
      <Typography variant="h4" align="center" className={classes.sentence}>
        Found <b> {answer.count} </b> 
        { answer.count === '1' ? 'account' : 'accounts' } <br/>
        across <b> {answer.count} </b> 
        { pluralize('bank', answer.banks) } <br/>
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="default"
        className={classes.newRequest}
        onClick={() => onNewRequest()}
      >
        New Request
      </Button>
    </div>
  );
});