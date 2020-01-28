import React from 'react'
import Axios from 'axios'
import '../css/Player.css'

class Player extends React.Component {
    constructor() {
        super()

        this.state = {
            player: {},
            loading: true,
            error: false
        }

        this.getPlayerInfo = this.getPlayerInfo.bind(this)
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
                <div className="test">Error!!</div>
            )
        }

        return (
            <div>
                <div className='test'>{this.state.player.name}</div>
            </div>
        )
    }
}

export default Player