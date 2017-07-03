import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import AddIcon from 'material-ui-icons/Add';

import { toggleTask } from '../actions';

import Task from './Task';

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
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-grow: 1;
    display: flex;
`;

const FabContainer = styled.div`
    position: absolute;
    right: 20px;
    bottom: 20px;
`;

const SCREENS = {
    TASK: 'screen/task',
};

class Main extends Component {

    state = {
        tasks: undefined,
        currentScreen: undefined,
    };

    onNewTaskClick = () => {
        this.setState({
            currentScreen: SCREENS.TASK,
        });
    };

    onTaskClose = () => {
        this.setState({
            currentScreen: undefined,
        });
    };

    componentDidMount() {
        console.log('Main::componentDidMount')

        const { tasks } = this.state;

        if (tasks === undefined) {
            fetch('http://localhost:3002/tasks').then((response) => {
                return response.json();
            }).then((json) => {
                if (json.length > 0) {
                    this.setState({
                        tasks: json,
                    });
                }
            });
        }
    };

    render() {
        console.log('Main::render')

        console.log(this.state)

        const { theme } = this.props;
        const { tasks, currentScreen } = this.state;

        let content = undefined;

        if (tasks) {
            content = tasks.map((task) => {
                return (
                    <ListItem dense button key={task.id}>
                        <Checkbox
                            checked={task.complete}
                            tabIndex="-1"
                            disableRipple
                        />
                        <ListItemText primary={task.title} />
                    </ListItem>
                );
            });
        }

        return (
            <Container>
                <MainContainer>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="title" color="inherit">Simplist</Typography>
                        </Toolbar>
                    </AppBar>
                    <Content>
                        <List>
                            {content}
                        </List>
                    </Content>
                    <FabContainer>
                        <Button fab color="primary" onClick={this.onNewTaskClick}>
                            <AddIcon />
                        </Button>
                    </FabContainer>
                </MainContainer>
                <Task
                    show={currentScreen === SCREENS.TASK}
                    onClose={this.onTaskClose} />
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTaskClick: (id) => {
      dispatch(toggleTask(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);