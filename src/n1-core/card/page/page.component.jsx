import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RefreshIcon from '@material-ui/icons/Refresh';

import { NavDrawerCard } from 'n1-core/card/nav-drawer';

import { N1PropTypes } from 'n1-core';
import { Card } from 'n1-core';

import environment from 'environments/environment';

import { clickNavMenu, clickOpenDrawer, clickCloseDrawer, refreshContent, } from './page.actions';
import styled from './page.style';

let components = [];
const pathPrefix = environment.PATH_PREFIX || '';
export const registerComponent = (name, priority, path) => {
  components.push({name, priority, path: pathPrefix + path});
  components = components.sort((a, b) => b.priority - a.priority);
}

const NavBar = styled(({ 
    breadcrumbs = [], subTitle = '???',
    drawerOpen, toolbarAddOns, showRefreshButton, route, classes }) => {

  function renderBreadcrumbs() {
        //<a className={classes.appBarBreadcrumb}> 
    return breadcrumbs
      .map(b => (
        <div key={b.title} className={classes.appBarBreadcrumbContainer}>
          <a onClick={ () => clickNavMenu(b) } className={classes.appBarBreadcrumbLink}>
            <Typography type="title" noWrap className={classes.appBarBreadcrumbText} >
              {b.title}
            </Typography>
          </a>
          <KeyboardArrowRightIcon className={classes.appBarBreadcrumbText} />
        </div>
      ));
  }

  function RefreshButton() {
    if (! showRefreshButton) return null;
    return (
      <IconButton color="inherit" aria-label="refresh logs" 
        onClick={() => refreshContent(route.pageType)}
        className={classes.refreshButton}
      >
        <RefreshIcon/>
      </IconButton>  
    );
  }

  return (
    <AppBar className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}>
      <Toolbar disableGutters={!drawerOpen} className={classes.appToolbar}>
        <IconButton color="inherit" aria-label="open drawer" onClick={clickOpenDrawer}
          className={classNames(classes.menuButton, drawerOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        { renderBreadcrumbs() }
        <Typography type="title" color="inherit" noWrap className={classes.appBarTitle} >
        {subTitle}
        </Typography>
        { toolbarAddOns.map(f => f()) }
        <RefreshButton/>
      </Toolbar>
    </AppBar>
  );
});


// export const PageComponent = connect(s => s)(styled(({ 
//   version, user, page, route, 
//   toolbarAddOns = [], showRefreshButton = false, topMargin = true,
//   children, classes 
// }) => {
export const PageComponent = styled(({cardName, contentCard, navDrawerCard, 
    title, topMargin, showRefreshButton = false,
    toolbarAddOns = [], drawerOpen, route = {}, 
    classes}) => {
  const appBarPosition = "static"; //"absolute"; // static

  return (
    <div className={classes.root}>
      <AppBar position={appBarPosition} color="default">
        <Toolbar className={classes.topToolbar}>
          <Typography type="title" color="inherit">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.appFrame}>
        <NavBar page={ {} } drawerOpen={ drawerOpen } route={ route } 
          toolbarAddOns={ toolbarAddOns }
          showRefreshButton={ showRefreshButton }
        />
        <Card cardName={navDrawerCard} parentCard={cardName} />
        <main className={
          classNames(classes.content, 
            topMargin && classes.contentTopMargin,  
            drawerOpen && classes.contentShift)
        }>
          <Card cardName={contentCard} parentCard={cardName} />
        </main>
      </div>      
    </div>
  );
});

PageComponent.propTypes = {
  version: N1PropTypes.shape(),
  user: N1PropTypes.shape(),
  //children: N1PropTypes.children.isRequired,
};

PageComponent.defaultProps = {
  version: undefined,
  user: undefined,
  classes: {},
};