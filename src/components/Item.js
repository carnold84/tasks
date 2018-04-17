import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    margin: 0;
    padding: 0;
    border-bottom: #f9f9f9 solid 1px;
    display: flex;
`;

const Content = styled.h1`
    height: 100%;
    font-size: 16px;
    color: #ffffff;
    padding: 0 15px;
    align-items: center;
    display: flex;
`;

const ElementsRight = styled.div`
    height: 100%;
    padding: 0 15px 0 0;
    align-items: center;
    justify-content: flex-end;
    display: flex;
`;

const Item = props => {
    const { content, elementsRight } = props;

    return (
        <Container>
            <Content>{content}</Content>
            <ElementsRight>{elementsRight}</ElementsRight>
        </Container>
    );
};

const { array } = PropTypes;

Item.propTypes = {
    content: array,
    elementsRight: array,
};

Item.defaultProps = {
    textLeft: '',
};

export default Item;
