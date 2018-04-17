import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Linkify from 'linkifyjs/react';

import { deleteTask, updateTask } from '../store/tasks/actions';

const Container = styled.div`
    width: 100%;
    height: 60px;
    border-bottom: #eeeeee solid 1px;
    display: flex;
`;

const LeftActions = styled.div`
    padding: 0 10px;
    justify-content: center;
    align-items: center;
    display: flex;
`;

const Content = styled.div`
    overflow: hidden;
    flex-grow: 1;
    justify-content: center;
    align-self: stretch;
    align-items: flex-start;
    display: flex;

    a,
    a:link,
    a:visited {
        height: 100%;
        text-decoration: none;
        color: rgba(0, 0, 0, 0.8);
        flex-grow: 1;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        display: flex;
    }
`;

const PrimaryText = styled.h3`
    width: 100%;
    font-size: 13px;
    line-height: 13px;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;

    a,
    a:link,
    a:visited {
        color: rgba(0, 0, 0, 0.8);
    }
`;

const SecondaryText = styled.p`
    width: 100%;
    font-size: 12px;
    line-height: 12px;
    font-style: italic;
    color: #999999;
    margin: 5px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: break-word;

    a,
    a:link,
    a:visited {
        color: rgba(0, 0, 0, 0.4);
    }
`;

const RightActions = styled.div`
    padding: 0 10px;
    justify-content: center;
    align-items: center;
    display: flex;
`;

const StyledLinkify = styled(Linkify)`
    width: 100%;
`;

const { object, func, bool } = PropTypes;

class Item extends Component {
    onDelete = () => {
        const { data } = this.props;

        this.props.dispatch(deleteTask(data.id));
    };

    onCompleted = (evt, checked) => {
        const { data } = this.props;

        data.completed = checked;

        this.props.dispatch(updateTask(data));
    };

    shouldComponentUpdate(nextProps) {
        return nextProps.data !== this.props.data;
    }

    render() {
        const { data, link, linkify } = this.props;

        let content = [<PrimaryText key={'primary'}>{data.text}</PrimaryText>];

        if (data.subText) {
            content.push(<SecondaryText key={'secondary'}>{data.subText}</SecondaryText>);
        }

        if (linkify) {
            content = (
                <StyledLinkify
                    options={{
                        attributes: {
                            rel: 'nofollow',
                        },
                    }}
                >
                    {content}
                </StyledLinkify>
            );
        }

        if (link) {
            content = <Link to={link}>{content}</Link>;
        }

        return (
            <Container>
                <LeftActions>
                    <input type={'checkbox'} checked={data.completed} onChange={this.onCompleted} />
                </LeftActions>
                <Content>{content}</Content>
                <RightActions>
                    <button onClick={this.onDelete}>Delete</button>
                </RightActions>
            </Container>
        );
    }
}

Item.propTypes = {
    data: object.isRequired,
    onCompleted: func,
    onDelete: func,
    linkify: bool,
};

Item.defaultProps = {
    linkify: false,
};

export default connect()(Item);
