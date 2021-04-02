import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {};

const records = createSlice({
  name: 'records',
  initialState,
  reducers: {},
});

//export const {} = records.actions;

export const send = async (props) => {
  const {
    config,
    config: {send},
    data,
  } = props;
  console.log(send.dataMap(data));
  return axios[send.method](
    `${config.base_uri}${send.path}`,
    send.dataMap(data),
    {
      headers: {...config.headers, ...send.headers},
    },
  ).catch((error) => send.onRequestError(error));
};

export default records;
