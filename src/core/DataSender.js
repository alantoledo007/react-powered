import React from 'react';
import Form from '../components/Form';
import {send} from '../redux/records.slice';

function DataSender(config) {
  this.config = {
    method: 'post',
    path: '/',
    dataMap: (data) => data,
    onRequestError: (error) => {
      console.log(error);
      throw Error('Has occurred an error on try create the record');
    },
    ...config,
  };
}

DataSender.prototype.createForm = function (fields, defaultValues, schema) {
  return ({HeaderComponent, FooterComponent}) => (
    <Form
      HeaderComponent={HeaderComponent}
      FooterComponent={FooterComponent}
      config={this.config}
      fields={fields}
      defaultValues={defaultValues}
      schema={schema}
    />
  );
};

DataSender.prototype.setForm = function (FormComponent) {
  return <FormComponent send={send} />;
};

export default DataSender;
