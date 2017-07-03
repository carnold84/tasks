import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import taskApp from './reducers'

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const store = createStore(taskApp)

const rootEl = document.getElementById('root');

render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootEl
);
registerServiceWorker();

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(
            <Provider store={store}>
                <NextApp />
            </Provider>,
            rootEl
        );
    })
}