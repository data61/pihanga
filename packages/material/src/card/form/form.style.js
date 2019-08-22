import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  card: {
    //marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
  },
  selectControl: {
    minWidth: 120,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));