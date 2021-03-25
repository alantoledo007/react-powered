import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { reducer as react_ui_maker_reducer } from "./reducer";
const store = createStore(
  combineReducers({
    react_ui_maker_reducer,
  }),
  compose(applyMiddleware(thunk))
);
export default store;
