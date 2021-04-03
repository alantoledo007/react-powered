import React from 'react';
import Form from '../components/Form';

function Sender(config = {}) {
  this.config = {
    method: 'post',
    path: '/',
    dataMap: (data) => data,
    onRequestError: (error) => {
      console.log(error);
      throw Error('Has occurred an error on the request');
    },
    ...config,
  };
}

Sender.prototype.createForm = function (fields = [], CustomComponent) {
  return ({
    HeaderComponent,
    FooterComponent,
    defaultValues,
    schema,
    containerProps,
  }) => (
    <Form
      CustomComponent={CustomComponent}
      containerProps={containerProps}
      HeaderComponent={HeaderComponent}
      FooterComponent={FooterComponent}
      config={this.config}
      fields={fields}
      defaultValues={defaultValues}
      schema={schema}
    />
  );
};

Sender.prototype.setForm = function (CustomComponent) {
  return this.createForm([], CustomComponent);
};

export default Sender;
