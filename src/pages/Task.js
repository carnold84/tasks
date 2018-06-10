import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

// material ui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// material ui icons
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import {createTask, deleteTask, updateTask} from '../store/tasks/actions';

import Item from '../containers/Item';

import EditTextInput from '../components/EditTextInput';
import EditDialog from '../components/EditDialog';

import {FabContainer} from '../styles';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
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

const ProgressContainer = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    display: flex;
    z-index: 2;
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

class Task extends Component {
    onTaskDelete = id => {
        this.props.dispatch(deleteTask(id));
    };

    onTaskCompleted = data => {
        this.props.dispatch(updateTask(data));
    };

    onTaskSave = text => {
        const {match, history, tasksById, dispatch} = this.props;
        const id = match.params.id;

        if (id) {
            const task = tasksById[id];
            task.text = text;
            dispatch(updateTask(task));
            history.goBack();
        } else {
            dispatch(createTask(text));
            history.goBack();
        }
    };

    onCancel = text => {
        const {history} = this.props;
        history.goBack();
    };

    onSubTaskSave = text => {
        const {match, history, tasksById, dispatch} = this.props;
        const id = match.params.id;

        if (id) {
            const task = tasksById[id];
            dispatch(createTask(text, task.id));
        } else {
            const sub_task = tasksById[id];
            sub_task.text = text;

            dispatch(updateTask(sub_task));
        }

        history.push(`/task/${id}`);
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    render() {
        const {match, tasksById} = this.props;

        let content = undefined;
        let task = undefined;
        let title = '';
        let task_input = undefined;
        let sub_task_dialog = undefined;

        const id = match.params.id;
        const action = match.params.action;

        if (id) {
            if (tasksById) {
                task = tasksById[id];

                title = task ? task.text : 'Loading';

                task_input = (
                    <TitleInput>
                        <AppBarTitle>{title}</AppBarTitle>
                        <Link to={`/task/${id}/edit`}>
                            <IconButton color={'secondary'} aria-label={'Edit'}>
                                <EditIcon />
                            </IconButton>
                        </Link>
                    </TitleInput>
                );

                if (task && task.children) {
                    content = (
                        <List disablePadding>
                            {task.children.map(childTask => {
                                return (
                                    <Item
                                        key={childTask.id}
                                        data={childTask}
                                        linkify={true}
                                        onDelete={this.onTaskDelete}
                                        onComplete={this.onTaskCompleted}
                                    />
                                );
                            })}
                        </List>
                    );
                }

                if (action === 'new') {
                    sub_task_dialog = <EditDialog onSubmit={this.onSubTaskSave} onCancel={this.onCancel} />;
                } else if (action === 'edit') {
                    task_input = (
                        <TitleInput>
                            <EditTextInput
                                color={'secondary'}
                                defaultValue={task ? task.text : undefined}
                                onSubmit={this.onTaskSave}
                                onCancel={this.onCancel}
                            />
                        </TitleInput>
                    );
                }
            } else {
                content = (
                    <ProgressContainer>
                        <CircularProgress />
                    </ProgressContainer>
                );
            }
        } else {
            task_input = (
                <TitleInput>
                    <EditTextInput color={'secondary'} defaultValue={undefined} onSubmit={this.onTaskSave} />
                </TitleInput>
            );
        }

        return (
            <Container innerRef={el => (this.container = el)}>
                <AppBar position="static">
                    <Toolbar disableGutters>
                        <Link to={'/'}>
                            <IconButton color={'secondary'} aria-label={'Close'} onClick={this.onClose}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Link>
                        {task_input}
                    </Toolbar>
                </AppBar>
                <Content>{content}</Content>
                {task && (
                    <FabContainer>
                        <Link to={`/task/${id}/new`}>
                            <Button variant={'fab'} color={'primary'}>
                                <AddIcon />
                            </Button>
                        </Link>
                    </FabContainer>
                )}
                {sub_task_dialog}
            </Container>
        );
    }
}

const {object} = PropTypes;

Task.propTypes = {
    match: object,
};

const mapStateToProps = state => {
    return {
        tasksById: state.tasks.tasksById,
        subTasksByParentId: state.tasks.subTasksByParentId,
    };
};

export default connect(mapStateToProps, null)(Task);
