import React from 'react';
import Index from './Index';
import Header from './Header';
import Player from './Player'
import Footer from './Footer'
import store from '../store'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'


class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Header />
                    <div className='viewport'>
                        <Switch>
                            <Route exact path="/" component={Index} />
                            <Route path="/player/:name" component={Player} />
                        </Switch>
                    </div>
                    <Footer />
                </BrowserRouter>
            </Provider>
        )
    }
}

export default App