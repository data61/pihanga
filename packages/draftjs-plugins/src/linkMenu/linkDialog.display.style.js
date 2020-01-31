import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
  },
  link: {
    maxWidth: '150px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    color: '#15c!important',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    textDecoration: 'none!important',
    verticalAlign: 'baseline',
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)', // default icon button color, should come from theme
  }, 
  iconButton: {
    padding: theme.spacing(1),
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