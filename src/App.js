import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme, createPalette, createTypography  } from 'material-ui/styles';
import palette from './theme';
import PubSub from 'pubsub-js';

import config from './config';
import Store from './store';

import { AppContainer } from './styles';

import Main from './containers/Main';

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
    
    state = {
        data: {
            tasks: [],
            tasksById: {},
            subTasksByParentId: {},
        },
    };

    store = undefined;

    onTasksReceived = () => {
        const data = this.store.getState();

        this.setState({data});
    };
    
    componentDidMount() {
        document.querySelector('title').textContent = config.appName;
        
        // unsubscribe all events first in case component remounts
        PubSub.clearAllSubscriptions();
        PubSub.subscribe(Store.EVENTS.TASKS_RECEIVED, this.onTasksReceived);

        if (this.store === undefined) {
            this.store = new Store();
        }
    }
    
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <AppContainer>
                    <Main 
                        data={this.state.data}
                    />
                </AppContainer>
            </MuiThemeProvider>
        );
    }
}

export default App;