
import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  label: {
    color: 'white',
  },
  root: {
  },
  
  switchDefault: {
    color: theme.palette.type === 'light' ? theme.palette.grey[400] : theme.palette.grey[50],
  },
  switchChecked: {
    //color: theme.palette.primary.contrastDefaultColor,
    color: 'white',
  },
  switchBar: {
    backgroundColor: 'white !important',
    opacity: 0.5,
  }
}));
