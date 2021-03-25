import {
  REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE,
  REACT_UI_MAKER_CREATE,
  REACT_UI_MAKER_DATA_TO_UPDATE,
  REACT_UI_MAKER_DESTROY,
  REACT_UI_MAKER_LIST,
  REACT_UI_MAKER_SHOW,
  REACT_UI_MAKER_UPDATE,
} from "./actions";

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REACT_UI_MAKER_LIST:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: action.payload.data,
        },
      };
    case REACT_UI_MAKER_CREATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: undefined,
        },
      };
    case REACT_UI_MAKER_DATA_TO_UPDATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          data_to_update: {
            ...(state[action.payload.record]
              ? state[action.payload.record].data_to_update
              : {}),
            defaultValues: action.payload.data,
            pk: action.payload.pk,
          },
        },
      };
    case REACT_UI_MAKER_UPDATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: undefined,
        },
      };
    case REACT_UI_MAKER_SHOW:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          show: action.payload.data,
        },
      };
    case REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          data_to_update: undefined,
        },
      };

    case REACT_UI_MAKER_DESTROY:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: undefined,
        },
      };

    default:
      return state;
  }
};
