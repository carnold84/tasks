import React, { Children } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.h1`
    font-size: 15px;
    color: ${props => props.color};
`;

const Header = props => {
    const { children, color } = props;

    let content = Children.map(children, child => {
        return child;
    });

    return <Container color={color}>{content}</Container>;
};

const { string } = PropTypes;

Header.propTypes = {
    color: string,
};

Header.defaultProps = {
    color: '#ffffff',
};

export default Header;
