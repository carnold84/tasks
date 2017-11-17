import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styleSheet = {
    padding: '25px 30px',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
};

const Container = styled.div`
    width: 100%;
    padding: 5%;
    align-items: center;
    display: flex;
`;

const EmptyMessage = (props) => {
    const { title, text, link } = props;

    let textContent = undefined;

    if (text) {
        textContent = (
            <Typography
                type="subheading"
                component="p"
                align={'center'}
                style={{margin: '0 0 20px'}}>
                {text}
            </Typography>
        );
    }

    let button = undefined;

    if (link) {
        button = (
            <Link to={link.path}>
                <Button
                    raised
                    color="primary">
                    {link.title}
                </Button>
            </Link>
        );
    } 

    return (
        <Container>
            <Paper
                style={styleSheet}
                elevation={1}>
                <Typography
                    type="title"
                    component="h2"
                    align={'center'}
                    style={{margin: '0 0 10px'}}>
                    {title}
                </Typography>
                {textContent}
                {button}
            </Paper>
        </Container>
    );
};

const { string } = PropTypes;

EmptyMessage.propTypes = {
    title: string.isRequired,
    text: string,
};

export default EmptyMessage;
