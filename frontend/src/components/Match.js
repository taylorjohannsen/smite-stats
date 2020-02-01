import React from 'react'
import Axios from 'axios'
import '../css/Match.css'

class Match extends React.Component {
    constructor() {
        super()

        this.state = {
            match: {}
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
            console.log(res.data)
        }).catch(err => {
            console.log(err.message)
        })
    }

    render() {
        return (
            <div className='test'>match!!</div>
        )
    }
}

export default Match 