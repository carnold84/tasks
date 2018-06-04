import React from 'react';
import {render} from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const rootEl = document.getElementById('root');

render(<App />, rootEl);
registerServiceWorker();

if (module.hot) {
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default;
        render(<NextApp />, rootEl);
    });
}
