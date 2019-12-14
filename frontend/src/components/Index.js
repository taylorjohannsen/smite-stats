import React from 'react';
import Axios from 'axios';

class Index extends React.Component {
    constructor() {
        super();

        this.state = {
            players: []
        }
        this.callApi = this.callApi.bind(this);
    }

    componentDidMount() {
        this.callApi()
    }

    callApi() {
        Axios.get('/player')
            .then(res => {
                this.setState({
                    players: res.data
                })
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    render() {
        let playerInfo = this.state.players.map(player => {
            return player.map(key => {
                return (
                    <div key={key.ActivePlayerId}>
                        <div>{key.hz_player_name} - Hours Played: {key.HoursPlayed} - Wins: {key.Wins} - Losses: {key.Losses} - W/L: {((key.Wins / key.Losses).toFixed(2))}</div>
                    </div>
                )
            })
        })

        console.log(playerInfo)

        return (
            <div>
                {playerInfo}
            </div>
        )
    }
}

export default Index;