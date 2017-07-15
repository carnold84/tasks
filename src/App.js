import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme, createPalette, createTypography  } from 'material-ui/styles';
import palette from './theme';

import * as reducers from './store/reducers';
import { fetchTasks } from './store/tasks/actions';

import { AppContainer } from './styles';

import Main from './containers/Main';

const store = createStore(
    combineReducers(reducers),
    compose(
        applyMiddleware(thunkMiddleware), 
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
);

store
  .dispatch(fetchTasks())
  .then(() => console.log(store.getState()))

const mainPalette = createPalette({
    primary: palette,
});

const typography = createTypography(mainPalette, {
    fontFamily: 'inherit',
});

const theme = createMuiTheme({
    palette: mainPalette,
    typography: typography,
    fontFamily: 'Roboto Condensed',
});

class App extends Component {
    
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <AppContainer>
                        <Main />
                    </AppContainer>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;