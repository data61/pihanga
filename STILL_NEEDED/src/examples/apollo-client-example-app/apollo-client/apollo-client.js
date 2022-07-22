/* eslint-disable no-console */
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(error => {
      try {
        const stacktrace = error.extensions.exception.stacktrace || [];
        console.error(`[GraphQL error]: ${stacktrace.join('\n')}`);
      } catch (e) {
        console.error(`[GraphQL error]: ${error.message}`);
      }
    });

  if (networkError) console.error(`[Network error]: ${networkError}`);
});

export function createApolloClient(resolvers, defaults, typeDefs) {
  const cache = new InMemoryCache();

  const stateLink = withClientState({
    cache,
    resolvers,
    defaults,
    typeDefs
  });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      stateLink,
      errorLink,
      new HttpLink({
        uri: process.env.REACT_APP_GRAPHQL_HTTP_URL
      })
    ])
  });
}
