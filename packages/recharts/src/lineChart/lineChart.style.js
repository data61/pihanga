import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  outer: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
  },
  inner: {
    //background: 'yellow',
    position: 'absolute',
    top: 0,
    left: 0,
  }
}));