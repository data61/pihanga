import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { registerActions, dispatch, dispatchFromReducer } from '@pihanga/core';
import gql from 'graphql-tag';
import { visit } from 'graphql';


const Domain = 'GRAPHQL';
export const ACTION_TYPES = registerActions(Domain, 
  ['QUERY_SUBMITTED', 'QUERY_RESULT', 'QUERY_ERROR', 'QL_ERROR', 'NETWORK_ERROR', 'NOT_INITIALISED']);

let client;
let registerReducer;

/**
 * Standard pihanga init function to initialize an Apollo client.
 * 
 * Expects all relevant configuration options to be found in 
 * `register.environment.GRAPHQL_URI` (needs most likely more).
 * 
 * @param {*} register 
 */
export function init(register) {
  const uri = register.environment.GRAPHQL_URI || '/graphql';
  client = createClient(uri);
  registerReducer = register.reducer;
}

/**
 * Register a GraphQL query and all related processing steps.
 * 
 * The argument to this function is a map with the following key/value pairs.
 * 
 * * query: The GraphQL query to be issued
 * * trigger: The Redux action type to potentially trigger this query
 * * request: A function expected to return a map of the variable assignmets for this query.
 *     If undefined is returned, no query is issued. The function is called with paramters:
 *     triggering action, current redux state, and a map describing the declared variables 
 *     and their respective types.
 * * reply: A function expected to return a possibly updated redux state in respond to a 
 *     successful query result. The function is called witht paramters: the current redux state
 *     and the 'data' element of the returned query.
 * * error: An optional function expected to return a possibly updated redux state in respond to a 
 *     failed query. The function is called witht paramters: the current redux state
 *     and the error condition.
 * 
 * 
 * @param {*} opts 
 */
export function registerQuery({query, trigger, request, reply, error}) {
  const {name, variables, doc} = parseQuery(query);
  if (!trigger) {
    throw Error('Missing "trigger"');
  }
  if (!request) {
    throw Error('Missing "request"');
  }
  if (!reply) {
    throw Error('Missing "reply"');
  }

  const submitType = `${ACTION_TYPES.QUERY_SUBMITTED}:${name}`;
  const resultType = `${ACTION_TYPES.QUERY_RESULT}:${name}`;
  const errorType = `${ACTION_TYPES.QUERY_ERROR}:${name}`;
  
  registerReducer(trigger, (state, action) => {
    const vars = request(action, state, variables);
    if (vars) {
      runQuery(name, doc, vars, resultType, errorType);
      dispatchFromReducer({type: submitType, queryID: name, vars});
    }
    return state;
  });

  registerReducer(resultType, (state, action) => {
    return reply(state, action.data);
  });

  if (error) {
    registerReducer(errorType, (state, action) => {
      return reply(state, error);
    });
  }
}

function parseQuery(query) {
  const doc = gql(query);
  let name = null;
  const variables = {};
  const visitor = {
    enter: {
      OperationDefinition: (node) => {
        name = node.name.value;
        return undefined;
      },
      VariableDefinition: (node) => {
        const type = node.type.name.value;
        const name = node.variable.name.value;
        const defValue = node.defaultValue ? node.defaultValue.value : null;
        variables[name] = {name, type, defValue};
        return undefined;
      },
    }
  };
  visit(doc, visitor);
  return {name, variables, doc, query};
}

function runQuery(queryID, query, variables, resultType, errorType) {
  if (client === null) {
    dispatch({ type: ACTION_TYPES.NOT_INITIALISED, queryID });
  }
  client.query({query, variables})
  .then(data => {
    dispatch({ type: resultType, queryID, data: data.data });
  })
  .catch(error => {
    dispatch({ type: errorType, queryID, error });
  });
}

function createClient(uri) {
  return new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            dispatch({ type: ACTION_TYPES.QL_ERROR, message, locations, path });
          });
        }
        if (networkError) {
          dispatch({ type: ACTION_TYPES.NETWORK_ERROR, networkError });
        }
      }),
      new HttpLink({
        uri,
        // credentials: 'same-origin'
      })
    ]),
    cache: new InMemoryCache()
  });
}