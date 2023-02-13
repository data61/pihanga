import environment from 'environments/environment';

const state = {
};
export default state;

if (environment.debugEnabled) {
  state.step = 'overview';
}
