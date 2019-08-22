import environment from 'environments/environment';

const state = {
  step: 'passport',
  answer: {}
}
export default state;

if (environment.debugEnabled) {
  state.step = 'passport';
  state.answer = {count: 2, banks: 3};

  state.data = [
    {id: 'firstName', key: 'First Name', value: 'Jim', conf: 50},
    {id: 'lastName', key: 'Last Name', value: 'Smith', conf: 27},
    {id: 'email', key: 'Email', value: 'jim@smith.com', conf: 49}
  ];
}
