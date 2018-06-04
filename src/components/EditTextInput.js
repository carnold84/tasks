import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ClickOutside from 'react-click-outside';

// material ui
import Input from '@material-ui/core/Input/Input';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';

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

class EditTextInput extends Component {
    state = {
        text: '',
    };

    onChange = event => {
        const text = event.target.value;

        this.setState({text});
    };

    onKeyDown = event => {
        if (event.keyCode) {
            // RETURN
            if (event.keyCode === 13) {
                this.onSubmit();
            }
        }
    };

    onSaveClick = event => {
        this.onSubmit();
    };

    onSubmit = () => {
        const {onSubmit} = this.props;
        const text = this.state.text;

        onSubmit(text);
    };

    componentWillMount() {
        const {defaultValue} = this.props;

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
        const {text} = this.state;
        const {color, onCancel} = this.props;

        const content = (
            <Container color={color}>
                <Input
                    id="input"
                    type="text"
                    inputRef={el => (this.input = el)}
                    value={text}
                    placeholder={'Task...'}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    style={{width: '100%', fontSize: '16px', fontWeight: '400', lineHeight: '24px'}}
                    disableUnderline={true}
                />
                <IconButton aria-label="Save" onClick={this.onSaveClick}>
                    <CheckIcon color={color} />
                </IconButton>
            </Container>
        );

        if (onCancel) {
            return (
                <ClickOutside style={{flexGrow: 1}} onClickOutside={onCancel}>
                    {content}
                </ClickOutside>
            );
        } else {
            return content;
        }
    }
}

const {func, string} = PropTypes;

EditTextInput.propTypes = {
    onSubmit: func.isRequired,
    onCancel: func,
    defaultValue: string,
    color: string,
};

EditTextInput.defaultProps = {
    defaultValue: '',
    color: 'rgba(0, 0, 0, 0.8)',
};

export default EditTextInput;
