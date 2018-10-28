import React from 'react';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { N1PropTypes } from 'n1-core';

import { clickOpenDrawer, clickCloseDrawer, clickNavMenu } from './nav-drawer.actions';
import styled from './nav-drawer.style';

export const NavDrawerCard = styled(({
  drawerIsOpen, 
  navItems, 
  onOpenDrawer, onCloseDrawer,
  onClickNavMenu,
  classes
}) => {

  const NavEntry = ({item}) => (
    <ListItem key={ item.name } button  onClick={() => onClickNavMenu({item})}>
      <ListItemText primary={ item.name } />
    </ListItem>
  );

  return (
    <Drawer variant="persistent" classes={{ paper: classes.drawerPaper, }} open={drawerIsOpen}>
      <div className={classes.drawerInner}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => onCloseDrawer()}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        {/* Menu items style={{height: '100%'}} */}
        <List >
          { navItems.map(item => NavEntry({item})) }
        </List>
        <Divider />
        
        {/* <Typography type="versionFootNote">V0.8</Typography> */}
      </div>
    </Drawer>
  );
});

NavDrawerCard.propTypes = {
  card: N1PropTypes.shape(),
  //user: N1PropTypes.shape(),
  //children: N1PropTypes.children.isRequired,
};