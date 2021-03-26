import React, {useContext, useState} from 'react';
import {Button, FormControl, TextField, Grid} from '@material-ui/core';
import {ConfigContext} from '../..';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {reactUiMakerCreate} from '../../redux/actions';

export default function Create(props) {
  const config = useContext(ConfigContext);
  const {create, record} = config;
  const {register, handleSubmit, errors, reset} = useForm();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    reset();
    dispatch(reactUiMakerCreate(data, config)).finally(() => {
      setLoading(false);
    });
  };

  if (config.create.component) {
    return <config.create.component fields={create.fields} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {create.fields.map((item) => (
        <div key={item.name}>
          <FormControl>
            <TextField
              error
              id={item.name}
              name={item.name}
              label={item.label || item.name}
              helperText={
                errors[item.name] && !item.errorHAndler
                  ? item.errorsMessages &&
                    item.errorsMessages[errors[item.name].type]
                    ? item.errorsMessages[errors[item.name].type]
                    : errors[item.name].type
                  : item.helper_text
              }
              inputRef={item.validators ? register(item.validators) : register}
              placeholder={item.placeholder || item.name}
              error={errors[item.name]}
              disabled={loading}
              variant="outlined"
            />
          </FormControl>
        </div>
      ))}
      <Grid container>
        {create.cancel && (
          <Grid item>
            <Button disabled={loading} type="button">
              {create.cancel}
            </Button>
          </Grid>
        )}
        {create.reset && (
          <Grid item>
            <Button disabled={loading} type="reset">
              {create.reset}
            </Button>
          </Grid>
        )}
        {create.submit && (
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
}
