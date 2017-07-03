import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    background-color: #f9f9f9;
    border-bottom: #eeeeee solid 1px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    display: flex;
`;

const Text = styled.div`
    padding: 10px 20px;
    flex-direction: column;
    display: flex;
`;

const Line1 = styled.h2`
    font-size: 13px;
    font-weight: 700;
    margin: 0 0 3px;
`;

const Line2 = styled.h3`
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
`;

class MainItem extends Component {

    render = () => {

        const { text1, text2 } = this.props;

        return (
            <Container>
                <Text>
                    <Line1>{text1}</Line1>
                    <Line2>{text2}</Line2>
                </Text>
            </Container>
        );
    }
}

export default MainItem;
