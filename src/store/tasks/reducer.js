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

            tasksById = {...state.tasksById};
            subTasksByParentId = {...state.subTasksByParentId};

            let new_task = action.task;

            // normalise _id to id
            new_task.id = new_task.id ? new_task.id : new_task._id;

            if (tasksById[new_task.id]) {
            
                if (new_task.parentId) {

                    let sub_tasks = subTasksByParentId[new_task.parentId];

                    sub_tasks = sub_tasks.map(subTask => {

                        if (new_task.id === subTask.id) {
                            return new_task;
                        }

                        return subTask;
                    });

                    let parent = tasksById[new_task.parentId];

                    if (parent) {
                        parent.children = sub_tasks;
                    }
                } else {

                    tasks = state.tasks.map(task => {

                        if (new_task.id === task.id) {
                            return new_task;
                        }

                        return task;
                    });
                }
            } else {
            
                if (new_task.parentId) {

                    if (subTasksByParentId[new_task.parentId] === undefined) {
                        subTasksByParentId[new_task.parentId] = [];
                    }
                    
                    let sub_tasks = subTasksByParentId[new_task.parentId];

                    sub_tasks.push(new_task);

                    let parent = tasksById[new_task.parentId];

                    if (parent) {
                        parent.children = sub_tasks;
                    }
                }

                tasks = [...tasks];

                tasks.push(new_task);
            }
            
            tasksById[new_task.id] = new_task;

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