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
                isFetching,
            };
            
        case types.RECEIVE_TASKS:

            isFetching = false;

            tasks = [];
            tasksById = {};
            subTasksByParentId = {};

            action.tasks.forEach(task => {
                // normalise _id to id
                task.id = task.id ? task.id : task._id;

                tasksById[task.id] = task;
                
                if (task.parentId) {

                    if (subTasksByParentId[task.parentId] === undefined) {
                        subTasksByParentId[task.parentId] = [];
                    }

                    subTasksByParentId[task.parentId].push(task);
                } else {

                    tasks.push(task);
                }
            });

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