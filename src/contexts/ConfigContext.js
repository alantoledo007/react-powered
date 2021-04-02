import {createContext} from 'react';

const ConfigContext = createContext({
  name: null,
  base_uri: null,
  headers: {},
});

export default ConfigContext;
