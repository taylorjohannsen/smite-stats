import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Index from './components/Index';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM
    .render((
        <BrowserRouter>
            <Switch>
                <Route to="/" component={Index} />
            </Switch>
        </BrowserRouter>

    ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
