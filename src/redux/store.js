import thunk from 'redux-thunk';
import records from './records.slice';
import {configureStore} from '@reduxjs/toolkit';

const reducer = {records};

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(thunk);
  },
});

export default store;
