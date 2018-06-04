import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import _isEmpty from 'lodash/isEmpty';

// material ui
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';

// material ui icons
import AddIcon from '@material-ui/icons/Add';

import config from '../config';
import {FabContainer} from '../styles';

import Item from '../containers/Item';

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

const StyledList = styled(List)`
    width: 100%;
`;

class Main extends Component {
    render() {
        const {tasks} = this.props;

        let content = undefined;

        if (tasks === undefined) {
            content = (
                <ProgressContainer>
                    <CircularProgress />
                </ProgressContainer>
            );
        } else {
            if (tasks.length > 0) {
                content = (
                    <StyledList disablePadding>
                        {tasks.map(task => {
                            if (task.children) {
                                let text = task.children.map(child => {
                                    return child.text;
                                });
                                task.subText = text.join(', ');
                            }

                            return <Item key={task.id} data={task} linkify={false} link={`/task/${task.id}`} />;
                        })}
                    </StyledList>
                );
            } else {
                content = (
                    <EmptyMessage
                        title={'You Have No Tasks.'}
                        text={'Feel Free To Add One.'}
                        link={{
                            title: 'Add Task',
                            path: '/task',
                        }}
                    />
                );
            }
        }

        return (
            <Container>
                <MainContainer>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography type="subheading" color="inherit">
                                {config.appName}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Content>{content}</Content>
                    <FabContainer>
                        <Link to={'/task'}>
                            <Button fab color="primary" focusable={false}>
                                <AddIcon />
                            </Button>
                        </Link>
                    </FabContainer>
                </MainContainer>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFetching: state.tasks.isFetching,
        tasks: state.tasks.tasks,
        tasksById: state.tasks.tasksById,
        subTasksByParentId: state.tasks.subTasksByParentId,
    };
};

export default connect(mapStateToProps, null)(Main);
