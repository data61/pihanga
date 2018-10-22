const Domain = 'LOGGER:';

export const LOGGER_ACTION_TYPES = {
  EMIT_LOGGED_SOMETHING: `${Domain}EMIT_LOGGED_SOMETHING`,
};

export function emitLoggedSomething(level, message, object) {
//  dispatch({ type: LOGGER_ACTION_TYPES.EMIT_LOGGED_SOMETHING, level, message, object });
}
