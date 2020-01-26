import React from 'react'

class Player extends React.Component {
    constructor() {
        super()

        this.state = {
            player: true
        }
    }


    render() {
        console.log('render?')
        
        return (
            <div>
                <div>TEST TEST</div>
            </div>
        )
    }
}

export default Player