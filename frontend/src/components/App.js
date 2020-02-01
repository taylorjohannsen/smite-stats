import React from 'react'
import Index from './Index'
import Header from './Header'
import Player from './Player'
import Footer from './Footer'
import Match from './Match'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { ContextProvider } from '../context/PlayerContext'

class App extends React.Component {
    render() {
        return (
            <ContextProvider>
                <BrowserRouter>
                    <Header />
                    <div className='viewport'>
                        <Switch>
                            <Route exact path="/" component={Index} />
                            <Route path="/player/:name" component={Player} />
                            <Route path="/match/:id" component={Match} />
                        </Switch>
                    </div>
                    <Footer />
                </BrowserRouter>
            </ContextProvider>
        )
    }
}

export default App