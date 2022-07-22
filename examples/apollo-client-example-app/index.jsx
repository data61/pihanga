import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GraphQLJSON from 'graphql-type-json';
import { compose, withProps } from 'recompose';

import { loadModules } from 'pihanga';
import { AppRouterComponent } from './ui';
import { ResolverRegister, createApolloClient } from './apollo-client';
import { requireContext } from './require-context';
import { previewQuery } from './ui/shared';

const typeDefs = `{
  scalar JSON

  type Route {
    path: String!,
    preventAddingHistory: Boolean
    payload: JSON
    paramValueByName: JSON
  }
}`;

//
// GraphQL resolvers that can be queried for mutation
// Note: Resolvers must return something (even if null) to surpress a useless
// warning. See https://github.com/apollographql/apollo-link-state/issues/160
//
export const initialResolvers = {
  JSON: GraphQLJSON,
  Mutation: {
    // Handle browser history between user navigations
    updateRoute: (
      _,
      { route: { path, payload, paramValueByName, preventAddingHistory } },
      { cache }
    ) => {
      const query = gql`
        {
          route @client {
            path
            payload
            paramValueByName
            preventAddingHistory
          }
        }
      `;

      const { route: previous } = cache.readQuery({ query });

      cache.writeQuery({
        query,
        data: {
          route: {
            path: path || previous.path,
            preventAddingHistory: preventAddingHistory || previous.preventAddingHistory,
            payload: { ...(payload || previous.payload), __typename: 'JSON' },
            paramValueByName: {
              ...(paramValueByName || previous.paramValueByName),
              __typename: 'JSON'
            },
            __typename: 'Route'
          }
        }
      });
      return null;
    }
  }
};

/**
 * Bootstrap the app on given DOM's element Id
 * @param appElementId
 */
export function bootstrapApp(appElementId) {
  const resolvers = new ResolverRegister().registerResolvers(initialResolvers);
  const routerComponentWrapper = loadModules(process.env.REACT_APP_LOG_LEVEL, requireContext(), {
    registerResolvers: resolvers.registerResolvers.bind(resolvers)
  });

  const defaults = {
    route: {
      __typename: 'Route',
      path: routerComponentWrapper.getBrowserLocationPath(),
      preventAddingHistory: false
    },
    payload: { __typename: 'JSON' },
    paramValueByName: { __typename: 'JSON' }
  };

  const RouterComponent = compose(
    previewQuery(
      gql`
        query {
          route @client {
            path
            preventAddingHistory
            payload
            paramValueByName
          }
        }
      `
    ),
    withProps(({ data: { route } }) => ({ route })),
    graphql(
      gql`
        mutation($route: Route!) {
          updateRoute(route: $route) @client
        }
      `,
      {
        props: ({ mutate }) => ({
          // NOTE: this updateRoute is injected to every component
          updateRoute: ({ path, payload, preventAddingHistory, paramValueByName }) =>
            mutate({
              variables: {
                route: {
                  path,
                  payload,
                  preventAddingHistory,
                  paramValueByName
                }
              }
            })
        })
      }
    )
  )(AppRouterComponent(routerComponentWrapper));

  ReactDOM.render(
    <ApolloProvider client={createApolloClient(resolvers.get(), defaults, typeDefs)}>
      <RouterComponent />
    </ApolloProvider>,
    document.getElementById(appElementId)
  );
}
