import * as types from './actionTypes';
import config from '../../config';

let ENDPOINT = config.production.ENDPOINT;

if (process.env.NODE_ENV === 'development') {
    ENDPOINT = config.development.ENDPOINT;
}

const TASKS_ENDPOINT = `${ENDPOINT}/tasks`;

const requestTasks = () => {
    return {
        type: types.REQUEST_TASKS,
    }
};

const receiveTasks = (tasks) => {
    return {
        type: types.RECEIVE_TASKS,
        tasks: tasks,
        receivedAt: Date.now(),
    };
};

const fetchTasks = () => {
    return dispatch => {
        dispatch(requestTasks());

        return fetch(TASKS_ENDPOINT)
            .then(response => response.json())
            .then(json => dispatch(receiveTasks(json)));
    };
}

const receiveTask = (task) => {
    return {
        type: types.RECEIVE_TASK,
        task: task,
    };
};

const fetchTask = (id) => {
    return dispatch => {
        dispatch(requestTasks());

        return fetch(`${TASKS_ENDPOINT}/${id}`)
            .then(response => response.json())
            .then(json => dispatch(receiveTask(json)));
    }
}

const createTask = (text, parentId) => {
    return dispatch => {

        const params = {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text, parentId}),
        };

        return fetch(TASKS_ENDPOINT, params)
            .then(response => response.json())
            .then(() => {
                dispatch(fetchTasks());
            });
    };
}

const updateTask = (task) => {
    return dispatch => {

        const url = `${TASKS_ENDPOINT}/${task.id}`;

        const params = {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        };

        return fetch(url, params)
            .then(response => console.log(response))
            .then(() => {
                dispatch(fetchTask(task.id));
            });
    };
}

const deleteTask = (id) => {
    return dispatch => {

        const url = `${TASKS_ENDPOINT}/${id}`;

        const params = {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        };

        return fetch(url, params)
            .then(response => console.log(response))
            .then(() => {
                dispatch(fetchTasks());
            });
    };
}

export { fetchTasks, createTask, updateTask, deleteTask };