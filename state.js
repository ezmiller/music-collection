const getStateReducer = actionsMap => {
  return async (state, action) => {
    const updateFn = actionsMap[action.type]
      ? actionsMap[action.type]
      : undefined;

    return updateFn ? updateFn(state, action) : state;
  };
};

module.exports = {
  getStateReducer
};
