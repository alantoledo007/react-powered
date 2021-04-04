import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {};

const slice = createSlice({
  name: 'react_powered',
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
    setMany(state, action) {
      const {record, data} = action.payload;
      state[record] = {
        ...state[record],
        records: data,
      };
    },
    clearMany(state, action) {
      const record = action.payload;
      state[record] = {
        ...state[record],
        records: null,
      };
    },
  },
});

export const {setDetails, clearDetails, setMany, clearMany} = slice.actions;
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

const reader = (config, dispatch, action) => {
  const {reader} = config;
  return axios
    .get(`${config.base_uri}${reader.path}`, {
      headers: {
        ...config.headers,
        ...reader.headers,
      },
    })
    .then((res) => {
      return dispatch(
        action({record: config.name, data: reader.dataMap(res.data)}),
      );
    })
    .catch((error) => reader.onRequestError(error));
};

export const read = (config) => (dispatch) => {
  return reader(config, dispatch, setDetails);
};

export const readMany = (config) => (dispatch) => {
  return reader(config, dispatch, setMany);
};

export const destroy = (config) => (dispatch) => {
  const {destroyer} = config;
  return axios
    .delete(`${config.base_uri}${destroyer.path}`, {
      headers: {
        ...config.headers,
        ...destroyer.headers,
      },
    })
    .then(() => {
      return dispatch(clearMany(config.name));
    })
    .catch((error) => {
      destroyer.onRequestError(error);
    });
};
