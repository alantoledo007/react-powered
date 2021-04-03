import React from 'react';
import Show from '../components/Show';
import List from '../components/List';

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

Reader.prototype.list = function (CustomComponent) {
  return ({columns, containerProps}) => (
    <List
      CustomComponent={CustomComponent}
      config={this.config}
      columns={columns}
      containerProps={containerProps}
    />
  );
};

export default Reader;
