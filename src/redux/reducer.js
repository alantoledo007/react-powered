import {
  FAST_REACT_UI_CLEAR_DATA_TO_UPDATE,
  FAST_REACT_UI_CREATE,
  FAST_REACT_UI_DATA_TO_UPDATE,
  FAST_REACT_UI_DESTROY,
  FAST_REACT_UI_LIST,
  FAST_REACT_UI_UPDATE,
} from "./actions";

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FAST_REACT_UI_LIST:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: action.payload.data,
        },
      };
    case FAST_REACT_UI_CREATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: undefined,
        },
      };
    case FAST_REACT_UI_DATA_TO_UPDATE:
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
    case FAST_REACT_UI_UPDATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          records: undefined,
        },
      };
    case FAST_REACT_UI_CLEAR_DATA_TO_UPDATE:
      return {
        ...state,
        [action.payload.record]: {
          ...state[action.payload.record],
          data_to_update: undefined,
        },
      };

    case FAST_REACT_UI_DESTROY:
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
