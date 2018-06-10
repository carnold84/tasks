import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 50px;
    min-height: 50px;
    margin: 0;
    padding: 0;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    display: flex;
`;

const Title = styled.h1`
    height: 100%;
    font-size: 16px;
    color: #ffffff;
    margin: 0 15px;
    align-items: center;
    display: flex;
`;

const ElementsRight = styled.div`
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    display: flex;
`;

const AppBar = props => {
    return (
        <Container>
            <Title>{props.textLeft}</Title>
            <ElementsRight>{props.elementsRight}</ElementsRight>
        </Container>
    );
};

const {string, array} = PropTypes;

AppBar.propTypes = {
    textLeft: string,
    elementsRight: array,
};

AppBar.defaultProps = {
    textLeft: '',
};

export default AppBar;
