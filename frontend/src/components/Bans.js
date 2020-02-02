import React from 'react'
import '../css/Bans.css'

function Bans(props) {
    if (props.ban !== true) return ''

    let winnerBans = props.win.map(ban => {
        return (
            <img className='itemIcon' data-tip={ban.godName} src={ban.godIcon} alt={ban.godName} key={ban.godName} />
        )
    })

    let loserBans = props.lose.map(ban => {
        return (
            <img className='itemIcon' data-tip={ban.godName} src={ban.godIcon} alt={ban.godName} key={ban.godName} />
        )
    })

    return (
        <div>
            <div className="tableName">Bans</div>
            <div className="banCont">
                <div className='banBox win'>
                    {winnerBans}
                </div>
                <div className='banBox lose'>
                    {loserBans}
                </div>
            </div>
        </div>
    )
}

export default Bans