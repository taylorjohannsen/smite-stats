import React from 'react';
import Axios from 'axios';
import MongoRender from './MongoRender'
import '../css/Index-Front.css'

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
        Axios.get(process.env.REACT_APP_URL + '/mongo')
            .then(res => {
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
            <div className="boxContainer container">
                <MongoRender data={this.state.kills} type='Kills' />
                <MongoRender data={this.state.deaths} type='Deaths' />
                <MongoRender data={this.state.healing} type='Healing' />
                <MongoRender data={this.state.damage} type='Damage' />
                <MongoRender data={this.state.wards} type='Wards' />
                <MongoRender data={this.state.gold} type='Gold' />
                <MongoRender data={this.state.masteries} type='Mastery Level' single={true} />
                <MongoRender data={this.state.wins} type='Wins' single={true} />
                <MongoRender data={this.state.conquest} type='Ranked Conquest MMR' single={true} />
                <MongoRender data={this.state.hours} type='Hours Played' single={true} />
            </div>
        )
    }
}

export default Index;