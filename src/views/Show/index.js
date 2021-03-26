import {Divider, List, ListItem, ListItemText} from '@material-ui/core';
import React, {useContext, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {reactUiMakerShow} from '../../redux/actions';
import {ConfigContext} from '../..';

export default function Show() {
  const config = useContext(ConfigContext);
  const details = useSelector(
    (state) =>
      config &&
      state.react_ui_maker_reducer[config.record] &&
      state.react_ui_maker_reducer[config.record].show,
  );
  const dispatch = useDispatch(config);

  useEffect(() => {
    dispatch(reactUiMakerShow(config));
  }, []);

  if (!details) return null;

  if (config.show.component) {
    return <config.show.component details={details} />;
  }

  return (
    <List component="nav">
      {config.show.attributes.map((item, key) => (
        <ListItem key={key}>
          <ListItemText
            primary={item.label || item.key}
            secondary={details[item.key]}
          />
        </ListItem>
      ))}
    </List>
  );
}
