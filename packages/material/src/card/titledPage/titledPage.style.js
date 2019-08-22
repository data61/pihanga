import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  card: {
    //marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),
    fontSize: '500% !important', // forcefully override MUI-Icon default size
  },

}));