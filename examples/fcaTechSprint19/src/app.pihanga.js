
const RINGS = ['UK Inner Trust Ring', 'EU Comprehensive Ring'];
const QUESTIONS = [
  {q: 'How many accounts does this customer have?', a: 'account'},
  {q: 'How many accounts have been dormant for three months?', a: 'account'},
  {q: 'What is the average transaction over the last three months?', a: 'pound'},
  {q: 'What is the maximum transaction amount over the last three months?', a: 'pound'},
  {q: 'Have you noticed spikes in transactions?', a: ''},
];

// -  How many accounts are held by a UBO with passport number X
// - Of these, how many have been dormant for three months
// - what is the average transaction amount over the last three months across these accounts
// - what is the maximum transaction amount over the last three months

const page = {
  page: {
    cardType: 'SimplePage',
    contentCard: s => s.step, //'entryForm',
    maxWidth: '700px', //'md',
    signature: 'Built with love by the TechLaunderers'
  },
  // router: {
  //   cardType: 'Router',
  //   contentCard: s => s.step, //'entryForm',
  // },
  passport: {
    cardType: 'PiTitledPage',
    contentCard: 'form',
    title: 'Query The Ring',
    avatar: 'rotate_right',
    mui: {content: {style: {padding: 30}}},
  },

  form: {
    cardType: 'PiForm',
    title: 'Ask the Ring',
    submitLabel: 'Send Query',
    //submitLabel: {label: 'Send Query', disabled: false},
    fields: [
      {id: "passport", type: "textField", label: "Passport#", required: true, grid: {xs: 12, sm:6}, mui: {}},
      {id: "question", type: "selectField", label: "Question", required: true, options: QUESTIONS.map(q => q.q) },
      {id: "ring", type: "selectField", label: "Using Ring", required: true, help: 'Select Ring to use', options: RINGS },
      //{id: "confirm", type: "checkBox", label: "Confirm Importance", required: true, mui: {} },
    ],
    autoFocus: 'passport',
    grid: {xs: 11},
 //   mui: {outer: {style: {paddingTop: 30}}},
    //values: {confirm: 'confirm'},
  },
  spinner: {
    cardType: 'Spinner',
    size: 150,
    thickness:	3.6,
    //topPadding: 100,
    stepTick: 100,
  },
  answer: {
    cardType: 'Answer',
    answer: s => s.answer,
    question: s => s.question,
  },
  scoring: {
    cardType: 'Table',
    showHeader: true, 
    columns: [
      { id: 'id', isKey: true, visible: false },
      { id: 'key', label: 'Name', numeric: true, align: 'right' }, // numeric:true is to force right align
      { id: 'value', label: 'Value', numeric: false,  },
      { id: 'conf', label: 'Confidence', numeric: true  },
    ],
    data: s => s.data,
  },
};

export default { ...page,  };
