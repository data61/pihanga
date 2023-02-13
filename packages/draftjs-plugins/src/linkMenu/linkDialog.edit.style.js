import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    padding: 4,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
  },
  row: {
    margin: theme.spacing(1.5),
  },
  textField: {
    width: 290,
  }
  // applyLine: {
  //   display: 'flex',
  //   flexDirection: 'row',
  // },
  // applyButton: {
  //   marginLeft: 4,
  // },
  
  // textField: {
  //   fontSize: '0.875rem',
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   width: 200,
  // },
  // textField2: {
  //   fontSize: '0.875rem',
  //   marginLeft: theme.spacing(1),
  //   marginRight: theme.spacing(1),
  //   marginTop: theme.spacing(1),
  //   marginBottom: theme.spacing(1),
  //   width: 200,
  //   border: 0,
  //   '&:focus': {
  //     outline: 'none',
  //   },
  // },
}));