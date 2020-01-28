import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => {
  const contentSpacing = {
    top: 3,
    left: 5,
    right: 5,
    bottom: 0,
  };
  const footerSpacing = 3;

  const topNav = {
    paddingBottom: 3,
    activeBorderWidth: 5,
    upFrom: 600,  // min pixel size
  };

  return {
    '@global': {
      body: {
        backgroundColor: theme.palette.common.backgroundColor,
      },
    },
    outer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    content: {
      width: '100%',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      // // height: 'calc(100% - 56px)',
      paddingLeft: theme.spacing(contentSpacing.left),
      paddingTop: theme.spacing(contentSpacing.top),
      paddingRight: theme.spacing(contentSpacing.right),
      paddingBottom: theme.spacing(contentSpacing.bottom),
      [theme.breakpoints.down(topNav.upFrom)]: {
        // height: 'calc(100% - 64px)',
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
      },
      display: 'flex',
      flexFlow: 'column',
    },
    contentTopPadding: {
      padding: theme.spacing(3),
    },
    contentPageHeight: {
      overflowY: 'auto',
    },
    titleIcon: {
      paddingRight: theme.spacing(2),
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
      paddingLeft: 24,
      paddingRight: 24,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: topNav.paddingBottom + topNav.activeBorderWidth,
      '&:hover': {
        paddingBottom: topNav.paddingBottom,
        borderBottomWidth: topNav.activeBorderWidth,
        borderBottomStyle: 'solid',
        // borderBottomColor: theme.palette.primary.dark,
      },
    },
    topNavFirst: {
      paddingLeft: theme.spacing(10),
    },
    topNavLink: {
      cursor: 'pointer',
    },
    topNavActive: {
      paddingBottom: topNav.paddingBottom,
      borderBottomWidth: topNav.activeBorderWidth,
      borderBottomStyle: 'solid',
      // borderBottomColor: theme.palette.primary.dark,
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
      // backgroundColor: theme.palette.background.paper,
      paddingTop: theme.spacing(footerSpacing),
      paddingBottom: theme.spacing(2),
    },
  };
});
