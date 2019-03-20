/**
 * Place all global mock or setup for unit testing here.
 *
 * 'react-script' will load this file before any other '*.spec.js'
 */

/* eslint-disable import/no-extraneous-dependencies */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
