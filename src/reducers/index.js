import { combineReducers } from 'redux';
import tasks from './tasks';

const taskApp = combineReducers({
  tasks,
});

export default taskApp;