import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {};

const slice = createSlice({
  name: 'react_ui_maker',
  initialState,
  reducers: {
    setDetails(state, action) {
      const {record, data} = action.payload;
      state[record] = {
        ...state[record],
        details: data,
      };
    },
    clearDetails(state, action) {
      state[action.payload] = {
        ...state[action.payload],
        details: null,
      };
    },
  },
});

export const {setDetails, clearDetails} = slice.actions;
export default slice.reducer;

export const send = async (props) => {
  const {
    config,
    config: {send},
    data,
  } = props;
  return axios[send.method](
    `${config.base_uri}${send.path}`,
    send.dataMap(data),
    {
      headers: {...config.headers, ...send.headers},
    },
  ).catch((error) => send.onRequestError(error));
};

export const read = (config) => (dispatch) => {
  const {reader} = config;
  return axios
    .get(`${config.base_uri}${reader.path}`, {
      headers: {
        ...config.headers,
        ...reader.headers,
      },
    })
    .then(async (res) => {
      return dispatch(
        setDetails({record: config.name, data: reader.dataMap(res.data)}),
      );
    })
    .catch((error) => reader.onRequestError(error));
};

export const readMany = (config) => (dispatch) => {};
