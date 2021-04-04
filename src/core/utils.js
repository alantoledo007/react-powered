export const getRecord = (state, config, prop) => {
  if (!config.name) return null;
  if (!state.react_powered) return null;
  if (!state.react_powered[config.name]) return null;
  return state.react_powered[config.name][prop];
};
