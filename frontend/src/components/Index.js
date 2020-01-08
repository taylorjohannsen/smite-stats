import React from 'react';
import Axios from 'axios';
import MongoRender from './MongoRender'

class Index extends React.Component {
    constructor() {
        super();

        this.state = {
            kills: [],
            deaths: [],
            healing: [],
            wins: [],
            damage: [],
            wards: [],
            masteries: [],
            gold: [],
            conquest: [],
            hours: [],
            loading: true
        }

        this.callMongo = this.callMongo.bind(this);
    }

    componentDidMount() {
        this.callMongo()
    }

    callMongo() {
        Axios.get('/mongo')
            .then(res => {
                console.log(res.data)
                let mongo = res.data

                this.setState({
                    kills: mongo.kills,
                    deaths: mongo.deaths,
                    healing: mongo.healing,
                    wins: mongo.wins,
                    damage: mongo.damage,
                    wards: mongo.wards,
                    masteries: mongo.masteries,
                    gold: mongo.gold,
                    conquest: mongo.conquest,
                    hours: mongo.hours,
                    loading: false
                })
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    render() {


        return (
            <div>
                <MongoRender data={this.state.kills} />
                <MongoRender data={this.state.deaths} />
                <MongoRender data={this.state.healing} />
                <MongoRender data={this.state.damage} />
                <MongoRender data={this.state.wards} />
                <MongoRender data={this.state.gold} />
                <MongoRender data={this.state.masteries} />
                <MongoRender data={this.state.wins} />
                <MongoRender data={this.state.conquest} />
                <MongoRender data={this.state.hours} />
            </div>
        )
    }
}

export default Index;