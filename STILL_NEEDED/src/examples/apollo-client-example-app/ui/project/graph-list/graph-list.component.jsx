import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

export const GraphListComponent = () => (
  <Query
    query={gql`
      {
        projects {
          id
          name
          description
          graphs {
            id
            persistenceId
            persistenceEpgId
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading graph list...</p>;
      if (error) return <p>Error :(</p>;

      return data.projects.map(({ id, name, description, graphs }) => (
        <div className="pl-4 pb-2" key={id}>
          <p>{`Project name: ${name}`}</p>
          <p>{`Project description: ${description}`}</p>
          <p>Graphs:</p>
          <p>
            {graphs.map(g => (
              <div className="pl-4 pb-2" key={id}>
                <p>{`Graph id: ${g.id}`}</p>
                <p>{`Persistence id: ${g.persistenceId}`}</p>
                <p>{`Persistence EPG ID: ${g.persistenceEpgId}`}</p>
              </div>
            ))}
          </p>
        </div>
      ));
    }}
  </Query>
);
