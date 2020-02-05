import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import '../css/Header.css'
import logo from '../images/icon.jpg'
import { PlayerContext } from '../context/PlayerContext';

class Header extends React.Component {
    constructor() {
        super()

        this.state = {
            name: '',
            redirect: false
        }

        this.handleInput = this.handleInput.bind(this)
        this.searchPlayer = this.searchPlayer.bind(this)
    }

    handleInput(e) {
        const target = e.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        });
    }

    searchPlayer(e) {
        e.preventDefault()

        this.props.history.push('/player/' + this.state.name)

        this.refs.searchInput.value = ''
    }

    removeProfile() {
        localStorage.clear()

        this.setState({
            player: false,
            profile: {}
        })
    }

    render() {
        let playerProfile = (
            <PlayerContext.Consumer>
                {(context) => (
                    <div className='playerCont'>
                        <div>
                            <div className='linkCont'>
                                <Link to={"/player/" + context.state.profile.player} className='player'>{context.state.profile.player}</Link>
                            </div>
                            <div className='linkCont'>
                                <Link to={"/player/" + context.state.profile.player} className='level'>lv. {context.state.profile.level}</Link>
                            </div>
                            <div onClick={() => context.removePlayer()} className="level change">Remove Profile</div>
                        </div>
                        <Link to={"/player/" + context.state.profile.player}>
                            <img className='playerIcon' alt="icon" src={context.state.profile.icon} />
                        </Link>
                    </div>
                )}
            </PlayerContext.Consumer>
        )

        return (
            <div>
                <div className='HeaderCont'>
                    <PlayerContext.Consumer>
                        {(context) => (
                            (context.state.profile.player !== '') ? playerProfile : <div className="placeholder"></div>
                        )}
                    </PlayerContext.Consumer>
                    <div className="mainTitleCont">
                        <Link className='mainTitle' to="/" >
                            <div className='mainText'>Smite</div>
                            <img className="lightning" alt="smite" src={logo} />
                            <div className='mainText'>Stats</div>
                        </Link>
                    </div>
                    <div className="searchCont botMar">
                        <form className='formFlex' onSubmit={(e) => this.searchPlayer(e)}>
                            <input className="userInput" name="name" type="text" placeholder="Search Player - PC Only" ref="searchInput" onChange={(e) => this.handleInput(e)} autoComplete='off' />
                            <div className="searchCont">
                                <button type="submit" className="userSubmit">Search</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="dFlex">
                    <div className="bottomBorder"></div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header) 