import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

export function createApolloClient(resolvers, defaults, typeDefs) {
  const cache = new InMemoryCache();

  const stateLink = withClientState({
    cache,
    resolvers,
    defaults,
    typeDefs,
  });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([
      stateLink,
      new HttpLink({
        uri: process.env.REACT_APP_GRAPHQL_HTTP_URL,
      }),
    ]),
  });
}
