import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import isReact from 'is-react';
import {yupResolver} from '@hookform/resolvers/yup';
import useConfig from '../../hooks/useConfig';
import {read, send} from '../../redux/slice';
import {useDispatch, useSelector} from 'react-redux';
import {getRecord} from '../../core/utils';

export default function Form(props) {
  const {
    config,
    schema,
    fields,
    defaultValues,
    HeaderComponent,
    FooterComponent,
    containerProps,
    CustomComponent,
  } = props;
  const ctxConfig = useConfig();
  const formConfig = schema ? {resolver: yupResolver(schema)} : {};

  const {register, errors, handleSubmit, watch} = useForm(formConfig);
  const readerDefaultValues = useSelector((state) =>
    getRecord(state, ctxConfig),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!config.reader) return;
    const getDefaultValues = async () => {
      await dispatch(read({...ctxConfig, reader: config.reader}));
    };
    getDefaultValues();
  }, [dispatch]);

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

  const handleDefaultValue = (prop) => {
    if (readerDefaultValues !== null) {
      if (readerDefaultValues[prop]) return readerDefaultValues[prop];
    }
    if (defaultValues !== undefined) {
      if (defaultValues[prop]) return defaultValues[prop];
    }
    return null;
  };

  if (CustomComponent)
    return (
      <CustomComponent
        loading={!!(config.reader && !readerDefaultValues)}
        details={readerDefaultValues}
        onSubmit={handleSubmit(onSubmit)}
        watch={watch}
        errors={errors}
        register={register}
      />
    );

  if (config.reader && !readerDefaultValues) return null;
  return (
    <Box
      py={4}
      px={2}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      {...containerProps}>
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
          defaultValue: defaultValue || handleDefaultValue(name),
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
                      checked={!!(defaultValue || handleDefaultValue(name))}
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
      {(FooterComponent && <FooterComponent />) || (
        <Box>
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
}
