import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.backgroundColor,
    },
  },
  paper2: {
    padding: theme.spacing(3, 2),
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  inner: {
    width: '100%',
  },
  signature: {
    marginTop: 0,
    // 'max-width': 600,
  },
}));
