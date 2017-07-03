import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.button`
    width: ${props => props.width ? props.width : 'auto'};
    height: ${props => props.height ? props.height : '100%'};
    border: none;
    border-radius: 3px;
    background-color: ${props => props.isPrimary ? props.theme.primaryColor : 'transparent'};
    color: ${props => props.color ? props.color : 'black'};
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;

    &:focus {
        outline: none;
        background-color: ${props => props.theme.primaryFocusColor};
    }
`;

const Button = (props) => {

    const { width, height, color, children, isPrimary, onClick } = props;

    return (
        <Container
            width={width}
            height={height}
            color={color}
            isPrimary={isPrimary}
            onClick={onClick}>
            {children}
        </Container>
    );
};

const { func, element, bool, string } = PropTypes;

Button.propTypes = {
    width: string,
    height: string,
    color: string,
    onClick: func.isRequired,
    children: element,
    isPrimary: bool,
};

export default Button;
