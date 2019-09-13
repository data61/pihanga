import environment from 'environments/environment';

const state = {
  form: {
    type: 'Player',
  },
  graph: {nodes: [], links: []},
  pihanga: { 
    // hack: Doesn't properly merge maps between here and state
    search: { 
      values: {
        type: 'Player',
        name: '',
  }}},
};
export default state;

if (environment.debugEnabled) {
  state.step = 'overview';
  state.graph = {
    nodes: [
      {
        id: 'wayne_rooney',
        label: 'Wayne Rooney',
        type: 'Player'
      },
      {
        id: 'manchester_united',
        label: 'Manchester United',
        type: 'Club'
      },
      {
        id: 'england',
        label: 'England',
        type: 'Nat. Team'
      }
    ],
    links: [
      {
        source: 'wayne_rooney',
        target: 'manchester_united',
        type: 'playsFor'
      },
      {
        source: 'wayne_rooney',
        target: 'england',
        type: 'represents'
      }
    ]
  };
}
