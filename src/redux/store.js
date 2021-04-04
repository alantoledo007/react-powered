import thunk from 'redux-thunk';
import slice from './slice';
import {configureStore} from '@reduxjs/toolkit';

const reducer = {react_powered: slice};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(thunk);
  },
});

export default store;
