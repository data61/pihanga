/*
 * Wrapper to make 'sha1-es' work with typescript.
 * Don't know how to make that cleaner.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SHA1 = require('sha1-es');

const sha1 = SHA1.default.hash;
export default sha1;
