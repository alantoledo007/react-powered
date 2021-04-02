import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import ConfigContext from './contexts/ConfigContext';
import store from './redux/store';
export {reducer} from './redux/reducer';
export {default as List} from './views/List';
export {default as Create} from './views/Create';
export {default as Update} from './views/Update';
export {default as Show} from './views/Show';

export {default as DataSender} from './core/DataSender';

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#4285F4',
    },
  },
});

export default function ReactUiMaker({children, config, theme}) {
  return (
    <Provider store={store}>
      <ConfigContext.Provider value={config}>
        <ThemeProvider theme={theme || defaultTheme}>{children}</ThemeProvider>
      </ConfigContext.Provider>
    </Provider>
  );
}
