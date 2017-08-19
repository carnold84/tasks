import _cloneDeep from 'lodash/cloneDeep';
import * as types from './actionTypes';

const initialState = {
    isFetching: false,
    tasks: undefined,
    tasksById: undefined,
    subTasksByParentId: undefined,
};

const reduce = (state = initialState, action = {}) => {

    let tasks = undefined;
    let tasksById = undefined;
    let subTasksByParentId = undefined;
    let isFetching = undefined;
    
    switch (action.type) {
            
        case types.REQUEST_TASKS:

            isFetching = true;

            return {
                ...state,
                isFetching,
            };
            
        case types.RECEIVE_TASKS:

            isFetching = false;

            tasks = [];
            tasksById = {};
            subTasksByParentId = {};

            // loop through all returned tasks and add to array
            action.tasks.forEach(task => {
                
                // normalise _id to id
                task.id = task.id ? task.id : task._id;

                // store task indexed by id
                tasksById[task.id] = task;
                
                // if it has a parentId then add it to parent task
                if (task.parentId) {

                    // check if parent already has children otherwise
                    // create new array for children
                    if (subTasksByParentId[task.parentId] === undefined) {
                        subTasksByParentId[task.parentId] = [];
                    }

                    // add task to it's parent
                    subTasksByParentId[task.parentId].push(task);
                } else {

                    // not a child task so add to main tasks
                    tasks.push(task);
                }
            });

            // loop through main tasks and assign children
            tasks.forEach(task => {
                task.children = subTasksByParentId[task.id];
            });

            return {
                isFetching,
                tasks,
                tasksById,
                subTasksByParentId,
            };
            
        case types.RECEIVE_TASK:

            isFetching = false;

            // create new arrays
            tasks = _cloneDeep(state.tasks);
            tasksById = _cloneDeep(state.tasksById);
            subTasksByParentId = _cloneDeep(state.subTasksByParentId);

            // store the received task
            let received_task = action.task;

            // normalise _id to id
            received_task.id = received_task.id ? received_task.id : received_task._id;
            
            // task is an existing one
            if (tasksById[received_task.id]) {
                
                // check if it's a subtask
                if (received_task.parentId) {

                    // ref to parents sub tasks
                    let sub_tasks = subTasksByParentId[received_task.parentId];

                    // loop through sub tasks and replace existing one
                    sub_tasks = sub_tasks.map(subTask => {

                        if (received_task.id === subTask.id) {
                            return received_task;
                        }

                        return subTask;
                    });
                    
                    let parent = tasksById[received_task.parentId];

                    if (parent) {
                        parent.children = sub_tasks;
                    }
                } else {

                    tasks = state.tasks.map(task => {

                        if (received_task.id === task.id) {

                            received_task.children = subTasksByParentId[received_task.id];

                            return received_task;
                        }

                        return task;
                    });
                }
            } else {
            
                if (received_task.parentId) {

                    if (subTasksByParentId[received_task.parentId] === undefined) {
                        subTasksByParentId[received_task.parentId] = [];
                    }
                    
                    let sub_tasks = subTasksByParentId[received_task.parentId];

                    sub_tasks.push(received_task);

                    let parent = tasksById[received_task.parentId];

                    if (parent) {
                        parent.children = sub_tasks;
                    }
                }

                tasks = [...tasks];

                tasks.push(received_task);
            }
            
            tasksById[received_task.id] = received_task;

            return {
                isFetching,
                tasks,
                tasksById,
                subTasksByParentId,
            };

        default:
            return state;
    }
};

export default reduce;

// selectors

export const getTasks = (state) => {
    return state.tasks;
};

export const getTasksById = (state) => {
    return state.tasksById;
};