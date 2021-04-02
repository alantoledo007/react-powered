import React from 'react';
import Form from '../components/Form';

function CreateRecord(config) {
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

CreateRecord.prototype.createForm = function (fields, defaultValues, schema) {
  return () => (
    <Form
      config={this.config}
      fields={fields}
      defaultValues={defaultValues}
      schema={schema}
    />
  );
};

export default CreateRecord;
