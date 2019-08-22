import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

export default withStyles(theme => ({
  card: {
    //marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    color: '#fff',
    backgroundColor: green[500],
    marginBottom: theme.spacing(4),
  },
  sentence: {
    lineHeight: '1.5em',
    marginBottom: theme.spacing(4),
  }
}));