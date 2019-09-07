import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';

import { Card } from '@pihanga/core';

import styled from './pageR1.style';

/**
 *
 *
 * footer: {
 *    title,
 *    subTitle,
 *    copyright,
 * }
 */
export const PageR1Component = styled(({
  cardName,
  title = '?Missing Title?',
  titleIcon,
  navLinks = [], // [{label, url}]
  activeUrl, // = '/pageB',
  contentCard,
  footer,
  onClickNavLink,
  topMargin,
  mui = {},
  classes,
}) => {
  const [sideNavPanelState, setSideNavPanelState] = React.useState(false);

  function addMenuIcon() {
    if (navLinks.length > 0) {
      return (
        <IconButton
          onClick={() => setSideNavPanelState(true)}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
      );
    } else {
      return null;
    }
  }

  function addTitleIcon() {
    if (titleIcon) {
      const m = mui.titleIcon || {};
      return (
        <>
          <Icon className={classes.titleIcon} {...m}>{titleIcon}</Icon>
          <Typography variant="srOnly">{titleIcon}</Typography>
        </>
      );
    } else {
      return null;
    }
  }

  function addTopNav(link, id) {
    const { label, url } = link;
    const ca = [classes.topNav];
    if (id === 0) {
      ca.push(classes.topNavFirst);
    }
    if (url === activeUrl) {
      ca.push(classes.topNavActive);
    }
    return (
      <Toolbar className={classNames(ca)}>
        <Typography
          variant="h6"
          onClick={() => onClickNavLink({ url })}
          color="inherit"
          noWrap
          className={classes.topNavLink}
        >
          {label}
        </Typography>
      </Toolbar>
    );
  }

  function addSidePanel() {
    return (
      <Drawer
        open={sideNavPanelState}
        onClose={() => setSideNavPanelState(false)}
        className={classes.sideNavPanel}
      >
        {sideList()}
      </Drawer>
    );
  }

  function sideList() {
    return (
      <div
        className={classes.sideNavPanelInner}
        role="presentation"
        onClick={() => setSideNavPanelState(false)}
        onKeyDown={() => setSideNavPanelState(false)}
      >
        <IconButton
          onClick={() => setSideNavPanelState(false)}
          className={classes.sideNavPanelCloseButton}
          color="inherit"
          aria-label="menu"
        >
          <CloseIcon />
        </IconButton>
        <Divider variant="fullWidth" />
        <List className={classes.sideNavList}>
          { navLinks.map(sideListItem)}
        </List>
      </div>
    );
  }

  function sideListItem(el, id) {
    const { label, url } = el;
    const ca1 = [classes.sideNavListItem];
    const ca2 = [classes.sideNavListLink];
    if (id === 0) {
      ca1.push(classes.sideNavFirstListItem);
      ca2.push(classes.sideNavFirstListLink);
    }
    if (url === activeUrl) {
      ca1.push(classes.sideNavActiveListItem);
      ca2.push(classes.sideNavActiveListLink);
    }
    return (
      <ListItem
        button
        key={id}
        divider
        onClick={() => onClickNavLink({ url })}
        className={classNames(ca1)}
      >
        <ListItemText className={classNames(ca2)}>
          {label}
        </ListItemText>
      </ListItem>
    );
  }

  function addFooter() {
    if (!footer) {
      return null;
    }
    const fm = mui.footer || {};
    const titleR = () => (
      <Typography variant="h6" align="center" gutterBottom {...fm.title}>
        {footer.title}
      </Typography>
    );
    const subTitleR = () => (
      <Typography variant="subtitle1" align="center" color="textSecondary" component="p" {...fm.subTitle}>
        {footer.subTitle}
      </Typography>
    );
    return (
      <footer className={classes.footer}>
        { footer.title ? titleR() : null }
        { footer.subTitle ? subTitleR() : null }
        { footer.copyright ? addCopyright() : null }
      </footer>
    );
  }

  function addCopyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {`Copyright ©${new Date().getFullYear()} `}
        <Link color="inherit" href="https://material-ui.com/">
          {footer.copyright}
        </Link>
      </Typography>
    );
  }

  return (
    <>
      <CssBaseline />
      { addSidePanel() }
      <AppBar position="relative">
        <Toolbar>
          { addMenuIcon() }
          { addTitleIcon() }
          <Typography variant="h5" color="inherit" noWrap>
            {title}
          </Typography>
          <div className={classes.topNavList}>
            { navLinks.map(addTopNav) }
          </div>
        </Toolbar>
      </AppBar>
      <main className={classNames(classes.content, topMargin && classes.contentTopMargin)}>
        <Grid
          item
          container
          direction="column"  
          justify="center"
          alignItems="center"
          className={classes.grid}
          {...mui.grid}
        >
          <Card cardName={contentCard} parentCard={cardName} />
        </Grid>
      </main>
      { addFooter() }
    </>
  );
});
