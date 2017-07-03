export const addTask = (text) => {
  return {
    type: 'ADD_TASK',
    text,
  }
};

export const toggleTask = (id) => {
  return {
    type: 'TOGGLE_TASK',
    id,
  }
};