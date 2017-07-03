import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';

import { addTask } from '../actions';

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

const { string, bool, func } = PropTypes;

class Task extends Component {

    static propTypes = {
        show: bool,
        id: string,
        onClose: func.isRequired,
    };

    defaultProps = {
        show: false,
    };

    state = {
        show: false,
        task: {
            name: '',
            subTasks: [],
        },
        isVisible: false,
    };

    taskInput = undefined;

    onTitleChange = (event) => {
        const value = event.target.value;
        
        // get task
        let task = this.state.task;
        task.name = value;
        this.setState({task});
    };

    onTitleSubmit = (event) => {
        console.log(event.keyCode)

        if (event.keyCode) {

            // RETURN
            if (event.keyCode === 13) {
                
                // get task
                let task = this.state.task;

                if (task.id === undefined) {
                    console.log(task)
                }

                // clear focus
                event.target.blur();
            }
        }
    };

    onHideComplete = () => {

        this.container.removeEventListener('transitionend', this.onHideComplete);

        this.setState({
            isVisible: false,
        });
    };

    onClose = () => {
        this.props.onClose();
    };

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps)
        
        // only update if changed
        if (nextProps.show !== this.props.show) {

            if (nextProps.show === true) {

                this.setState({
                    isVisible: true,
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

        const { id, theme } = this.props;
        const { show, isVisible, task } = this.state;

        let content = undefined;

        if (task.subTasks) {
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
        }

        return (
            <Container
                innerRef={(el) => this.container = el}
                show={show}
                isVisible={isVisible}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="contrast" aria-label="Close" onClick={this.onClose}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Content>
                    <Paper elevation={2} square style={{width: '100%', padding: '15px 20px 20px'}}>
                        <TextField
                            id="task"
                            label="Task"
                            type="text"
                            value={task.name}
                            onChange={this.onTitleChange}
                            onKeyDown={this.onTitleSubmit}
                            style={{width: '100%'}}
                        />
                    </Paper>
                    <List>
                        {content}
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (text) => {
      dispatch(addTask(text))
    }
  }
}

export default connect(
    null,
    mapDispatchToProps
)(Task);
