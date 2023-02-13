import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
  },
  firstLine: {
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  domainLine: {
    fontSize: '14px',
    marginTop: -10, // move closer to title
    marginLeft: 8 + 24,
    color: '#80868b!important',
  },
  snippetLine: {
    fontSize: '15px',
    marginTop: 8,
    marginLeft: 8 + 24,
    marginRight: 8,
    marginBottom: 4,
    color: '#6e7c88',
  },
  link: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    color: '#15c!important',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden !important',
    textOverflow: 'ellipsis',
    textDecoration: 'none!important',
    verticalAlign: 'baseline',
    flexGrow: 99, // use up all of the remaining width
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