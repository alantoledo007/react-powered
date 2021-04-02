import {useContext} from 'react';
import ConfigContext from '../contexts/ConfigContext';

export default function useConfig() {
  const ctx = useContext(ConfigContext);
  return ctx;
}
