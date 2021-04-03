import React from 'react';
import {useDispatch} from 'react-redux';
import Show from '../components/Show';
import useConfig from '../hooks/useConfig';
import {read} from '../redux/slice';

function Reader(config = {}) {
  this.config = {
    path: '/',
    dataMap: (data) => data,
    onRequestError: (error) => {
      console.log(error);
      throw Error('Has occurred an error on the request');
    },
    ...config,
  };
}

Reader.prototype.show = function (CustomComponent) {
  return ({attributes, containerProps}) => (
    <Show
      CustomComponent={CustomComponent}
      config={this.config}
      attributes={attributes}
      containerProps={containerProps}
    />
  );
};

export default Reader;
