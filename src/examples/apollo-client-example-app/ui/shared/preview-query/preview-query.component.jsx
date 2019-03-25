import React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { graphql } from 'react-apollo';
import { Spinner } from './spinner.component';

/**
 * A wrapper around `graphql` from `react-apollo`.
 * Renders a spinner when query is in loading state, otherwise renders child HOCs.
 *
 * @param {gql} queryStr
 * @param {object} options
 */
export const previewQuery = (queryStr, options) =>
  compose(
    graphql(queryStr, {
      options: options || {},
      props: ({ data: { loading, error, ...data } }) => ({ loading, error, data })
    }),
    branch(({ loading }) => loading, renderComponent(Spinner)),
    branch(
      ({ error }) => error,
      () => () => (
        <div
          className="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded
              relative w-full"
          role="alert"
        >
          Sorry, we are having troubles connecting to the server. Please try again later.
        </div>
      )
    )
  );
