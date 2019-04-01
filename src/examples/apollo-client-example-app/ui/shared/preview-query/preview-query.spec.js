import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';
import { graphql } from 'react-apollo';
import { previewQuery } from './preview-query.component';

jest.mock('react-apollo', () => ({
  graphql: jest.fn()
}));

describe('preview-query.component.jsx', () => {
  describe('#previewQuery', () => {
    describe('snapshots', () => {
      it('renders child HOC when not loading', () => {
        const mockHoc = () => <div />;
        graphql.mockReturnValue(child => child({ loading: false }));
        const wrapper = shallow(previewQuery('gqlString')(mockHoc));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
      });

      it('renders spinner when loading', () => {
        const mockHoc = () => <div />;
        graphql.mockReturnValue(child => child({ loading: true }));
        const wrapper = shallow(previewQuery('gqlString')(mockHoc));
        expect(shallowToJson(wrapper)).toMatchSnapshot();
      });
    });

    it('calls #graphql with the argument queryStr and options', () => {
      const mockOptions = jest.fn();
      previewQuery('gqlString', mockOptions)(() => <div />);
      expect(graphql).toHaveBeenCalledWith('gqlString', {
        options: mockOptions,
        props: expect.any(Function)
      });
    });
  });
});
