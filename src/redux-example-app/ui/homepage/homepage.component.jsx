import React from 'react';
import { ExtendedPropTypes } from 'pihanga';

import './homepage.css';
import { PROJECT_ROUTING } from '../project';

export const HomepageComponent = ({ updateRoute }) => (
  <div className="bg-white mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden">
    <div className="sm:flex sm:items-center px-6 py-4">
      <img
        className="block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0"
        src="data61-logo.png"
        alt="Data61 Logo"
      />
      <div className="text-center sm:text-left sm:flex-grow">
        <div className="mb-4">
          <p className="text-xl leading-tight">Pihanga Redux Example</p>
          <p className="text-sm leading-tight text-grey-dark">
            <a href="https://www.data61.csiro.au/">Data61</a>
            {' | '}

            <small>{`pihanga@v${process.env.REACT_APP_VERSION}`}</small>
          </p>
        </div>
        <div>
          <button
            type="button"
            className="text-xs font-semibold rounded-full px-4 py-1 leading-normal bg-white
                border border-purple text-purple hover:bg-purple hover:text-white"
            onClick={() => updateRoute(PROJECT_ROUTING.getProjectRoute())}
          >
            View dummy page
          </button>
        </div>
      </div>
    </div>
  </div>
);

HomepageComponent.propTypes = {
  updateRoute: ExtendedPropTypes.func.isRequired
};
