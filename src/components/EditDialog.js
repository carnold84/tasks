import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Link} from 'react-router-dom';

// material ui
import Paper from '@material-ui/core/Paper';

import EditTextInput from './EditTextInput';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10000;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    display: flex;
`;

const Dialog = styled.div`
    width: 90%;
    z-index: 2;
    align-items: center;
    display: flex;
`;

const Overlay = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
`;

class EditDialog extends Component {
    state = {
        text: '',
    };

    componentWillMount() {
        const {defaultValue} = this.props;

        if (defaultValue) {
            this.setState({
                text: defaultValue,
            });
        }
    }

    render() {
        const {onSubmit, onCancel} = this.props;
        const {text} = this.state;

        return (
            <Container>
                <Dialog>
                    <Paper elevation={2} square style={{width: '100%', padding: '10px 10px 10px 20px'}}>
                        <EditTextInput defaultValue={text ? text : undefined} onSubmit={text => onSubmit(text)} />
                    </Paper>
                </Dialog>
                <Overlay onClick={onCancel} />
            </Container>
        );
    }
}

const {func, string} = PropTypes;

EditDialog.propTypes = {
    onSubmit: func.isRequired,
    onCancel: func,
    defaultValue: string,
};

EditDialog.defaultProps = {
    defaultValue: '',
};

export default EditDialog;
