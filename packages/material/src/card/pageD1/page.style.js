import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 150;
const appBarHeight = 50;

export default withStyles((theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
  topToolbar: {
    minHeight: appBarHeight,
  },
  // paper: {
  //   padding: 16,
  //   textAlign: 'center',
  //   color: theme.palette.text.secondary,
  // },

  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    minHeight: appBarHeight,
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarBreadcrumbContainer: {
    display: 'flex',
    marginRight: 10,
  },
  appBarBreadcrumbLink: {
    '&:hover': {
      textDecoration: 'underline',
    }
  },
  appBarBreadcrumbText: {
    color: 'rgba(255,255,255,.54)', //theme.palette.text.primary,
    marginRight: 10,
    fontSize: 'inherit',
  },
  appBarTitle: {
    flex: 1,
  },

  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appToolbar: {
    minHeight: '50px',
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: '100%',
    width: drawerWidth,

  },
  drawerInner: {
    height: '100%',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    height: appBarHeight,
    // [theme.breakpoints.up('sm')]: {
    //   height: 64,
    // },
  },
  content: {
    width: '100%',
    marginLeft: -drawerWidth,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    //height: 'calc(100% - 56px)',
    marginTop: appBarHeight,
    [theme.breakpoints.up('sm')]: {
      content: {
        //height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
    display: 'flex',
    flexFlow: 'column',
  },
  contentTopMargin: {
    padding: theme.spacing(3),
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));