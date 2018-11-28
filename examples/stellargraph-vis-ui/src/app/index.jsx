import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'recompose';
import GraphQLJSON from 'graphql-type-json';

import { loadModules } from 'framework';
import { AppRouterComponent } from './ui';
import { Resolvers, createApolloClient } from './apollo-client';
import { requireContext } from './require-context';

const initialResolvers = {
  JSON: GraphQLJSON,

  Mutation: {
    updateRoute: (_, { route }, { cache }) => {
      const query = gql`
        {
          route @client {
            path,
            payload,
            preventAddingHistory,
          }
        }
      `;

      cache.writeQuery({
        query,
        data: {
          route: {
            __typename: 'Route',
            path: route.path,
            payload: route.payload || {},
            preventAddingHistory: route.preventAddingHistory || false,
          },
        },
      });
    },
  },
};

const typeDefs = `
  scalar JSON

  type Route {
    path: String!,
    payload: JSON,
    preventAddingHistory: Boolean,
  }
}`;

/**
 * Bootstrap the app on given DOM's element Id
 * @param appElementId
 */
export function bootstrapApp(appElementId) {
  const resolvers = new Resolvers().registerResolvers(initialResolvers);
  const routerComponentWrapper = loadModules(
    process.env.REACT_APP_LOG_LEVEL,
    requireContext(),
    [resolvers.registerResolvers.bind(resolvers)],
  );

  const defaults = {
    route: {
      __typename: 'Route',
      path: routerComponentWrapper.getBrowserLocationPath(),
    },
  };

  const RouterComponent = compose(
    graphql(
      gql`
        query {
          route @client {
            path
          }
        },
      `,
      {
        props: ({ data }) => ({ route: data.route || {} }),
      },
    ),

    graphql(
      gql`
        mutation ($route: Route!) {
          updateRoute(route: $route) @client
        }
      `,
      {
        props: ({ mutate }) => ({
          // NOTE: this updateRoute is injected to every components
          updateRoute: (
            path,
            payload,
            preventAddingHistory,
          ) => mutate({ variables: { route: { path, payload, preventAddingHistory } } }),
        }),
      },
    ),
  )(AppRouterComponent(routerComponentWrapper));

  ReactDOM.render(
    <ApolloProvider client={createApolloClient(resolvers.get(), defaults, typeDefs)}>
      <RouterComponent />
    </ApolloProvider>,
    document.getElementById(appElementId),
  );
}
