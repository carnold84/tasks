import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.button`
    position: absolute;
    width: 60px;
    height: 60px;
    bottom: 20px;
    right: 20px;
    border: none;
    border-radius: 40px;
    background-color: ${props => props.theme.primaryColor};
    cursor: pointer;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;

    &:focus {
        outline: none;
        background-color: ${props => props.theme.primaryFocusColor};
    }
`;

const FloatingActionButton = props => {
    return <Container onClick={props.onClick}>{props.children}</Container>;
};

const {func, element} = PropTypes;

FloatingActionButton.propTypes = {
    onClick: func.isRequired,
    children: element,
};

export default FloatingActionButton;
