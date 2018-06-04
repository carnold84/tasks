import React, {Component} from 'react';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {MuiThemeProvider, createMuiTheme, createTypography} from '@material-ui/core/styles';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import palette from './theme';

import config from './config';
import * as reducers from './store/reducers';
import {fetchTasks} from './store/tasks/actions';

import {AppContainer} from './styles';

import Main from './pages/Main';
import Task from './pages/Task';

const store = createStore(
    combineReducers(reducers),
    compose(applyMiddleware(thunkMiddleware), window.devToolsExtension ? window.devToolsExtension() : f => f)
);

store.dispatch(fetchTasks());

const theme = createMuiTheme({
    primary: palette,
    typography: {
        fontFamily: 'Roboto Condensed',
    },
});

class App extends Component {
    componentDidMount() {
        document.querySelector('title').textContent = config.appName;
    }

    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <AppContainer>
                        <Router>
                            <div>
                                <Route exact path="/" component={Main} />
                                <Route exact path="/task" component={Task} />
                                <Route exact path="/task/:id" component={Task} />
                                <Route exact path="/task/:id/:action" component={Task} />
                            </div>
                        </Router>
                    </AppContainer>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;
