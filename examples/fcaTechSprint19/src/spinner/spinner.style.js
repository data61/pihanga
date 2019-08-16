import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing(2),
  },
}));
