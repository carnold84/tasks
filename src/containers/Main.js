import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';
import { CircularProgress } from 'material-ui/Progress';

import config from '../config';
import { FabContainer } from '../styles';

import Task from './Task';
import Item from './Item';

import EmptyMessage from '../components/EmptyMessage';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
`;

const MainContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
    z-index: 1;
`;

const Content = styled.div`
    width: 100%;
    height: 100%;
    overflow: auto;
    padding: 0 0 70px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;
    display: flex;
    z-index: 1;
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

const SCREENS = {
    TASK: 'screen/task',
};

const styleSheet = createStyleSheet('Main', {
    appBar: {
        fontFamily: 'inherit',
    },
});

class Main extends Component {

    state = {
        currentScreen: undefined,
        selectedTaskId: undefined,
    };

    onAddTaskClick = () => {

        this.openTask();
    };

    onTaskClick = (task) => {

        this.openTask(task.id);
    };

    openTask = (selectedTaskId) => {

        // hide the task screen
        this.setState({
            currentScreen: SCREENS.TASK,
            selectedTaskId,
        });
        window.history.pushState({ screen: SCREENS.TASK }, SCREENS.TASK);
    };

    onTaskClose = () => {

        // hide the task screen
        this.setState({
            currentScreen: undefined,
            selectedTaskId: undefined,
        });
    };

    componentWillReceiveProps(nextProps) {
        const { currentScreen, selectedTaskId } = this.state;
        
        if (currentScreen === SCREENS.TASK && selectedTaskId === undefined) {
            const selectedTask = nextProps.tasks[nextProps.tasks.length - 1];
            this.setState({
                selectedTaskId: selectedTask.id,
            });
        }
    }
    

    render() {
        const { tasks, tasksById } = this.props;
        const { currentScreen, selectedTaskId } = this.state;

        let content = undefined;

        if (_isEmpty(tasks)) {
            content = (
                <ProgressContainer>
                    <CircularProgress />
                </ProgressContainer>
            );
        } else {
            if (tasks.length > 0) {
                content = (
                    <List disablePadding>
                        {
                            tasks.map((task) => {

                                if (task.children) {
                                    let text = task.children.map(child => {
                                        return child.text;
                                    });
                                    task.subText = text.join(', ');
                                }

                                return (
                                    <Item
                                        key={task.id}
                                        data={task}
                                        linkify={false}
                                        onClick={this.onTaskClick}
                                        onDelete={this.onTaskDelete}
                                        onCompleted={this.onTaskCompleted} />
                                );
                            })
                        }
                    </List>
                );
            } else {
                content = (
                    <EmptyMessage
                        title={'You Have No Tasks.'}
                        text={'Feel Free To Add One.'}
                        action={{
                            title: 'Add Task',
                            onClick: this.onAddTaskClick,
                        }}
                    />
                );
            }
        }

        const selectedTask = selectedTaskId ? tasksById[selectedTaskId] : undefined;

        return (
            <Container>
                <MainContainer>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="subheading" color="inherit">{config.appName}</Typography>
                        </Toolbar>
                    </AppBar>
                    <Content>
                        {content}
                    </Content>
                    <FabContainer>
                        <Button
                            fab
                            color="primary"
                            focusable={false}
                            onClick={this.onAddTaskClick}>
                            <AddIcon />
                        </Button>
                    </FabContainer>
                </MainContainer>
                <Task
                    show={currentScreen === SCREENS.TASK}
                    task={selectedTask}
                    onClose={this.onTaskClose} />
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isFetching: state.tasks.isFetching,
        tasks: state.tasks.tasks,
        tasksById: state.tasks.tasksById,
        subTasksByParentId: state.tasks.subTasksByParentId,
    }
}

export default connect(
    mapStateToProps,
    null,
)(withStyles(styleSheet)(Main));