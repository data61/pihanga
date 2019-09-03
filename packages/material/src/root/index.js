import initReducers from './root.reducers';

export * from './root.component';
export * from './themedRoot.component';
export * from './root.actions';

export function init(register) {
  initReducers(register.reducer);
}
