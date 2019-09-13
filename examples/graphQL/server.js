const express = require('express');
const ApolloExpress = require('apollo-server-express');
const Fuse = require('fuse.js');
const { ApolloServer, gql } = require('apollo-server');
const DataBase = require('./uefa-euro-2016');

const Players = {};
const Clubs = {};
const NationalTeams = {};

function entityName(id, type, name) {
  switch (type) {
    case 'Player': Players[id] = {id, name}; break;
    case 'Club': Clubs[id] = {id, name}; break;
    case 'NationalTeam': NationalTeams[id] = {id, name}; break;
    default: throw Error(`Unnown entity type '${type}`)
  }
}

function playsFor(id, clubID) {
  const p = Players[id];
  if (!id) {
    throw Error(`Unknown player id '${id}'`);
  }
  if (p.clubID) {
    throw Error(`Duplicate club association for player id '${id}'`);
  }
  p.clubID = clubID;
}

function represents(id, natTeamID) {
  const p = Players[id];
  if (!id) {
    throw Error(`Unknown player id '${id}'`);
  }
  if (p.natTeamID) {
    throw Error(`Duplicate national team association for player id '${id}'`);
  }
  p.natTeamID = natTeamID;
}

DataBase(entityName, playsFor, represents);

const typeDefs = gql`
  type Player {
    id: String
    name: String
    playsFor: Club
    represents: NationalTeam
  }

  type Club {
    id: String
    name: String
    players: [Player]
  }

  type NationalTeam {
    id: String
    name: String
    players: [Player]
  }

  type Query {
    players(id: String, match: String, limit: Int): [Player]
    clubs(id: String, match: String, limit: Int): [Club]
    nationalTeams(id: String, match: String, limit: Int): [NationalTeam]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Player: {
    playsFor: (e) => Clubs[e.clubID],
    represents: (e) => NationalTeams[e.natTeamID],
  },
  NationalTeam: {
    players: (e) => Object.values(Players).filter(p => p.natTeamID === e.id),
  },
  Club: {
    players: (e) => Object.values(Players).filter(p => p.clubID === e.id),
  },
  Query: {
    players: (_, opts) => dictQ(opts, Players),
    clubs: (_, opts) => dictQ(opts, Clubs),
    nationalTeams: (_, opts) => dictQ(opts, NationalTeams),
  },
};

function dictQ(opts, dict) {
  console.log(">>>", opts);
  let results;
  if (opts.id) {
    return [dict[opts.id]];
  } else if (opts.match) {
    var options = {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.2,
    }
    var fuse = new Fuse( Object.values(dict), options);
    results = fuse.search(opts.match);
  } else {
    results = Object.values(dict);
  }
  if (opts.limit) {
    results = results.slice(0, opts.limit);
  }
  return results;
}

const isDevelopment = process.env.NODE_ENV === 'development';
if (isDevelopment) {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.listen().then(({ url }) => {
    console.log(`🚀  Development server ready at ${url}`);
  });
} else {
  const server = new ApolloExpress.ApolloServer({ typeDefs, resolvers });
  const app = express();
  server.applyMiddleware({ app });
  app.use(express.static('build'));

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Production server with GraphQL API ready at http://localhost:4000${server.graphqlPath}`)
  );
}


