import axios from "axios";

export const FAST_REACT_UI_LIST = "FAST_REACT_UI_LIST";
export const FAST_REACT_UI_CREATE = "FAST_REACT_UI_CREATE";
export const FAST_REACT_UI_UPDATE = "FAST_REACT_UI_UPDATE";
export const FAST_REACT_UI_DESTROY = "FAST_REACT_UI_DESTROY";
export const FAST_REACT_UI_DATA_TO_UPDATE = "FAST_REACT_UI_DATA_TO_UPDATE";
export const FAST_REACT_UI_CLEAR_DATA_TO_UPDATE =
  "FAST_REACT_UI_CLEAR_DATA_TO_UPDATE";

export const dataMap = (data, data_map) => {
  if (!data_map) return data;
  let result = data;
  const arr = data_map.split(".");
  arr.forEach((item) => {
    result = result[item];
  });
  return result;
};

export const dataFormat = (data, data_format) => {
  if (!data_format) return data;
  return data_format(data);
};

const pathHandler = (base_url, path) => {
  return String(path).startsWith("http") ? path : base_url + path;
};

export const fastReactUIList = ({
  headers: defaultHeaders,
  record,
  base_url,
  list: { path, data_map, headers },
}) => {
  return (dispatch) => {
    return axios
      .get(pathHandler(base_url, path), {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      .then((res) => {
        return dispatch({
          type: FAST_REACT_UI_LIST,
          payload: {
            record,
            data: dataMap(res.data, data_map),
            response: res,
          },
        });
      });
  };
};

export const fastReactUICreate = (
  data,
  {
    record,
    base_url,
    headers: defaultHeaders,
    create: { path, headers, data_format },
  }
) => {
  return (dispatch) => {
    return axios
      .post(pathHandler(base_url, path), dataFormat(data, data_format), {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      .then((res) => {
        return dispatch({
          type: FAST_REACT_UI_CREATE,
          payload: {
            record,
            data: res.data,
            response: res,
          },
        });
      });
  };
};

export const fastReactUISetDataToUpdate = (
  pk,
  {
    headers: defaultHeaders,
    base_url,
    record,
    update: { headers, getter, default_data_format },
  }
) => {
  const paths = window.location.pathname
    .split("/")
    .filter((item) => item !== "");

  const pkHandler = (pk) => {
    if (!pk) {
      const URLHelper = {
        paths,
        paths_length: paths.length,
        getParam: (param) =>
          new URLSearchParams(document.location.search.substring(1)).get(param),
      };
      return getter.getPk(URLHelper);
    }
    return pk;
  };
  const primaryKey = pkHandler(pk);
  return (dispatch) => {
    if (!primaryKey)
      return dispatch({
        type: null,
        payload: {
          from: "fast-react-ui",
          record,
          message: "pk has not value",
        },
      });
    return axios
      .get(pathHandler(base_url, getter.path).replace(":pk", primaryKey), {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      .then((res) => {
        return dispatch({
          type: FAST_REACT_UI_DATA_TO_UPDATE,
          payload: {
            record,
            data: default_data_format(res.data),
            pk: primaryKey,
          },
        });
      });
  };
};

export const fastReactUIUpdate = (
  pk,
  data,
  {
    record,
    headers: defaultHeaders,
    base_url,
    update: { headers, path, data_format },
  }
) => {
  return (dispatch) => {
    return axios
      .put(
        pathHandler(base_url, path).replace(":pk", pk),
        data_format ? data_format(pk, data) : data,
        {
          headers: {
            ...defaultHeaders,
            ...headers,
          },
        }
      )
      .then((res) => {
        return dispatch({
          type: FAST_REACT_UI_UPDATE,
          payload: {
            record,
            data: res.data,
            res,
          },
        });
      });
  };
};

export const fastReactUIDestroy = (
  pk,
  { record, base_url, headers: defaultHeaders, destroy: { path, headers } }
) => {
  return (dispatch) => {
    return axios
      .delete(pathHandler(base_url, path).replace(":pk", pk), {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      .then((res) => {
        return dispatch({
          type: FAST_REACT_UI_DESTROY,
          payload: {
            record,
            data: res.data,
            response: res,
          },
        });
      });
  };
};
