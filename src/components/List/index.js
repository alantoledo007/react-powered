import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getRecord} from '../../core/utils';
import useConfig from '../../hooks/useConfig';
import {readMany} from '../../redux/slice';

export default function List(props) {
  const {config, columns, containerProps, CustomComponent} = props;
  const ctxConfig = useConfig();
  const dispatch = useDispatch();
  const records = useSelector((state) =>
    getRecord(state, ctxConfig, 'records'),
  );

  useEffect(() => {
    dispatch(readMany({...ctxConfig, reader: config}));
  }, [dispatch]);

  if (CustomComponent)
    return <CustomComponent loading={!records} records={records} />;
  return (
    <Box {...containerProps}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((item, key) => (
                <TableCell key={key}>{item.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records &&
              records.map((item, key) => (
                <TableRow key={key}>
                  {columns.map((column, key) => {
                    const data = column.dataMap ? column.dataMap(item) : item;
                    return (
                      <TableCell key={key}>
                        {typeof data === 'function' ? data() : data}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
