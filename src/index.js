import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { createContext } from "react";
import { Provider } from "react-redux";
import defaultStore from "./redux/store";
export { reducer } from "./redux/reducer";
export { default as List } from "./views/List";
export { default as Create } from "./views/Create";
export { default as Update } from "./views/Update";
export { default as Show } from "./views/Show";

export const ConfigContext = createContext({});

const defaultConfig = {
  base_url: "",
  headers: {},

  list: {
    path: "/",
    data_map: "",
    custom: null,
    attributes: [],
    component: null,
    actions: {
      active: false,
      label: "Actions",
      config: [
        { label: "show", action: "show" },
        { label: "edit", action: "edit" },
        { label: "delete", action: "destroy" },
      ],
    },
  },

  create: {
    path: "/",
  },

  show: {
    path: "/:id",
    attributes: [],
  },

  update: {
    getter: {},
  },

  destroy: {
    path: "/:pk",
    pk: "id",
  },
};

const mapConfig = (config) => {
  return {
    ...defaultConfig,
    ...config,
    list: {
      ...defaultConfig.list,
      ...(config.list || {}),
      actions: {
        ...defaultConfig.list.actions,
        ...(config.list.actions || {}),
      },
    },
    create: {
      ...defaultConfig.create,
      ...(config.create || {}),
    },
    show: {
      ...defaultConfig.show,
      ...(config.show || {}),
    },
    update: {
      ...defaultConfig.update,
      ...(config.update || {}),
    },
    destroy: {
      ...defaultConfig.destroy,
      ...(config.destroy || {}),
    },
  };
};

export const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#4285F4",
    },
  },
});

export default function ReactUiMaker({ store, children, config, theme }) {
  return (
    <Provider store={store || defaultStore}>
      <ConfigContext.Provider value={{ ...mapConfig(config) }}>
        <ThemeProvider theme={theme || defaultTheme}>{children}</ThemeProvider>
      </ConfigContext.Provider>
    </Provider>
  );
}
