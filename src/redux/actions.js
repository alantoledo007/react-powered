import axios from "axios";

export const REACT_UI_MAKER_LIST = "REACT_UI_MAKER_LIST";
export const REACT_UI_MAKER_CREATE = "REACT_UI_MAKER_CREATE";
export const REACT_UI_MAKER_UPDATE = "REACT_UI_MAKER_UPDATE";
export const REACT_UI_MAKER_DESTROY = "REACT_UI_MAKER_DESTROY";
export const REACT_UI_MAKER_DATA_TO_UPDATE = "REACT_UI_MAKER_DATA_TO_UPDATE";
export const REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE =
  "REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE";
export const REACT_UI_MAKER_SHOW = "REACT_UI_MAKER_SHOW";

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

const URLHelper = () => {
  const paths = window.location.pathname
    .split("/")
    .filter((item) => item !== "");
  return {
    paths,
    getParam: (param) =>
      new URLSearchParams(document.location.search.substring(1)).get(param),
  };
};

const pathHandler = (base_url, path) => {
  return String(path).startsWith("http") ? path : base_url + path;
};

export const reactUiMakerList = ({
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
          type: REACT_UI_MAKER_LIST,
          payload: {
            record,
            data: dataMap(res.data, data_map),
            response: res,
          },
        });
      });
  };
};

export const reactUiMakerCreate = (
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
          type: REACT_UI_MAKER_CREATE,
          payload: {
            record,
            data: res.data,
            response: res,
          },
        });
      });
  };
};

export const reactUiMakerSetDataToUpdate = (
  pk,
  {
    headers: defaultHeaders,
    base_url,
    record,
    update: { headers, getter, default_data_format },
  }
) => {
  const pkHandler = (pk) => {
    if (!pk) {
      return getter.getPk(URLHelper());
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
          type: REACT_UI_MAKER_DATA_TO_UPDATE,
          payload: {
            record,
            data: default_data_format(res.data),
            pk: primaryKey,
          },
        });
      });
  };
};

export const reactUiMakerUpdate = (
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
          type: REACT_UI_MAKER_UPDATE,
          payload: {
            record,
            data: res.data,
            res,
          },
        });
      });
  };
};

export const reactUiMakerShow = ({
  record,
  base_url,
  headers: defaultHeaders,
  show: { path, headers, data_map, getPk },
}) => {
  return (dispatch) => {
    const pk = getPk(URLHelper());
    return axios
      .get(pathHandler(base_url, path).replace(":pk", pk), {
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      })
      .then((res) => {
        return dispatch({
          type: REACT_UI_MAKER_SHOW,
          payload: {
            record,
            data: data_map ? data_map(res.data) : res.data,
            response: res,
          },
        });
      });
  };
};

export const reactUiMakerDestroy = (
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
          type: REACT_UI_MAKER_DESTROY,
          payload: {
            record,
            data: res.data,
            response: res,
          },
        });
      });
  };
};
