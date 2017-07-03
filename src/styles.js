import styled from 'styled-components';

export const AppContainer = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    font-family: 'Roboto Condensed', sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: ${props => props.textBlack ? props.textBlack : 'black'};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    display: flex;
`;