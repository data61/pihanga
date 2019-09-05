import { withStyles } from '@material-ui/core/styles';
import { flexbox } from '@material-ui/system';

const topNav = {
  paddingBottom: 3,
  activeBorderWidth: 5,
  upFrom: 600,  // min pixel size
};

export default withStyles(theme => { //({
  return {
  '@global': {
    body: {
      backgroundColor: theme.palette.common.backgroundColor,
    },
  },
  titleIcon: {
    marginRight: theme.spacing(2),
  },
  menuButton: {
    [theme.breakpoints.up(topNav.upFrom)]: {
      display: 'none',
    },
  },
  topNavList: {
    display: 'flex',
    [theme.breakpoints.down(topNav.upFrom)]: {
      display: 'none',
    },
  },
  topNav: {
    alignItems: 'flex-end',
    marginLeft: 24,
    marginRight: 24,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: topNav.paddingBottom + topNav.activeBorderWidth,
    '&:hover': {
      paddingBottom: topNav.paddingBottom,
      borderBottomWidth: topNav.activeBorderWidth,
      borderBottomStyle: 'solid',
      //borderBottomColor: theme.palette.primary.dark,
    }
  },
  topNavFirst: {
    marginLeft: theme.spacing(10),
  },
  topNavLink: {
    cursor: 'pointer',
  },
  topNavActive: {
    paddingBottom: topNav.paddingBottom,
    borderBottomWidth: topNav.activeBorderWidth,
    borderBottomStyle: 'solid',
    //borderBottomColor: theme.palette.primary.dark,
  },

  // SIDE NAV
  sideNavPanel: {
    [theme.breakpoints.up(topNav.upFrom)]: {
      display: 'none',
    },
  },
  sideNavPanelInner: {
    flexShrink: 0,
    minWidth: 268,
  },
  sideNavActiveListLink: {
    color: theme.palette.primary.dark,
  },

  // FOOTER
  footer: {
    //backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}});
//}));