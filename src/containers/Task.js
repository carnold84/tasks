import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import AppBar from 'material-ui/AppBar';
import Input from 'material-ui/Input/Input';
import Toolbar from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import List from 'material-ui/List';
import ArrowBackIcon from 'material-ui-icons/ArrowBack';
import EditIcon from 'material-ui-icons/Edit';

import { createTask } from '../store/tasks/actions';

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
        taskId: string,
        onClose: func.isRequired,
    };

    defaultProps = {
        show: false,
        taskId: undefined,
    };

    state = {
        show: false,
        inputText: '',
        isVisible: false,
    };

    task = undefined;
    taskInput = undefined;

    onTitleChange = (event) => {

        const inputText = event.target.value;
        
        this.setState({inputText});
    };

    onTitleSubmit = (event) => {

        const { dispatch } = this.props;
        const { inputText } = this.state;

        if (event.keyCode) {

            // RETURN
            if (event.keyCode === 13) {

                if (this.task === undefined) {
                    dispatch(createTask(inputText));
                } else {

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

        const { show, tasksById } = this.props;
        const { taskId } = nextProps;

        console.log(taskId)
        
        // only update if changed
        if (nextProps.show !== show) {

            if (nextProps.show === true) {

                this.task = tasksById[taskId];

                const inputText = this.task ? this.task.text : '';

                this.setState({
                    isVisible: true,
                    inputText,
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

        const { show, isVisible, inputText } = this.state;

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
                        <Input
                            id="task"
                            type="text"
                            value={inputText}
                            onChange={this.onTitleChange}
                            onKeyDown={this.onTitleSubmit}
                            style={{width: '100%', fontSize: '16px', fontWeight: '400', lineHeight: '24px'}}
                            disableUnderline={true}
                        />
                        <IconButton color="contrast" aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Content>
                    <Paper elevation={2} square style={{width: '100%', padding: '15px 20px 20px'}}>
                        <Input
                            id="sub-task"
                            type="text"
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

const mapStateToProps = (state) => {
  return {
    tasksById: state.tasks.tasksById,
  }
}

export default connect(
  mapStateToProps,
  null,
)(Task);
