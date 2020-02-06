import React from 'react'
import Axios from 'axios'
import { PlayerContext } from '../context/PlayerContext'
import { Link } from 'react-router-dom'
import '../css/Player.css'

class Player extends React.Component {
    constructor() {
        super()

        this.state = {
            player: {},
            loading: true,
            error: false,
            errorText: '',
            errorMessage: '',
            matches: 10
        }

        this.getPlayerInfo = this.getPlayerInfo.bind(this)
        this.updateMatchCount = this.updateMatchCount.bind(this)
    }

    async componentDidMount() {
        await this.getPlayerInfo()
        this.checkMatchCount()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.name !== prevProps.match.params.name) {
            this.getPlayerInfo()

            this.setState({
                matches: 10
            })
        }
    }

    getPlayerInfo() {
        return new Promise((resolve, reject) => {
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

                resolve(res)
            }).catch(err => {
                console.log('Error:', err.response.data.message)

                this.setState({
                    error: true,
                    loading: false,
                    errorText: err.response.data.actual,
                    errorMessage: err.response.data.message
                })

                reject(err)
            })
        })
    }

    updateMatchCount() {
        this.setState({
            matches: this.state.matches + 10
        })

        this.checkMatchCount()
    }

    checkMatchCount() {
        if ((this.state.player.matches.length - this.state.matches) <= 0) {
            this.refs.loadButton.style.display = 'none'
        }
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
                <div className="errorBox">
                    <div className='errorCenter'>
                        <div className='errorText'>there was an error :(</div>
                        <div className='errorText'>{this.state.errorMessage}</div>
                        <div className='errorText'>if you see tj around here, give him this:</div>
                        <div className="textBox">
                            <textarea className='giveTJ' value={this.state.errorText} readOnly={true}></textarea>
                        </div>
                    </div>
                </div>
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
                                <div className='godName'>{match.godName}</div>
                                <div className='matchDate'>{match.date}</div>
                            </div>
                        </div>
                        <div className="matchSecond dFlex">
                            <div className="pad">
                                <div className='mapName'>{match.mode}</div>
                                <div className='matchTime'>{match.length} min</div>
                            </div>
                        </div>
                        <div className="matchThird">
                            <div className="pad">
                                <div className='KDA'>{match.kills} / {match.deaths} / {match.assists}</div>
                                {(match.win) ? <div className="winLoss">Win</div> : <div className="winLoss">Loss</div>}
                            </div>
                        </div>
                    </Link>
                )
            } else {
                return ''
            }
        })

        return (
            <div className="playerContainer">
                <div className="playerMatchBox">
                    <div className="playerBox">
                        <div className="oneThird picture">
                            <div className='dFlex'>
                                <img className="imgIcon" src={this.state.player.icon} alt={this.state.player.name} />
                            </div>
                            <div className="dFlex textWrap">
                                {(this.state.player.team !== '') ? <div className="clanTag">[{this.state.player.team}] </div> : ''}
                                <div className="playerNamePage">{this.state.player.name}</div>
                            </div>
                            <PlayerContext.Consumer>
                                {(context) => (
                                    <div className='fav' onClick={() => context.updatePlayer(this.state.player.name, this.state.player.icon, this.state.player.level)}>+ Add as Favorite ☆</div>
                                )}
                            </PlayerContext.Consumer>
                        </div>
                        <div className="statCont">
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
                        </div>
                        <div className="statCont">
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
                    </div>
                    <div>
                        <div className="matchesTitle">Recent Matches</div>
                        <div className='matchBox'>
                            {matches}
                        </div>
                        <div ref='loadButton' className="loadMoreCont">
                            <div className="loadMore" onClick={() => this.updateMatchCount()}>load more</div>
                        </div>
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