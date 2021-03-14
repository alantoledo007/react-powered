import React, { createContext } from "react";
import { Provider } from "react-redux";

export { reducer } from "./redux/reducer";
export { default as List } from "./views/List";
export { default as Create } from "./views/Create";
export { default as Update } from "./views/Update";

export const ConfigContext = createContext({});

const defaultConfig = {
  base_url: "",
  headers: {},

  list: {
    path: "/",
    data_map: "",
    actions: {
      active: true,
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
export default function FastReactUI({ store, children, config }) {
  return (
    <Provider store={store}>
      <ConfigContext.Provider value={{ ...mapConfig(config) }}>
        {children}
      </ConfigContext.Provider>
    </Provider>
  );
}
