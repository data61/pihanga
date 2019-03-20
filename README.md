# pihanga

__TODO__: Once pihanga is published to npm registry, this README will need to be reviewed 
and 
changed.

## Get started (to run example applications that use pihanga)
Install [NodeJS](https://nodejs.org/en/) or via [package manager](https://nodejs.org/en/download/package-manager/)

Like most `node.js` projects the workflow is:

    npm install
    npm start

The last command starts a development server and should also open the respective page in your 
default browser.

## Build scripts

The following scripts are available. In addition, there might be some other scripts supported by 
`react-scripts` (see [react-scripts.README.md](./react-scripts.README.md)).

* `npm run start` (`REACT_APP_USE_REDUX=true npm run start` to run the pihanga redux example)
* `npm run lint`
* `npm run test`
* `npm run test -- --coverage` 
* `npm run build`

These commands use environment variables from `.env.*`. (For more info, see [Create React App Environment Config](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#what-other-env-files-can-be-used) )

To run it with a local environment that will be ignored by git, create a file named `.env.local` 
and override variables there.

## Directory structure

    + coverage (*)
    + public
      index.html
      + images
    + src
      + app ('apollo-client-example-app' or 'redux-example-app')
        + shared
        + ui
           + component-abc
           + module-xyz
           + shared
        index.js
      + pihanga
      index.js      
- `coverage` contains test coverage report (this is only generated after running `npm run 
test -- --coverage`)
- `public` contains all the static resources, such as images and common stylesheets.
- `src` contains all the javascript sources including the bootstrap `index.js` file
  - `app`: The bulk of the functionality and also the most likely extension points are in the 
  this directory.
     - In each module, there can be a `shared` folder which has all common components and utils that are
        used by all sub-modules or modules that are on the same folder level as `shared`'s.
     - A module (e.g `module-xyz`) has a `module.js` file comparing to a component (e.g 
     `component-abc`) (See [Module definition](#module-definition) for more information).
  - `pihanga` includes logger and router. This folder will be published to npm registry 

## Module definition

Every module resides in its own directory under the top-level `app` directory. A 
typical directory structure for a 'simple' module is:

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

**Note:** UI components are encouraged to be _stateless_. This is not compulsory though since it
 is easier to have state in some cases like setting focus to a button.

### Module: `*.module.js`

The bootstrap process is checking all directories under the `app` tree for `*.module.js` files 
with an exported `init` function. If such
a function exists, it is called with a convenient function to simplify the registration of Routing 
config (a map of route path and component to 
display when user is on that path) and registration of any other custom objects like reducers in 
Redux or resolvers in Apollo Client.

An example of an `*.module.js` file looks like:

    import { ROUTING_CONFIG } from './project.routing';
    import { RESOLVERS } from './project.resolvers';
    
    export function init(registerRouting, registerResolvers) {
      registerRouting(ROUTING_CONFIG);
      registerResolvers(RESOLVERS);
    }

### Module: `*.jsx`

Files with the extension `jsx` contain the definition of a single UI component.
We are using the purely functional style of defining React components. A typical
file may look like:

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

## Router
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
 data 
 (`payload`). See
 `src/pihanga/extended-prop-types.js` for more information.
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
