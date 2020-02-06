import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import Bans from './Bans'
import '../css/Match.css'

class Match extends React.Component {
    constructor() {
        super()

        this.state = {
            match: {},
            error: false,
            loading: true,
            errorText: '',
            errorMessage: '',
            ban: false
        }

        this.getMatchData = this.getMatchData.bind(this)
    }

    componentDidMount() {
        this.getMatchData()
    }

    getMatchData() {
        Axios.post(process.env.REACT_APP_URL + '/match', {
            match: this.props.match.params.id
        }).then(res => {
            this.setState({
                match: res.data,
                loading: false,
                ban: res.data.banWin.length > 0 ? true : false
            })
        }).catch(err => {
            console.log('Error:', err.response)

            this.setState({
                error: true,
                loading: false,
                errorText: err.response.data.actual,
                errorMessage: err.response.data.message
            })
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

        let winners = this.state.match.winners.map(player => {
            let actives = player.actives.map(active => {
                return (
                    <img data-tip={active.name} className='itemIcon' src={active.icon} alt={active.name} key={active.name} />
                )
            })

            let builds = player.build.map(build => {
                return (
                    <img data-tip={build.name} className='itemIcon' src={build.icon} alt={build.name} key={build.name} />
                )
            })

            return (
                <tr key={player.player} className='winner'>
                    <td colSpan="2">
                        <div className="playerTh">
                            <img className='imageTh' src={player.godIcon} alt={player.player} />
                            <div className='playerNameBox'>
                                <Link to={"/player/" + player.player} className='tablePlayer'>{player.player}</Link>
                                <div className='playerGod'>{player.godName}</div>
                            </div>
                        </div>
                    </td>
                    <td>{player.godLevel}</td>
                    <td>{player.kills} / {player.deaths} / {player.assists}</td>
                    <td>{player.gold}</td>
                    <td>{player.gpm}</td>
                    <td>{player.damage}</td>
                    <td>{player.taken}</td>
                    <td>{player.mitigated}</td>
                    <td>{player.healing}</td>
                    <td>{player.wards}</td>
                    <td>{actives}</td>
                    <td colSpan="3">{builds}</td>
                </tr>
            )
        })

        let losers = this.state.match.losers.map(player => {
            let actives = player.actives.map(active => {
                return (
                    <img data-tip={active.name} className='itemIcon' src={active.icon} alt={active.name} key={active.name} />
                )
            })

            let builds = player.build.map(build => {
                return (
                    <img data-tip={build.name} className='itemIcon' src={build.icon} alt={build.name} key={build.name} />
                )
            })

            return (
                <tr key={player.player} className='loser'>
                    <td colSpan="2">
                        <div className="playerTh">
                            <img className='imageTh' src={player.godIcon} alt={player.player} />
                            <div className='playerNameBox'>
                                <Link to={"/player/" + player.player} className='tablePlayer'>{player.player}</Link>
                                <div className='playerGod'>{player.godName}</div>
                            </div>
                        </div>
                    </td>
                    <td>{player.godLevel}</td>
                    <td>{player.kills} / {player.deaths} / {player.assists}</td>
                    <td>{player.gold}</td>
                    <td>{player.gpm}</td>
                    <td>{player.damage}</td>
                    <td>{player.taken}</td>
                    <td>{player.mitigated}</td>
                    <td>{player.healing}</td>
                    <td>{player.wards}</td>
                    <td>{actives}</td>
                    <td colSpan="3">{builds}</td>
                </tr>
            )
        })

        return (
            <>
                <div className='container'>
                    <div className="matchDetailsDiv">
                        <div className="topDetailsCont">
                            <div>
                                <div className='modeName'>{this.state.match.mode}</div>
                                <div className='dateName'>{this.state.match.date} - {this.state.match.region}</div>
                                <div className='dateName'>ID: {this.state.match.id} - {this.state.match.length} Minutes</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='matchContainer'>
                    <div className="tableName">Winners</div>
                    <div className="winnerCont">
                        <table className="detailsDiv">
                            <tbody>
                                <tr className='detailsHeader winner'>
                                    <th colSpan="2">Player</th>
                                    <th>Level</th>
                                    <th>K / D / A</th>
                                    <th>Gold</th>
                                    <th>GPM</th>
                                    <th>Damage</th>
                                    <th>Taken</th>
                                    <th>Mitigated</th>
                                    <th>Healing</th>
                                    <th>Wards</th>
                                    <th>Actives</th>
                                    <th colSpan="3">Build</th>
                                </tr>
                                {winners}
                            </tbody>
                        </table>
                    </div>
                    <div className="tableName">Losers</div>
                    <div className="winnerCont">
                        <table className="detailsDiv">
                            <tbody>
                                <tr className='detailsHeader loser'>
                                    <th colSpan="2">Player</th>
                                    <th>Level</th>
                                    <th>K / D / A</th>
                                    <th>Gold</th>
                                    <th>GPM</th>
                                    <th>Damage</th>
                                    <th>Taken</th>
                                    <th>Mitigated</th>
                                    <th>Healing</th>
                                    <th>Wards</th>
                                    <th>Actives</th>
                                    <th colSpan="3">Build</th>
                                </tr>
                                {losers}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="container">
                    <Bans win={this.state.match.banWin} lose={this.state.match.banLose} ban={this.state.ban} />
                </div>
                <ReactTooltip />
            </>
        )
    }
}

export default Match 