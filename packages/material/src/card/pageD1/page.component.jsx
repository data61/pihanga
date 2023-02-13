import React from 'react';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Card, PiPropTypes } from '@pihanga/core';

// import environment from 'environments/environment';
import styled from './page.style';

// let components = [];
// const pathPrefix = environment.PATH_PREFIX || '';
// export const registerComponent = (name, priority, path) => {
//   components.push({name, priority, path: pathPrefix + path});
//   components = components.sort((a, b) => b.priority - a.priority);
// }

const NavBar = styled(({
  breadcrumbs = [],
  subTitle = '???',
  drawerIsOpen,
  toolbarAddOns,
  showRefreshButton,
  route,
  onNavMenuClicked, onRefreshContent, onOpenDrawer,
  classes,
}) => {

  function renderBreadcrumbs() {
    return breadcrumbs.slice(0, -1).map(b => (
        <div key={b.title} className={classes.appBarBreadcrumbContainer}>
            <Typography variant="h6" noWrap className={classes.appBarBreadcrumbText} >
          <a onClick={ () => onNavMenuClicked(b) } className={classes.appBarBreadcrumbLink}>
              {b.title}
          </a>
          <KeyboardArrowRightIcon className={classes.appBarBreadcrumbText} />
          </Typography>
        </div>
      ));
  }

  function RefreshButton() {
    if (! showRefreshButton) return null;
    return (
      <IconButton color="inherit" aria-label="refresh logs"
        onClick={() => onRefreshContent(route.pageType)}
        className={classes.refreshButton}
      >
        <RefreshIcon/>
      </IconButton>
    );
  }

  return (
    <AppBar className={classNames(classes.appBar, drawerIsOpen && classes.appBarShift)}>
      <Toolbar disableGutters={!drawerIsOpen} className={classes.appToolbar}>
        <IconButton color="inherit" aria-label="open drawer" onClick={() => onOpenDrawer() }
          className={classNames(classes.menuButton, drawerIsOpen && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        { renderBreadcrumbs() }
        <Typography variant="h6" color="inherit" noWrap className={classes.appBarTitle} >
        {subTitle}
        </Typography>
        { toolbarAddOns.map(f => f()) }
        <RefreshButton/>
      </Toolbar>
    </AppBar>
  );
});

export const PageComponent = styled(({
  cardName,
  contentCard,
  navDrawerCard,
  title,
  subTitle,
  breadcrumbs,
  topMargin,
  showRefreshButton = false,
  toolbarAddOns = [],
  drawerIsOpen = true,
  route = {},
  onNavMenuClicked, onRefreshContent, onOpenDrawer,
  classes,
}) => {
  const appBarPosition = "static"; //"absolute"; // static

  return (
    <div className={classes.root}>
      <AppBar position={appBarPosition} color="default">
        <Toolbar className={classes.topToolbar}>
          <Typography variant="h6" color="inherit">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.appFrame}>
        <NavBar page={ {} }
          subTitle={ subTitle }
          breadcrumbs={ breadcrumbs }
          drawerIsOpen={ drawerIsOpen }
          route={ route }
          toolbarAddOns={ toolbarAddOns }
          showRefreshButton={ showRefreshButton }
          onNavMenuClicked={ onNavMenuClicked }
          onRefreshContent={ onRefreshContent }
          onOpenDrawer={ onOpenDrawer }
        />
        <Card cardName={navDrawerCard} parentCard={cardName} />
        <main className={
          classNames(classes.content,
            topMargin && classes.contentTopMargin,
            drawerIsOpen && classes.contentShift)
        }
        >
          <Card cardName={contentCard} parentCard={cardName} />
        </main>
      </div>
    </div>
  );
});

PageComponent.propTypes = {
  version: PiPropTypes.shape(),
  user: PiPropTypes.shape(),
};

PageComponent.defaultProps = {
  version: undefined,
  user: undefined,
  classes: {},
};