import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import '../css/Player.css'

class Player extends React.Component {
    constructor() {
        super()

        this.state = {
            player: {},
            loading: true,
            error: false,
            matches: 10
        }

        this.getPlayerInfo = this.getPlayerInfo.bind(this)
        this.updateMatchCount = this.updateMatchCount.bind(this)
    }

    componentDidMount() {
        this.getPlayerInfo()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.name !== prevProps.match.params.name) {
            this.getPlayerInfo()
        }
    }

    getPlayerInfo() {
        this.setState({
            loading: true,
            error: false
        })

        Axios.post(process.env.REACT_APP_URL + '/player', {
            player: this.props.match.params.name
        }).then(res => {
            this.setState({
                player: res.data,
                loading: false,
            })
        }).catch(err => {
            console.log('Error:', err.response.data.message)

            this.setState({
                error: true,
                loading: false
            })
        })
    }

    updateMatchCount() {
        this.setState({
            matches: this.state.matches + 10
        })
    }

    render() {
        if (this.state.loading === true) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            )
        }

        if (this.state.error === true) {
            return (
                <div className="friendName">Error!!</div>
            )
        }

        let friends = this.state.player.friends.map((friend, i) => {
            if (friend.name === '') return ''

            return (
                <div key={i} className="friend">
                    <img className="friendImage" src={friend.avatar_url} alt={friend.name} />
                    <Link to={'/player/' + friend.name} className="friendName">{friend.name}</Link>
                </div>
            )
        })

        let matches = this.state.player.matches.map((match, i) => {
            if (i < this.state.matches) {

                let style = {
                    backgroundColor: (match.win === true) ? 'rgba(68, 68, 255, 0.164)' : 'rgba(255, 86, 86, 0.123)'
                }

                return (
                    <Link to={'/match/' + match.id} key={i} style={style} className='matchCont'>
                        <div className="matchImage">
                            <img src={match.godIcon} alt={match.godName} className='godSmallImage' />
                            <div className="matchGodDate">

                            </div>
                        </div>
                        <div className="matchThird"></div>
                        <div className="matchThird"></div>
                    </Link>
                )
            } else {
                return ''
            }
        })

        console.log(this.state.player)
        return (
            <div className="playerContainer dFlex">
                <div className="playerMatchBox">
                    <div className="playerBox">
                        <div className="oneThird picture">
                            <div className='dFlex'>
                                <img className="imgIcon" src={this.state.player.icon} alt={this.state.player.name} />
                            </div>
                            <div className="dFlex">
                                {(this.state.player.team !== '') ? <div className="clanTag">[{this.state.player.team}] </div> : ''}
                                <div className="playerNamePage">{this.state.player.name}</div>
                            </div>
                        </div>
                        <div className="oneThird">
                            <div className="pairCont">
                                <div className="key">Region: </div>
                                <div className="value">{this.state.player.region}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Level: </div>
                                <div className="value">{this.state.player.level}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Masteries: </div>
                                <div className="value">{this.state.player.masteries}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Conquest MMR: </div>
                                <div className="value">{Math.round(Number(this.state.player.rank))}</div>
                            </div>
                        </div>
                        <div className="oneThird">
                            <div className="pairCont">
                                <div className="key">Hours: </div>
                                <div className="value">{this.state.player.hours}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Wins: </div>
                                <div className="value">{this.state.player.wins}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Losses: </div>
                                <div className="value">{this.state.player.loss}</div>
                            </div>
                            <div className="pairCont">
                                <div className="key">Leaves: </div>
                                <div className="value">{this.state.player.leaves}</div>
                            </div>
                        </div>
                    </div>
                    <div className='matchBox'>
                        {matches}
                    </div>
                </div>
                <div className="friendBox">
                    <div className="friendTitle">Friends</div>
                    <div className="friendsCont">
                        {friends}
                    </div>
                </div>
            </div>
        )
    }
}

export default Player