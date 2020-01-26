import React from 'react';
import Index from './Index';
import Header from './Header';
import Player from './Player'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


class App extends React.Component {
    constructor() {
        super()

        this.state = {
            test: false
        }
    }

    render() {
        return (
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route path="/player/:name" component={Player} />
                </Switch>
            </BrowserRouter>
        )
    }
}


export default App