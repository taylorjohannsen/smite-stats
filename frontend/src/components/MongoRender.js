import React from 'react'
import { Link } from 'react-router-dom'
import '../css/MongoRender.css'

function MongoRender(props) {
    let mongoData = props.data.map((mongo, i) => {
        if (props.single === undefined) {
            return (
                <div key={i} className="listBox">
                    <div className="leftBox">
                        <img className='godImage' alt={mongo.god.name} src={mongo.god.portrait}></img>
                        <div className="leftTextCont">
                            <Link to={'/player/' + mongo.player} className='playerName'>{mongo.player}</Link>
                            <div className='underPlayer'>{mongo.god.name}</div>
                            <div className='underPlayer'>{mongo.date}</div>
                            <Link to={'/match/' + mongo.match} className='matchLink'>Match ID: {mongo.match}</Link>
                        </div>
                    </div>
                    <div className="rightBox">
                        <div className="mongoCount">{mongo.count}</div>
                    </div>
                </div>
            )
        } else {
            return (
                <div key={i} className="listBox">
                    <div className="leftBox">
                        <img className='godImage' alt={mongo.god.name} src={mongo.god.portrait}></img>
                        <div className="leftTextCont">
                            <Link to={'/player/' + mongo.player} className='playerName'>{mongo.player}</Link>
                        </div>
                    </div>
                    <div className="rightBox">
                        <div className="mongoCount">{mongo.count}</div>
                    </div>
                </div>
            )
        }
    })

    return (
        <div className="cFlex">
            <div className='titleCont'>
                <div className='title'>{props.type}</div>
                {(props.single === undefined) ? <div className='subTitle'>- Single Match</div> : <div className='subTitle'>- All Time</div>}
            </div>
            <div className='listCont'>
                {mongoData}
            </div>
        </div>
    )
}

export default MongoRender