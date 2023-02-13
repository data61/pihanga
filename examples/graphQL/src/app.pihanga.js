
const TYPES = ['Player', 'Club', 'Nat. Team'];

const page = {
  page: {
    cardType: 'PiPageR1',
    title: 'UEFA 2016',
    contentCard: 'content',
    footer: {copyright: 'The Pihanga Team'}
  },

  content: {
    cardType: 'PiGrid',
    spacing: 3,
    content: [{
      cardName: 'search',
      xs: 12, sm: 12, md: 12, item: true,
    }, {
      cardName: 'network',
      xs: 12, sm: 12, md: 12, item: true,
    }],
  }, 

  search: {
    cardType: 'PiForm',
    fields: [{
      id: "type", 
      type: "selectField", 
      label: "Type", 
      required: true, 
      options: TYPES.map((t) => ({id: t, label: t})), 
      defValue: 0,
      grid: {xs: 6, sm:4}, item: true 
    }, {
      id: "name", 
      type: "textField", 
      label: "Name", 
      required: true, 
      grid: {xs: 6, sm:8}, item: true, mui: {}},
    ],
    values: (s) => s.form,
    showSubmit: false,
    grid: {xs: 12},
  },

  network: {
    cardType: 'Network',
    backgroundColor: 'white',
    nodeColorBy: 'type',
    data: s => s.graph,
    colorScheme: 'set1',
    nodeColorTypes: ['Club', 'Nat. Team', 'Player'],
  }, 

};

export default { ...page,  };
