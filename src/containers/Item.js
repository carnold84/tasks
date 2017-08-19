import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import DeleteIcon from 'material-ui-icons/Delete';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import RadioButtonUncheckedIcon from 'material-ui-icons/RadioButtonUnchecked';

import { deleteTask, updateTask } from '../store/tasks/actions';

const Container = styled.div`
    width: 100%;
    flex-direction: column;
    display: flex;
`;

const ListItemPrimaryAction = styled.div`
    flex-grow: 1;
    align-self: stretch;
    align-items: center;
    display: flex;
`;

const { object, func } = PropTypes;

class Item extends Component {

    static propTypes = {
        data: object.isRequired,
        onClick: func,
        onCompleted: func,
        onDelete: func,
    };

    onDelete = () => {
        const { data } = this.props;
        
        this.props.dispatch(deleteTask(data.id));
    };

    onCompleted = (evt, checked) => {

        const { data } = this.props;

        data.completed = checked;

        this.props.dispatch(updateTask(data));
    };

    onClick = () => {
        const { data, onClick } = this.props;

        if (onClick) {
            onClick(data);
        }
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== this.props.data;
    }

    render() {
        const { data } = this.props;

        return (
            <Container>
                <ListItem dense button divider>
                    <Checkbox
                        checked={data.completed}
                        onChange={this.onCompleted}
                        tabIndex="-1"
                        disableRipple
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                    />
                    <ListItemPrimaryAction
                        onClick={this.onClick}>
                        <ListItemText
                            primary={data.text}
                            secondary={data.subText}
                        />
                    </ListItemPrimaryAction>
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={this.onDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </Container>
        );
    }
}

export default connect()(Item);
