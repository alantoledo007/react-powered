import React, { useState } from "react";
import { Button, TableCell, TableRow } from "@material-ui/core";
import {
  dataMap,
  reactUiMakerDestroy,
  reactUiMakerSetDataToUpdate,
  REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE,
} from "../../../redux/actions";
import { useDispatch } from "react-redux";

export default function Item({ data, config }) {
  const {
    list: { attributes, actions },
    destroy: { pk: pk_destroy },
    update: {
      getter: { pk: pk_update },
    },
  } = config;

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const getPk = (data, pk) => (typeof pk === "function" ? pk(data) : data[pk]);
  const handleDestroy = (data) => {
    setLoading(true);
    dispatch({
      type: REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE,
      payload: { record: config.record },
    });
    dispatch(reactUiMakerDestroy(getPk(data, pk_destroy), config)).finally(
      () => {
        setLoading(false);
      }
    );
  };
  const handleUpdate = async (data) => {
    setLoading(true);
    dispatch({
      type: REACT_UI_MAKER_CLEAR_DATA_TO_UPDATE,
      payload: { record: config.record },
    });
    dispatch(
      reactUiMakerSetDataToUpdate(getPk(data, pk_update), config)
    ).finally(() => {
      setLoading(false);
    });
  };

  const handleShow = async (data) => {};
  const handleActions = (action) => {
    if (action === "destroy") {
      return () => handleDestroy(data);
    }
    if (action === "update") {
      return () => handleUpdate(data);
    }
    if (action === "show") {
      return () => handleShow(data);
    }
    return () => {};
  };

  return (
    <TableRow>
      {attributes.map((item, key) => (
        <TableCell key={key}>
          {item.component ? (
            <item.component attribute={item.key} value={data[item.key]} />
          ) : item.data_map ? (
            dataMap(data[item.key], item.data_map)
          ) : (
            data[item.key]
          )}
        </TableCell>
      ))}
      {actions.active && actions.config.length > 0 && (
        <TableCell>
          {actions.config.map((item, key) => {
            if (item.component) {
              return <item.component pk={getPk(data, pk_update)} key={key} />;
            }
            return (
              <Button
                key={key}
                disabled={loading}
                onClick={handleActions(item.action)}
              >
                {item.label}
              </Button>
            );
          })}
        </TableCell>
      )}
    </TableRow>
  );
}
