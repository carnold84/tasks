import PubSub from 'pubsub-js';
import _cloneDeep from 'lodash/cloneDeep';

import config from '../config';

class Store {
    
    ENDPOINT = config.production.ENDPOINT;
    TASKS_ENDPOINT = undefined;

    static EVENTS = {
        TASKS_RECEIVED: 'tasks/tasks_received',
        TASK_CREATE: 'tasks/task_create',
        TASK_UPDATE: 'tasks/task_update',
        TASK_DELETE: 'tasks/task_delete',
    };
    
    state = {
        tasks: [],
        tasksById: {},
        subTasksByParentId: {},
    };

    constructor() {
        
        if (process.env.NODE_ENV === 'development') {
            this.ENDPOINT = config.development.ENDPOINT;
        }
        
        this.TASKS_ENDPOINT = `${this.ENDPOINT}/tasks`;

        PubSub.subscribe(Store.EVENTS.TASK_CREATE, (event, {text, parentId}) => {
            this.createTask(text, parentId);
        });
        
        PubSub.subscribe(Store.EVENTS.TASK_UPDATE, (event, task) => {
            this.updateTask(task);
        });
        
        PubSub.subscribe(Store.EVENTS.TASK_DELETE, (event, id) => {
            this.deleteTask(id);
        });
        
        this.fetchTasks();
    }

    fetchTasks = () => {
        fetch(this.TASKS_ENDPOINT)
            .then(response => response.json())
            .then(json => this.receiveTasks(json));
    };

    receiveTasks = (tasksData) => {
        let tasks = [];
        let tasksById = {};
        let subTasksByParentId = {};

        // loop through all returned tasks and add to array
        tasksData.forEach(task => {
            
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

        this.state = {
            tasks,
            tasksById,
            subTasksByParentId,
        };

        PubSub.publish(Store.EVENTS.TASKS_RECEIVED);
    };

    receiveTask = (task) => {
        // create new arrays
        let tasks = _cloneDeep(this.state.tasks);
        let tasksById = _cloneDeep(this.state.tasksById);
        let subTasksByParentId = _cloneDeep(this.state.subTasksByParentId);

        // store the received task
        let received_task = task;

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

                tasks = this.state.tasks.map(task => {

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

        this.state = {
            tasks,
            tasksById,
            subTasksByParentId,
        };
        
        PubSub.publish(Store.EVENTS.TASKS_RECEIVED);
    };
    
    fetchTask = (id) => {
        fetch(`${this.TASKS_ENDPOINT}/${id}`)
            .then(response => response.json())
            .then(json => this.receiveTask(json));
    };

    createTask = (text, parentId) => {
        const params = {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text, parentId}),
        };

        fetch(this.TASKS_ENDPOINT, params)
            .then(response => response.json())
            .then(() => {
                this.fetchTasks();
            });
    };
    
    updateTask = (task) => {
        console.log('updateTask', task)
        const url = `${this.TASKS_ENDPOINT}/${task.id}`;

        const params = {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        };

        fetch(url, params)
            .then(response => {
                console.log(response);
            })
            .then(() => {
                this.fetchTask(task.id);
            });
    };
    
    deleteTask = (id) => {
        const url = `${this.TASKS_ENDPOINT}/${id}`;

        const params = {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
            },
        };

        fetch(url, params)
            .then(response => {
                console.log(response);
            })
            .then(() => {
                this.fetchTasks();
            });
    };

    getState = () => {
        return this.state;
    };
}

export default Store;