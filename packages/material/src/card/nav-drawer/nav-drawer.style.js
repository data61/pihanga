import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 150;
const appBarHeight = 50;

export default withStyles(() => ({
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
}));
