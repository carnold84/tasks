import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import createPalette from 'material-ui/styles/palette';
import { red } from 'material-ui/styles/colors';

import { AppContainer } from './styles';

import Main from './containers/Main';

const theme = createMuiTheme({
  palette: createPalette({
    primary: red,
  }),
});

class App extends Component {
    
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <AppContainer>
                    <Main />
                </AppContainer>
            </MuiThemeProvider>
        );
    }
}

export default App;