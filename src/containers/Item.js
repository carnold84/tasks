import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Linkify from 'linkifyjs/react';
import { ListItem } from 'material-ui/List';
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
    overflow: hidden;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-self: stretch;
    align-items: flex-start;
    display: flex;
`;

const ListItemPrimaryText = styled.h3`
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    
    a, a:link, a:visited {
        color: rgba(0, 0, 0, 0.8);
    }
`;

const ListItemSecondaryText = styled.p`
    width: 100%;
    color: #999999;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;
    
    a, a:link, a:visited {
        color: rgba(0, 0, 0, 0.4);
    }
`;

const ListItemSecondaryAction = styled.div`
    justify-content: center;
    align-items: center;
    display: flex;
`;

const StyledIconButton = styled(IconButton)`
    color: rgba(0, 0, 0, 0.3);

    &:hover {
        color: rgba(0, 0, 0, 0.8);
    }
`;

const StyledLinkify = styled(Linkify)`
    width: 100%;
`;

const { object, func, bool } = PropTypes;

class Item extends Component {

    static propTypes = {
        data: object.isRequired,
        onClick: func,
        onCompleted: func,
        onDelete: func,
        linkify: bool,
    };
    
    static defaultProps = {
        linkify: false,
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
        const { data, linkify } = this.props;

        let content = [
            <ListItemPrimaryText key={'primary'}>{data.text}</ListItemPrimaryText>,
            <ListItemSecondaryText key={'secondary'}>{data.subText}</ListItemSecondaryText>
        ];

        if (linkify) {
            content = (
                <StyledLinkify options={{
                    attributes: {
                        rel: 'nofollow'
                    }
                }}>
                    {content}
                </StyledLinkify>
            );
        }

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
                        {content}
                    </ListItemPrimaryAction>
                    <ListItemSecondaryAction>
                        <StyledIconButton aria-label="Delete" onClick={this.onDelete}>
                            <DeleteIcon />
                        </StyledIconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </Container>
        );
    }
}

export default connect()(Item);
