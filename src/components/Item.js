import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import DeleteIcon from 'material-ui-icons/Delete';
import CheckCircleIcon from 'material-ui-icons/CheckCircle';
import RadioButtonUncheckedIcon from 'material-ui-icons/RadioButtonUnchecked';

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

    shouldComponentUpdate(nextProps) {
        console.log('shouldComponentUpdate', nextProps.data !== this.props.data)
        return nextProps.data !== this.props.data;
    }

    render() {
        console.log('Item::render')

        const { data, onClick, onCompleted, onDelete } = this.props;

        return (
            <Container>
                <ListItem dense button divider>
                    <Checkbox
                        checked={data.completed}
                        onChange={(evt, checked) => onCompleted(data, checked)}
                        tabIndex="-1"
                        disableRipple
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                    />
                    <ListItemPrimaryAction
                        onClick={() => onClick(data)}>
                        <ListItemText
                            primary={data.text}
                            secondary={data.subText} />
                    </ListItemPrimaryAction>
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Delete" onClick={() => onDelete(data)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </Container>
        );
    }
}

export default Item;
