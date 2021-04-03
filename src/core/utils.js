export const getRecord = (state, config, prop) => {
  if (!config.name) return null;
  if (!state.react_ui_maker) return null;
  if (!state.react_ui_maker[config.name]) return null;
  return state.react_ui_maker[config.name][prop];
};
