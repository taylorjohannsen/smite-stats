import React from 'react'
import { Link ,withRouter } from 'react-router-dom'
import '../css/Header.css'

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

    searchPlayer() {
        this.props.history.push('/player/' + this.state.name)
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
                    <Link className='mainTitle' to="/" >Smite-Stats</Link>
                </div>
                <div className="searchCont botMar">
                    <div className='cFlex'>
                        <input className="userInput" name="name" type="text" placeholder="Search Player - PC Only" onChange={(e) => this.handleInput(e)} autoComplete='off' />
                        <div className="searchCont">
                            <button className="userSubmit" onClick={() => this.searchPlayer()}>Search</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header) 