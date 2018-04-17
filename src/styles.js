import styled from 'styled-components';

export const AppContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: ${props => props.textBlack ? props.textBlack : 'black'};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
`;

export const FabContainer = styled.div`
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 2;
`;