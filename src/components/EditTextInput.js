import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ClickOutside from 'react-click-outside';
import Input from 'material-ui/Input/Input';
import IconButton from 'material-ui/IconButton';
import CheckIcon from 'material-ui-icons/Check';

const Container = styled.div`
    width: 100%;
    color: ${props => props.color};
    flex-grow: 1;
    align-items: center;
    display: flex;

    input {
        color: ${props => props.color};
        padding: 4px 0;
        border-bottom: ${props => props.color} solid 1px;
    }
`;

const { func, string } = PropTypes;

class EditTextInput extends Component {

    static propTypes = {
        onSubmit: func.isRequired,
        onCancel: func,
        defaultValue: string,
        color: string,
    };

    static defaultProps = {
        defaultValue: '',
        color: 'rgba(0, 0, 0, 0.8)',
    };

    state = {
        text: '',
    };

    onChange = (event) => {
        const text = event.target.value;
        
        this.setState({text});
    };

    onKeyDown = (event) => {
        console.log('onKeyDown')
        if (event.keyCode) {
            // RETURN
            if (event.keyCode === 13) {
                this.onSubmit();
            }
        }
    };

    onSaveClick = (event) => {
        console.log('onSaveClick')
        this.onSubmit();
    };

    onSubmit = () => {
        console.log('onSubmit')
        const { onSubmit } = this.props;
        const text = this.state.text;

        onSubmit(text);
    };

    componentWillMount() {
        const { defaultValue } = this.props;

        if (defaultValue) {
            this.setState({
                text: defaultValue,
            });
        }
    }

    componentDidMount() {
        this.input.focus();
    }

    render() {
        const { text } = this.state;
        const { color, onCancel } = this.props;

        return (
            <ClickOutside style={{flexGrow: 1}} onClickOutside={onCancel ? onCancel : undefined}>
                <Container color={color}>
                    <Input
                        id="input"
                        type="text"
                        inputRef={el => this.input = el}
                        value={text}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        style={{width: '100%', fontSize: '16px', fontWeight: '400', lineHeight: '24px'}}
                        disableUnderline={true}
                    />
                    <IconButton
                        aria-label="Save"
                        onClick={this.onSaveClick}>
                        <CheckIcon
                            color={color} />
                    </IconButton>
                </Container>
            </ClickOutside>
        );
    }
};

export default EditTextInput;
