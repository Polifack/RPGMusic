import React from 'react';
import ReactDOM from 'react-dom';

import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css';
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

if (process.env.REACT_APP_MODE === 'electron') console.log('Running in Electron!')
else console.log('Running in browser!')


ReactDOM.render(<App/>, document.getElementById('root'));
serviceWorker.unregister();
