import moment from 'moment';
import humanizeDuration from 'humanize-duration';

const TIME_FORMAT = 'Do MMM YYYY, h:mm a';

/**
 * If the time difference needs to exact, consider using {@link humaniseDuration()}
 * @param s
 * @returns {*} The time difference between the given time and now. Note this time difference can
 * be approximate, e.g if the difference is 200 ms, this will return "few seconds ago".
 */
export function renderTime(s) {
  if (!s) return '';

  const now = Date.now();
  const m = moment(s);
  const daysAgo = (now - m.valueOf()) / 1000 / 86400;
  return daysAgo > 7 ? m.format(TIME_FORMAT) : m.from(now);
}

export const TIME_UNITS_TO_LABEL = {
  s: 'seconds',
  m: 'minutes',
  h: 'hours',
  d: 'days',
};

/**
 *
 * @param value A number value
 * @param unit One of Object.keys(TIME_UNITS_TO_LABEL)
 * @returns {*} The exact humanised string of the given value
 */
export function humaniseDuration(value, unit) {
  // NOTE: these units can be different from moment library, hence not re-using the above units
  const units = ['d', 'h', 'm', 's'];

  return humanizeDuration(
    moment
      .duration(value, unit)
      .asMilliseconds(),
    {
      units,
      conjunction: ' and ',
    },
  );
}
