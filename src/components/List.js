import React, { Children } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
`;

const List = (props) => {

    const { children } = props;

    let content = Children.map(children, (child) => {
        return child;
    });

    return (
      <Container>
          {content}
      </Container>
    );
};

export default List;
