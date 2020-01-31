import React from 'react'
import Index from './Index'
import Header from './Header'
import Player from './Player'
import Footer from './Footer'
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
                            <Route key={Math.random()} path="/player/:name" component={Player} />
                        </Switch>
                    </div>
                    <Footer />
                </BrowserRouter>
            </ContextProvider>
        )
    }
}

export default App