# pihanga

> [pihanga](https://s3.amazonaws.com/media.tewhanake.maori.nz/dictionary/38608.mp3)
>  (noun) window, sliding slab of the traditional window of a wharenui.

pihanga is a framework for dynamically extensible React apps

It is implemented primarily in Javascript (ES6), using:
- [react](https://facebook.github.io/react/) as a view library for the frontend.
- [react-scripts](https://github.com/facebook/create-react-app#readme) to avoid the hassle of 
managing multiple tools for bundling & optimising front-end assets (including JS, CSS and images).

# Contents
- [Motivation](#motivation)
- [Approach & upcoming development](#approach--upcoming-development)
- [Known issues](#known-issues)
- [Get started](#get-started)
  - [Installation](#installation)
  - [Features](#features)
  - [Recommended directory structure](#recommended-directory-structure)
  - [Module definition](#module-definition)
  - [Router](#router)
- [Running the examples](#running-the-examples)

## Motivation

Most of the web frontends we are usually building are for a rather small user base to better use or 
maintain rather complex backends. Many of those systems start out small but over time expand in 
various directions by different teams using different technologies. Most likely a common scenario 
for many business support services.

We use micro services and similar technologies to avoid any unnecessary dependencies in the backend, 
but our users, understandably want a unified UX in the frontend.

This project is an attempt to achieve that while supporting the independent development of the 
various parts and components surfacing specific backend capabilites. In other words, we want to 
minimize the amount of code changes when adding new functionality while still supporting an 
integrated UX experience.

## Approach & upcoming development

We started by modularising our UI into components and [modules](#module-definition) and loading 
them dynamically. To achieve this, we had to create our own [Router](#router).

The [dynamic module loader](#features) enabled us to develop a plugin system that allows components
to have a dynamic list of child components. A component or a module while being developed 
independently can be plugged in to the existing application. This feature is not yet completed 
though. We are aiming to release it in pihanga@v1.0.0. 

## Known issues

The dynamic module loader depends on the use of `require.context(...)` or alike to get all paths 
to `*.module.js` files. It will need to be called in your application. Please checkout one of 
the examples in `src/example` on how to use it.

## Get started

### Installation
    npm install --save pihanga

### Features
pihanga comes with these main utilities:
1. `RouterComponentWrapper`: it lets you to customise the look and feel of the router component.
1. `LoggerFactory`: A factory to create a logger object
1. `loadModules(logLevel, moduleById, extraModuleInitArgs, serverSideRendering)`: This method 
loads modules dynamically and inject extra callbacks to modules' init function. (__NOTE__: you 
will need to use `require.context(...)` or alike to get all paths to `*.module.js`. See 
`require-context.js` file in example application for more details)
1. `ExtendedPropTypes`: The extended `PropTypes` that contains router's related types. 

### Recommended directory structure

    + src
      + app // 'apollo-client-example-app' or 'redux-example-app' in the examples
        + shared
        + ui
           + component-abc
           + module-xyz
           + shared
        index.js
      index.js      
      
- In each folder, there can be `shared` which has all common components and utils that 
are used by all sub-modules or modules that are on the same directory level as `shared`'s.
- A module (e.g `module-xyz`) has a `module.js` file comparing to a component (e.g `component-abc`) 
(See [Module definition](#module-definition) for more information).
- `index.js` files should export everything that other same level folders export, e.g `export * 
from './ui'`

### Module definition

Every module resides in its own directory. Its typical directory structure is:

    + ui
      + project
        index.js
        project.component.jsx
        project.module.js
        project.routing.js
        project.css
      + home
      + shared
      index.js

The `project.module.js` is used to register itself as a module.

`*.jsx` files contains UI components with `*.css` and `*.routing.js` containing 
the respective style and route path configuration.

#### Module: `*.module.js`

The bootstrap process in example application is checking all directories under the `app` tree for `*
.module.js` files with an exported `init` function. If such a function exists, it is called with 
a convenient function to simplify the registration of Routing config (a map of route path and 
component to display when user is on that path) and registration of any other custom objects like 
reducers in Redux or resolvers in Apollo Client.

An example of an `*.module.js` file looks like:

    import { ROUTING_CONFIG } from './project.routing';
    import { RESOLVERS } from './project.resolvers';
    
    export function init(registerRouting, registerResolvers) {
      registerRouting(ROUTING_CONFIG);
      registerResolvers(RESOLVERS);
    }

#### Module: `*.jsx`

Files with the extension `jsx` contain the definition of a single UI component.
The following example uses the purely functional style of defining React components.

    import { ExtendedPropTypes } from 'framework';

    // (1) All style information is kept separately
    import './login.css';

    // (2) UI components are encouraged to be defined in a functional style
    export const LoginComponent = ({ 
      user, 
      
      // (3) These props are injected by the router
      route, 
      updateRoute,
     }) => {
      ...
      
      // (4) Return a JSX description of the component
      return (
        <... />
      );
    };

    // (5) Provide type checking for the state information expected by the component
    Login.propTypes = {
      user: PropTypes.shape(),
      route: ExtendedPropTypes.route.isRequired,
      updateRoute: ExtendedPropTypes.func.isRequired,
      ...
    };

1. Style information should be kept in a separate file to better separate structure
from styling.
1. We are using the purely functional style of defining UI components. The component is exported 
and made available as building blocks to others. 
1. See [Router](#router) section.
1. The component function returns a JSX description of the component.
1. To improve composition of components, we are using React's `PropTypes` support to 
validate the state passed to the component function.

### Router
A module might have a routing config to indicate what component to display when user is on a 
matching route path.

Example of a routing config:

     import { LoginComponent } from './login.component';
     export const routingConfig = {
       '/auth/login': LoginComponent,
     }

This tells the router to display `LoginComponent` on `'/auth/login'`.
When it does so, `route` and `updateRoute` will be injected to `LoginComponent`:
 - `route`, injected by the router includes information about the current route path and any extra 
 data (`payload`). See `src/pihanga/extended-prop-types.js` for more information.
 - `updateRoute()` is a custom function injected by the application to change route path and pass 
 any variables with it.
  
__Routing features:__
- Internal redirect: The following config tells the router to still display `LoginComponent` 
when user is on `'/'`.

 
      import { LoginComponent } from './login.component';
      const routingConfig = {
        '/': '/auth/login',
        '/auth/login': LoginComponent,
      }
      
- Access route parameters: The following `ProjectComponent` can access route parameters from the 
React 's props. If user is on `'/project/123'`, `props.route.paramValueByName[projectId]` is equal 
to `'123'`.

 
      import { ProjectComponent } from './project.component';
      const routingConfig = {
        '/project/:projectId': ProjectComponent,
      }
      
      ...
      
      const ProjectComponent = (props) => {
        props.route.paramValueByName[projectId]; // = '123' if url is 'http://example.com/project/123'
      };
      
- Pass extra data to route change and prevent adding the new route path to browser history (this is 
helpful if you don't want user to use browser's back/forward to navigate back to these pages later)


      export const LoginComponent = ({
        user, 
        
        // These props are injected by the router
        route, 
        updateRoute,
       }) => {
        return (
          <a 
            onClick=() => updateRoute({
              path: '/homepage',
              payload: {
                userDetail: user
              },
              preventAddingHistory: true
            })
          />
        );
      };

## Running the examples

pihanga is compatible with any other state manager. It comes with two examples to show 
how you can use it with [apollo-client](https://github.com/apollographql/apollo-client) and 
[redux](https://github.com/reduxjs/redux). 

Like most `node.js` projects the workflow is:

    npm install
    npm start

The last command starts a development server and should also open the respective page in your 
default browser.

### Build scripts

The following scripts are available. In addition, there might be some other scripts supported by 
`react-scripts` (see [react-scripts.README.md](./react-scripts.README.md)).

* `npm run start` 
  * `REACT_APP_USE_REDUX=true npm run start` to run the pihanga redux example
  * `REACT_APP_USE_REDUX=false npm run start` to run the pihanga apollo-client example
* `npm run lint`
* `npm run test`
* `npm run test -- --coverage` 
* `npm run build`

These commands use environment variables from `.env.*`. (For more info, see [Create React App Environment Config](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#what-other-env-files-can-be-used) )

To run it with a local environment ignored by git, create a file named `.env.local` 
and override variables there.
