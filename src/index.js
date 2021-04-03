import React from 'react';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import ConfigContext from './contexts/ConfigContext';
import store from './redux/store';

export {default as Sender} from './core/Sender';
export {default as Reader} from './core/Reader';

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
