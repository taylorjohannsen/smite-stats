import React from 'react'

export const PlayerContext = React.createContext()

export class ContextProvider extends React.Component {
    constructor() {
        super()

        this.state = {
            profile: {
                player: '',
                icon: '',
                level: ''
            }
        }
        
        this.updatePlayer = this.updatePlayer.bind(this)
        this.removePlayer = this.removePlayer.bind(this)
        this.checkPlayer = this.checkPlayer.bind(this)
    }

    componentDidMount() {
        this.checkPlayer()
    }

    checkPlayer() {
        if (localStorage.length !== 0) {
            const player = localStorage.getItem('player')
            const icon = localStorage.getItem('icon')
            const level = localStorage.getItem('level')

            this.setState({
                profile: {
                    player: player,
                    icon: icon,
                    level: level
                }
            })
        }
    }

    updatePlayer(player, icon, level) {
        localStorage.setItem('player', player)
        localStorage.setItem('icon', icon)
        localStorage.setItem('level', level)

        this.setState({
            profile: {
                player: player,
                icon: icon,
                level: level
            }
        })
    }

    removePlayer() {
        localStorage.clear()

        this.setState({
            profile: {
                player: '',
                icon: '',
                level: ''
            }
        })
    }

    render() {
        return (
            <PlayerContext.Provider value={{
                state: this.state,
                updatePlayer: (player, icon, level) => this.updatePlayer(player, icon, level),
                removePlayer: () => this.removePlayer()
            }}>
                {this.props.children}
            </PlayerContext.Provider>
        )
    }
}