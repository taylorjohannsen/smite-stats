import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import '../css/Header.css'
import logo from '../images/icon.jpg'

class Header extends React.Component {
    constructor() {
        super()

        this.state = {
            player: false,
            profile: {},
            name: '',
            redirect: false
        }

        this.checkPlayer = this.checkPlayer.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.searchPlayer = this.searchPlayer.bind(this)
        this.removeProfile = this.removeProfile.bind(this)
    }

    componentDidMount() {
        this.checkPlayer()
    }

    handleInput(e) {
        const target = e.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: value
        });
    }

    checkPlayer() {
        if (localStorage.length !== 0) {
            const icon = localStorage.getItem('icon')
            const player = localStorage.getItem('player')
            const level = localStorage.getItem('level')

            this.setState({
                player: true,
                profile: {
                    player: player,
                    icon: icon,
                    level: level
                }
            })
        }
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
            <div className='playerCont'>
                <div className='cFlex'>
                    <Link to={"/player/" + this.state.profile.player} className='player'>{this.state.profile.player}</Link>
                    <Link to={"/player/" + this.state.profile.player} className='level'>lv. {this.state.profile.level}</Link>
                    <div onClick={() => this.removeProfile()} className="level change">Remove Profile</div>
                </div>
                <Link to={"/player/" + this.state.profile.player}>
                    <img className='playerIcon' alt="icon" src={this.state.profile.icon} />
                </Link>
            </div>
        )

        return (
            <div className='HeaderCont'>
                {(this.state.player === true) ? playerProfile : <div className="placeholder"></div>}
                <div className="mainTitleCont">
                    <Link className='mainTitle' to="/" >
                        <div className='mainText'>Smite</div>
                        <img className="lightning" alt="smite" src={logo} />
                        <div className='mainText'>Stats</div>
                    </Link>
                </div>
                <div className="searchCont botMar">
                    <form className='cFlex' onSubmit={(e) => this.searchPlayer(e)}>
                        <input className="userInput" name="name" type="text" placeholder="Search Player - PC Only" ref="searchInput" onChange={(e) => this.handleInput(e)} autoComplete='off' />
                        <div className="searchCont">
                            <button type="submit" className="userSubmit">Search</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default withRouter(Header) 