import React from 'react';
import ReactDOM from 'react-dom';
import { HomepageComponent } from './homepage.component';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HomepageComponent updateRoute={jest.fn()}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
