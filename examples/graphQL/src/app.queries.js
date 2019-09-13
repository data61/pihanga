import { registerQuery } from '@pihanga/graphql';
import { actions, update } from '@pihanga/core';

export function init() {
  registerQuery({
    query: `
      query findPlayers($pattern: String, $limit: Int = 5) {
        players(match: $pattern, limit: $limit) {
          id
          name
        }
      }`, 
    trigger: actions('PiForm').VALUE_CHANGED,
    request: (a, s) => {
      if (a.id === 'search' && a.fieldID === 'name' & s.form.type === 'Player') {
        return {pattern: a.value};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const graph = {
        nodes: reply.players.map(e => ({id: e.id, label: e.name, type: 'Player'})),
        links: [],
      };
      return update(state, ['graph'], graph);
    },
  });

  registerQuery({
    query: `
      query findClubs($pattern: String, $limit: Int = 5) {
        clubs(match: $pattern, limit: $limit) {
          id
          name
        }
      }`, 
    trigger: actions('PiForm').VALUE_CHANGED,
    request: (a, s) => {
      if (a.id === 'search' && a.fieldID === 'name' & s.form.type === 'Club') {
        return {pattern: a.value};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const graph = {
        nodes: reply.clubs.map(e => ({id: e.id, label: e.name, type: 'Club'})),
        links: [],
      };
      return update(state, ['graph'], graph);
    },
  });

  registerQuery({
    query: `
      query findNationalTeams($pattern: String, $limit: Int = 5) {
        nationalTeams(match: $pattern, limit: $limit) {
          id
          name
        }
      }`, 
    trigger: actions('PiForm').VALUE_CHANGED,
    request: (a, s) => {
      if (a.id === 'search' && a.fieldID === 'name' & s.form.type === 'Nat. Team') {
        return {pattern: a.value};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const graph = {
        nodes: reply.nationalTeams.map(e => ({id: e.id, label: e.name, type: 'Nat. Team'})),
        links: [],
      };
      return update(state, ['graph'], graph);
    },
  });

  registerQuery({
    query: `query expandPlayer($id: String)  {
      players(id: $id) {
        id
        name
        represents {
          id
          name
        }
        playsFor {
          id
          name
        }
      }
    }`,
    trigger: actions('NETWORK').ON_NODE,
    request: (a, s) => {
      const node = a.node;
      if (node.type === 'Player') {
        return {id: node.id};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const p = reply.players[0];
      if (!p) {
        // something went wrong
        return state;
      }
      let nodes = state.graph.nodes;
      let links = state.graph.links;

      const club = p.playsFor;
      if (club) {
        nodes = addNode(nodes, club.id, club.name, 'Club');
        links = addLink(links, p.id, club.id, 'playsFor');
      }

      const nat = p.represents;
      if (nat) {
        nodes = addNode(nodes, nat.id, nat.name, 'Nat. Team');
        links = addLink(links, p.id, nat.id, 'represents');
      }
      return update(state, ['graph'], {nodes, links});
    },
  });

  registerQuery({
    query: `query expandClub($id: String)  {
      clubs(id: $id) {
        id
        name
        players {
          id
          name
          represents {
            id
          }
        }
      }
    }`,
    trigger: actions('NETWORK').ON_NODE,
    request: (a, s) => {
      const node = a.node;
      if (node.type === 'Club') {
        return {id: node.id};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const c = reply.clubs[0];
      if (!c) {
        // something went wrong
        return state;
      }
      return addPlayers(state, c.players, c.id, 'represents');
    },
  });

  registerQuery({
    query: `query expandNatTeam($id: String)  {
      nationalTeams(id: $id) {
        id
        name
        players {
          id
          name
          playsFor {
            id
          }
        }
      }
    }`,
    trigger: actions('NETWORK').ON_NODE,
    request: (a, s) => {
      const node = a.node;
      if (node.type === 'Nat. Team') {
        return {id: node.id};
      }
      return undefined; // ignore
    }, 
    reply: (state, reply) => {
      const nt = reply.nationalTeams[0];
      if (!nt) {
        // something went wrong
        return state;
      }
      return addPlayers(state, nt.players, nt.id, 'playsFor');
    },
  })
}

function addPlayers(state, players, forID, optLink) {
  let nodes = state.graph.nodes;
  let links = state.graph.links;

  if (players) {
    players.forEach(p => {
      nodes = addNode(nodes, p.id, p.name, 'Player');
      links = addLink(links, p.id, forID, 'playsFor');
      const ol = p[optLink];
      if (ol) {
        links = addLink(links, p.id, ol.id, 'playsFor');
      }
    });
  }
  return update(state, ['graph'], {nodes, links});
}

function addNode(nodes, id, label, type) {
  if (nodes.find(e => e.id === id) === undefined) {
    return [ ...nodes, {id, label, type}];
  } else {
    return nodes;
  }
}

function addLink(links, id1, id2, type) {
  const f = links.find(e => (e.source === id1 && e.target === id2) || (e.source === id2 && e.target === id1));
  if (f === undefined) {
    return [ ...links, {source: id1, target: id2, type}];
  } else {
    return links;
  }
}