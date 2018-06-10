import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import Linkify from 'linkifyjs/react';

// material ui
import ListItem from '@material-ui/core/ListItem';
import {ListItemText} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

// material ui icons
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const Container = styled.li`
    width: 100%;
    flex-direction: column;
    display: flex;
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

const StyledListItem = styled(ListItem)`
    padding: 5px;

    a,
    a:link,
    a:visited {
        align-items: center;
        align-self: stretch;
        color: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-grow: 1;
        text-decoration: none;
    }
`;

const StyledLinkify = styled(Linkify)`
    width: 100%;
`;

class Item extends Component {
    onDelete = () => {
        const {data, onDelete} = this.props;

        onDelete(data.id);
    };

    onCompleted = (evt, checked) => {
        const {data, onComplete} = this.props;

        const item = {
            ...data,
            completed: checked,
        };

        onComplete(item);
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== this.props.data;
    }

    render() {
        const {data, link, linkify} = this.props;

        let content = <ListItemText primary={data.text} secondary={data.subText ? data.subText : null} />;

        if (linkify) {
            content = (
                <StyledLinkify
                    options={{
                        attributes: {
                            rel: 'nofollow',
                        },
                    }}
                >
                    {data.text}
                </StyledLinkify>
            );
        }

        if (link) {
            content = <Link to={link}>{content}</Link>;
        }

        return (
            <StyledListItem dense={true} divider={true} component={'div'} disableGutters={true}>
                <Checkbox
                    checked={data.completed}
                    onChange={this.onCompleted}
                    tabIndex={'-1'}
                    icon={<RadioButtonUncheckedIcon color={'primary'} />}
                    checkedIcon={<CheckCircleIcon color={'primary'} />}
                />
                {content}
                <ListItemSecondaryAction>
                    <StyledIconButton aria-label={'Delete'} onClick={this.onDelete}>
                        <DeleteIcon />
                    </StyledIconButton>
                </ListItemSecondaryAction>
            </StyledListItem>
        );
    }
}

const {object, func, bool, string} = PropTypes;

Item.propTypes = {
    data: object.isRequired,
    link: string,
    linkify: bool,
    onComplete: func.isRequired,
    onDelete: func.isRequired,
};

Item.defaultProps = {
    linkify: false,
};

export default Item;
