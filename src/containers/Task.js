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
    transition: transform 300ms ease-in-out, opacity 300ms ease-in-out;
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
    align-items: flex-start;
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

const { string, bool, func } = PropTypes;

class Task extends Component {

    static propTypes = {
        show: bool,
        taskId: string,
        onClose: func.isRequired,
    };

    defaultProps = {
        show: false,
        taskId: undefined,
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

    task = undefined;
    subTask = undefined;

    onTaskSave = (text) => {
        console.log('onTaskSave', text)
        const { dispatch } = this.props;

        if (this.task === undefined) {
            dispatch(createTask(text));
        } else {
            this.task.text = text;

            dispatch(updateTask(this.task));
        }

        this.setState({
            taskText: text,
            mode: undefined,
        });
    }

    onTaskCancel = () => {
        this.setState({
            mode: undefined,
        });
    }

    onSubTaskSave = (text) => {
        const { dispatch } = this.props;

        if (this.subTask === undefined) {
            dispatch(createTask(text, this.task.id));
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
        this.setState({
            mode: undefined,
        });
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
        this.setState({
            mode: Task.MODES.EDIT_TASK,
        });
    };

    onAddSubTaskClick = () => {
        this.setState({
            mode: Task.MODES.EDIT_SUB_TASK,
        });
    };

    componentWillReceiveProps(nextProps) {

        const { show, tasksById } = this.props;
        const { taskId } = nextProps;
        
        // only update if changed
        if (nextProps.show !== show) {

            if (nextProps.show === true) {

                this.task = tasksById[taskId];

                const taskText = this.task ? this.task.text : '';

                this.setState({
                    isVisible: true,
                    mode: undefined,
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
            }
        }
    };

    componentDidUpdate() {
            
        if (this.props.show === false && this.state.isVisible === true) {
            this.container.addEventListener('transitionend', this.onHideComplete);
        }
    };

    render() {
        console.log('Task::render')

        const { show, isVisible, taskText, subTaskText, mode } = this.state;

        let content = undefined;

        /*if (task.subTasks) {
            content = task.subTasks.map((subTask) => {
                return (
                    <ListItem dense button key={subTask.id}>
                        <Checkbox
                            checked={subTask.complete}
                            tabIndex="-1"
                            disableRipple
                        />
                        <ListItemText primary={subTask.name} />
                    </ListItem>
                );
            });
        }*/

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
                        defaultValue={this.task ? this.task.text : undefined}
                        onCancel={this.onTaskCancel}
                        onSubmit={this.onTaskSave}
                    />
                </TitleInput>
            );
        } else if (mode === Task.MODES.EDIT_SUB_TASK) {
            sub_task_dialog = (
                <EditDialog
                    onClose={this.onSubTaskClose} />
            );
        }

        return (
            <Container
                innerRef={(el) => this.container = el}
                show={show}
                isVisible={isVisible}>
                <AppBar position="static">
                    <Toolbar disableGutters>
                        <IconButton color="contrast" aria-label="Close" onClick={this.onClose}>
                            <ArrowBackIcon />
                        </IconButton>
                        {task_input}
                    </Toolbar>
                </AppBar>
                <Content>
                    <List>
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

const mapStateToProps = (state) => {
  return {
    tasksById: state.tasks.tasksById,
  }
}

export default connect(
  mapStateToProps,
  null,
)(Task);
