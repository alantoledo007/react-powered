import React, {useContext, useState} from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
} from '@material-ui/core';
import {ConfigContext} from '../..';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {
  reactUiMakerUpdate,
  reactUiMakerSetDataToUpdate,
} from '../../redux/actions';

export default function Update(props) {
  const config = useContext(ConfigContext);
  const {record} = config;
  const data_to_update = useSelector(
    (state) =>
      state.react_ui_maker_reducer[record] &&
      state.react_ui_maker_reducer[record].data_to_update,
  );
  const dispatch = useDispatch();
  if (typeof window === 'undefined') return null;
  useState(() => {
    if (data_to_update) return;
    dispatch(reactUiMakerSetDataToUpdate(null, config));
  }, [data_to_update]);

  if (!data_to_update) return null;

  if (config.update.component) {
    return (
      <config.update.component
        fields={config.update.fields || config.create.fields}
        defaultValues={data_to_update.defaultValues}
      />
    );
  }
  return <Form data_to_update={data_to_update} config={config} />;
}

const Form = (props) => {
  const [loading, setLoading] = useState(false);
  const {
    data_to_update,
    config,
    config: {update, create},
  } = props;
  const dispatch = useDispatch();

  const {register, handleSubmit, errors} = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    dispatch(reactUiMakerUpdate(data_to_update.pk, data, config)).finally(
      () => {
        setLoading(false);
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {(update.fields || create.fields).map((item) => (
        <div key={item.name}>
          <FormControl>
            <InputLabel htmlFor={item.key}>
              {item.label || item.name}
            </InputLabel>
            <Input
              id={item.name}
              name={item.name}
              type={item.type || 'text'}
              aria-describedby={item.placeholder || item.name}
              placeholder={item.placeholder || item.name}
              inputRef={register}
              defaultValue={data_to_update.defaultValues[item.name]}
              disabled={loading}
            />
            {item.helper_text && (
              <FormHelperText>{item.helper_text}</FormHelperText>
            )}
          </FormControl>
        </div>
      ))}
      <Grid container>
        {update.cancel && (
          <Grid item>
            <Button disabled={loading} type="button">
              {update.cancel}
            </Button>
          </Grid>
        )}
        {update.reset && (
          <Grid item>
            <Button disabled={loading} type="reset">
              {update.reset}
            </Button>
          </Grid>
        )}
        {update.submit && (
          <Grid item>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              color="primary">
              Enviar
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
};
