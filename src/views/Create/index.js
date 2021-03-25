import React, { useContext, useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
} from "@material-ui/core";
import { ConfigContext } from "../..";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { reactUiMakerCreate } from "../../redux/actions";

export default function Create(props) {
  const config = useContext(ConfigContext);
  const { create, record } = config;
  const { register, handleSubmit, errors, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    setLoading(true);
    reset();
    dispatch(reactUiMakerCreate(data, config)).finally(() => {
      setLoading(false);
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {create.fields.map((item) => (
        <div key={item.name}>
          <FormControl>
            <InputLabel htmlFor={item.key}>
              {item.label || item.name}
            </InputLabel>
            <Input
              id={item.name}
              name={item.name}
              type={item.type || "text"}
              aria-describedby={item.placeholder || item.name}
              placeholder={item.placeholder || item.name}
              inputRef={register}
              disabled={loading}
            />
            {item.helper_text && (
              <FormHelperText>{item.helper_text}</FormHelperText>
            )}
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
              color="primary"
            >
              Enviar
            </Button>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
