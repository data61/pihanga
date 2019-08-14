
import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import { PiPropTypes } from '@pihanga/core';
import { Card } from '@pihanga/core';

import styled from './tabbed.style';
import { onTabSelected as onTabSelectAction} from './tabbed.actions';

export const TabbedCardComponent = styled(({ 
  cardName,
  tabId = 0,
  tabs = [],
  indicatorColor = "primary",
  textColor = "primary",
  variant = "standard", // 'standard' | 'scrollable' | 'fullWidth
  onTabSelected,
  classes 
}) => {
  const tab = tabs[tabId] || {};

  function renderTabContent() {
    if (tab.card) {
      return (<Card cardName={tab.card} parentCard={cardName} />);
    } else {
      return (<div>`ERROR: Missing 'card' declaration for tab id ${tabId}.`</div>)
    }
  }

  function renderTabs() {
    return tabs.map((t, i) => {
      const l = t.label || '???';
      return (<Tab key={i} label={l} />);
    });
  }

  function handleOnChange(event, newValue) {
    if (onTabSelected) {
      onTabSelected(event, newValue);
    } else {
      onTabSelectAction(cardName, newValue)
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={tabId}
          onChange={handleOnChange}
          indicatorColor={ indicatorColor }
          textColor={ textColor }
          variant={ variant }
        >
          { renderTabs() }
        </Tabs>
      </AppBar>
      <div className={classes.content}>
        { renderTabContent() }
      </div>
    </div>
  );
});

TabbedCardComponent.propTypes = {
  tabId: PiPropTypes.number,
  tabs: PiPropTypes.array.isRequired,
  indicatorColor: PiPropTypes.string,
  textColor: PiPropTypes.string,
  onChange: PiPropTypes.func,
};


