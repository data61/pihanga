import React from 'react';

const ParentContext = React.createContext(null);

// function to apply to your react component class
export const foo = () => {
  return (
    <ParentContext.Consumer>
      {parent => {
        console.log('I am:', this, ' my parent is:', parent ? parent.name : 'null');
        return (
          <ParentContext.Provider value={this}>
            <componentClass ref={inst => refToInstance = inst} parent={parent} {...this.props} />
          </ParentContext.Provider>
        )
      }
      }
    </ ParentContext.Consumer>
  )
}