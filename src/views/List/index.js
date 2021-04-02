import React, {useContext, useEffect} from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {ConfigContext} from '../..';
import {reactUiMakerList} from '../../redux/actions';
import Item from './Item';

export default function List(props) {
  const config = useContext(ConfigContext);
  const records = useSelector(
    (state) =>
      state.react_ui_maker_reducer[config.record] &&
      state.react_ui_maker_reducer[config.record].records,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (records) return;
    dispatch(reactUiMakerList(config));
  }, [records]);

  if (config.list.component) {
    return <config.list.component data={records} />;
  }

  const attrs = config.list.attributes;
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {attrs.map((item, key) => (
              <TableCell key={key}>{item.label || item.key}</TableCell>
            ))}
            {config.list.actions.active && (
              <TableCell>{config.list.actions.label}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {records &&
            records.map((item, key) => (
              <Item data={item} config={config} key={key} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
