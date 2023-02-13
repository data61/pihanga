import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    //padding: 4,
    padding: theme.spacing(2),
  },
  // col: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   padding: theme.spacing(1),
  // },
  // row: {
  //   margin: theme.spacing(1.5),
  // },
  autoComplete: {
    width: 290,
  },

  icon: {
    width: 20,
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1.5),
    alignSelf: 'flex-start',
  },

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