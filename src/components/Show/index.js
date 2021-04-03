import React from 'react';
import {Box, List, ListItem, ListItemText} from '@material-ui/core';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getRecord} from '../../core/utils';
import useConfig from '../../hooks/useConfig';
import {clearDetails, read} from '../../redux/slice';

export default function Show(props) {
  const {config, attributes, containerProps, CustomComponent} = props;
  const ctxConfig = useConfig();
  const dispatch = useDispatch();
  const details = useSelector((state) => getRecord(state, ctxConfig));

  useEffect(() => {
    dispatch(read({...ctxConfig, reader: config}));
    return () => {
      dispatch(clearDetails(ctxConfig.name));
    };
  }, [dispatch]);

  if (CustomComponent)
    return <CustomComponent loading={!details} details={details} />;

  if (!details) return null;

  return (
    <Box {...containerProps}>
      <List component="nav">
        {attributes.map((item, key) => (
          <ListItem key={key}>
            <ListItemText
              primary={item.label || item.key}
              secondary={details[item.key]}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
