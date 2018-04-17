import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 50px;
    min-height: 50px;
    margin: 0;
    padding: 0 15px;
    background-color: #63096B;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    display: flex;
`;

const ElementsLeft = styled.div`
    height: 100%;
    justify-content: flex-start;
    align-items: center;
    display: flex;
`;

const ElementsRight = styled.div`
    height: 100%;
    align-items: center;
    justify-content: flex-end;
    display: flex;
`;

const ActionBar = props => {
    const { elementsLeft, elementsRight } = props;

    return (
        <Container>
            <ElementsLeft>{elementsLeft}</ElementsLeft>
            <ElementsRight>{elementsRight}</ElementsRight>
        </Container>
    );
};

const { oneOfType, array, element } = PropTypes;

ActionBar.propTypes = {
    elementsLeft: oneOfType([array, element]),
    elementsRight: oneOfType([array, element]),
};

export default ActionBar;
