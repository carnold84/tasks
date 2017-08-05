import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from 'material-ui/Input/Input';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import CheckIcon from 'material-ui-icons/Check';

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
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
    z-index: 1;
`;

const { func, string } = PropTypes;

class EditDialog extends Component {

    static propTypes = {
        onSubmit: func.isRequired,
        defaultValue: string,
    };

    static defaultProps = {
        defaultValue: '',
    };

    state = {
        text: '',
    };

    componentWillMount() {
        const { defaultValue } = this.props;

        if (defaultValue) {
            this.setState({
                text: defaultValue,
            });
        }
    }

    render() {
        const { onClose, onSubmit } = this.props;
        const { text } = this.state;

        return (
            <Container>
                <Dialog>
                    <Paper elevation={2} square style={{width: '100%', padding: '10px 10px 10px 20px'}}>
                        <EditTextInput
                            defaultValue={text ? text : undefined}
                            onSubmit={(text) => onSubmit(text)}
                        />
                    </Paper>
                </Dialog>
                <Overlay
                    onClick={onClose} />
            </Container>
        );
    }
};

export default EditDialog;
