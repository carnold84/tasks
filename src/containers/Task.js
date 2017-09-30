import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List';
import Button from 'material-ui/Button';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import AddIcon from 'material-ui-icons/Add';
import EditIcon from 'material-ui-icons/Edit';

import { createTask, updateTask } from '../store/tasks/actions';

import Item from './Item';

import EditTextInput from '../components/EditTextInput';
import EditDialog from '../components/EditDialog';

import { FabContainer } from '../styles';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    opacity: ${props => props.show ? '1' : '0'};
    transform: translate3d(${props => props.show ? '0, 0, 0' : '0, 50%, 0'});
    transition: transform 150ms ease-in-out, opacity 150ms ease-in-out;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: ${props => props.isVisible ? 'flex' : 'none'};
    z-index: 2;
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    flex-grow: 1;
    display: flex;
`;

const TitleInput = styled.div`
    height: 100%;
    align-items: center;
    flex-grow: 1;
    display: flex;
`;

const AppBarTitle = styled.h2`
    font-size: 16px;
    align-items: center;
    flex-grow: 1;
    display: flex;
`;

const { object, bool, func } = PropTypes;

class Task extends Component {

    static propTypes = {
        show: bool,
        task: object,
        onClose: func.isRequired,
    };

    static defaultProps = {
        show: false,
        task: undefined,
    };

    static MODES = {
        EDIT_TASK: 'editTask',
        EDIT_SUB_TASK: 'editSubTask',
    };

    state = {
        show: false,
        taskText: '',
        subTaskText: '',
        mode: undefined,
        isVisible: false,
    };

    subTask = undefined;

    onTaskSave = (text) => {
        const { task, dispatch } = this.props;

        if (task === undefined) {
            dispatch(createTask(text));
        } else {
            task.text = text;

            dispatch(updateTask(task));
        }

        this.setState({
            taskText: text,
            mode: undefined,
        });
    }

    onTaskCancel = () => {
        window.history.back();
    }

    onSubTaskSave = (text) => {
        const { task, dispatch } = this.props;

        if (this.subTask === undefined) {
            dispatch(createTask(text, task.id));
        } else {
            this.subTask.text = text;

            dispatch(updateTask(this.subTask));
        }

        this.setState({
            subTaskText: text,
            mode: undefined,
        });
    }

    onSubTaskClose = () => {
        window.history.back();
    }

    onHideComplete = () => {

        this.container.removeEventListener('transitionend', this.onHideComplete);

        this.setState({
            isVisible: false,
        });
    };

    onClose = () => {
        this.props.onClose();
    };

    onEditClick = () => {
        let mode = Task.MODES.EDIT_TASK;
        this.setState({mode});
        window.history.pushState({mode}, mode);
    };

    onAddSubTaskClick = () => {
        let mode = Task.MODES.EDIT_SUB_TASK;
        this.setState({mode});
        window.history.pushState({mode}, mode);
    };
    
    onBack = () => {
        if (this.state.mode === Task.MODES.EDIT_TASK) {
            this.setState({
                mode: undefined,
            });
        } else if (this.state.mode === Task.MODES.EDIT_SUB_TASK) {
            this.setState({
                mode: undefined,
            });
        } else {
            this.onClose();
        }
    };

    componentWillReceiveProps(nextProps) {
        const { show } = this.props;
        const { task } = nextProps;
        
        // only update if changed
        if (nextProps.show !== show) {

            if (nextProps.show === true) {

                const taskText = task ? task.text : '';
                const mode = task ? undefined : Task.MODES.EDIT_TASK;

                if (mode === Task.MODES.EDIT_TASK) {
                    window.history.pushState({mode}, mode);
                }
                window.addEventListener('popstate', this.onBack);

                this.setState({
                    isVisible: true,
                    mode,
                    taskText,
                }, () => {

                    setTimeout(() => {

                        this.setState({
                            show: true,
                        });
                    }, 0);
                });
            } else {
                this.setState({
                    show: false,
                });
                window.removeEventListener('popstate', this.onBack);
            }
        }
    };

    componentDidUpdate() {
        if (this.props.show === false && this.state.isVisible === true) {
            this.container.addEventListener('transitionend', this.onHideComplete);
        }
    };

    render() {
        const { task } = this.props;
        const { show, isVisible, taskText, mode } = this.state;

        let content = undefined;

        if (task && task.children) {
            content = task.children.map((childTask) => {
                return (
                    <Item
                        key={childTask.id}
                        data={childTask} />
                );
            });
        }

        let task_input = (
            <TitleInput>
                <AppBarTitle>{taskText}</AppBarTitle>
                <IconButton
                    color="contrast"
                    aria-label="Edit"
                    onClick={this.onEditClick}>
                    <EditIcon />
                </IconButton>
            </TitleInput>
        );

        let sub_task_dialog = undefined;

        if (mode === Task.MODES.EDIT_TASK) {
            task_input = (
                <TitleInput>
                    <EditTextInput
                        color={'#ffffff'}
                        defaultValue={task ? task.text : undefined}
                        onCancel={this.onTaskCancel}
                        onSubmit={this.onTaskSave}
                    />
                </TitleInput>
            );
        } else if (mode === Task.MODES.EDIT_SUB_TASK) {
            sub_task_dialog = (
                <EditDialog
                    onSubmit={this.onSubTaskSave} />
            );
        }

        return (
            <Container
                innerRef={(el) => this.container = el}
                show={show}
                isVisible={isVisible}>
                <AppBar position="static">
                    <Toolbar disableGutters>
                        <IconButton
                            color="contrast"
                            aria-label="Close"
                            onClick={this.onClose}>
                            <ArrowBackIcon />
                        </IconButton>
                        {task_input}
                    </Toolbar>
                </AppBar>
                <Content>
                    <List disablePadding>
                        {content}
                    </List>
                </Content>
                <FabContainer>
                    <Button
                        fab
                        color="primary"
                        onClick={this.onAddSubTaskClick}>
                        <AddIcon />
                    </Button>
                </FabContainer>
                {sub_task_dialog}
            </Container>
        );
    }
}

export default connect()(Task);
