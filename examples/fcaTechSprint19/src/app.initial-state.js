import environment from 'environments/environment';

const state = {
  step: 'passport',
  answer: {}
}
export default state;

if (environment.debugEnabled) {
  state.step = 'passport';
  state.answer = {count: 2, banks: 3};

  state.pihanga = {
    form: {
      values: {
        passport: '44444',
        question: '1',
        ring: '0'
      }
    }
  };

}
