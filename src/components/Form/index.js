import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import React from 'react';
import {useForm} from 'react-hook-form';
import isReact from 'is-react';
import {yupResolver} from '@hookform/resolvers/yup';
import useConfig from '../../hooks/useConfig';
import {useDispatch} from 'react-redux';
import {send} from '../../redux/records.slice';

export default function Form(props) {
  const {
    config,
    schema,
    fields,
    defaultValues,
    HeaderComponent,
    FooterComponent,
  } = props;
  const ctxConfig = useConfig();
  const formConfig = schema ? {resolver: yupResolver(schema)} : {};

  const dispatch = useDispatch();

  const {register, errors, handleSubmit} = useForm(formConfig);

  const toLower = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string')
      throw Error('The "type" property should be a String');
    return value.toLowerCase();
  };

  const debugComponent = (Component) => {
    if (!isReact.component(Component))
      throw Error('The funcion should return a React component');
    return <Component />;
  };

  const onSubmit = async (data) => {
    await send({
      config: {
        ...ctxConfig,
        send: config,
      },
      data,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      {HeaderComponent && <HeaderComponent />}
      {fields.map((item, key) => {
        if (typeof item === 'function')
          return debugComponent(item({defaultValue: '', register}));

        const {name, label, rows, defaultValue, helperText} = item;
        const type = toLower(item.type);
        const defaultProps = {
          name,
          label,
          rows,
          inputRef: register,
          defaultValue:
            defaultValue || defaultValues ? defaultValues[name] : undefined,
          helperText: (errors[name] && errors[name].message) || helperText,
          error: typeof errors[name] !== 'undefined',
        };

        if (type === 'textarea') {
          return (
            <Box mb={3} key={key}>
              <TextField
                multiline
                variant="outlined"
                rows={4}
                {...defaultProps}
              />
            </Box>
          );
        }

        if (type === 'checkbox') {
          return (
            <Box mb={3} key={key}>
              <FormControl error={typeof errors[name] !== 'undefined'}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!defaultValue}
                      color="primary"
                      inputRef={register}
                    />
                  }
                  label={label}
                />
                {((errors[name] && errors[name].message) || helperText) && (
                  <FormHelperText>
                    {(errors[name] && errors[name].message) || helperText}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
          );
        }
        return (
          <Box mb={3} key={key}>
            <TextField type={type} variant="outlined" {...defaultProps} />
          </Box>
        );
      })}
      {FooterComponent && <FooterComponent />}
    </Box>
  );
}
