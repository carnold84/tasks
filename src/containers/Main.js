import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import List from 'material-ui/List';
import AddIcon from 'material-ui-icons/Add';

import { FabContainer } from '../styles';

import { deleteTask, updateTask } from '../store/tasks/actions';

import Task from './Task';

import Item from '../components/Item';

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

const ListContainer = styled.div`
    width: 100%;
    margin: 0;
    //box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
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
    };

    onAddTaskClick = () => {

        // show the task screen
        this.setState({
            currentScreen: SCREENS.TASK,
        });
    };

    onTaskDelete = (task) => {
        
        this.props.dispatch(deleteTask(task.id));
    };

    onTaskClick = (task) => {

        // hide the task screen
        this.setState({
            currentScreen: SCREENS.TASK,
            selectedTaskId: task.id,
        });
    };

    onTaskCompleted = (task, checked) => {

        task.completed = checked;

        this.props.dispatch(updateTask(task));
    };

    onTaskClose = () => {

        // hide the task screen
        this.setState({
            currentScreen: undefined,
            selectedTaskId: undefined,
        });
    };

    processTasks = () => {

        const { tasks, subTasksByParentId } = this.props;

        let processed_tasks = [];

        if (tasks !== undefined) {

            let child_tasks = {};

            processed_tasks = tasks.map(task => {
                task.children = subTasksByParentId[task.id];
                
                if (task.children) {
                    let text = task.children.map(child => {
                        return child.text;
                    });
                    task.subText = text.join(', ');
                }

                return task;
            });
        }   

        return processed_tasks;
    };

    render() {
        console.log('Main::render')

        const { currentScreen, selectedTaskId } = this.state;

        let content = undefined;
        let processed_tasks = this.processTasks();

        if (processed_tasks) {
            
            content = processed_tasks.map((task) => {
                return (
                    <Item
                        key={task.id}
                        data={task}
                        onClick={this.onTaskClick}
                        onDelete={this.onTaskDelete}
                        onCompleted={this.onTaskCompleted} />
                );
            });
        }

        return (
            <Container>
                <MainContainer>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="subheading" color="inherit">Tasks</Typography>
                        </Toolbar>
                    </AppBar>
                    <Content>
                        <ListContainer>
                            <List disablePadding>
                                {content}
                            </List>
                        </ListContainer>
                    </Content>
                    <FabContainer>
                        <Button fab color="primary" onClick={this.onAddTaskClick}>
                            <AddIcon />
                        </Button>
                    </FabContainer>
                </MainContainer>
                <Task
                    show={currentScreen === SCREENS.TASK}
                    taskId={selectedTaskId}
                    onClose={this.onTaskClose} />
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    isFetching: state.tasks.isFetching,
    tasks: state.tasks.tasks,
    subTasksByParentId: state.tasks.subTasksByParentId,
  }
}

export default connect(
  mapStateToProps,
  null,
)(withStyles(styleSheet)(Main));