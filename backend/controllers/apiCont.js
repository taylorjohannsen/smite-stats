const Main = require('../models/Main')

module.exports.getPlayerInfo = async (req, res) => {
    const {
        player
    } = req.body

    let playerObject = {}

    await godsInfo().then(async gods => {
        await api.getPlayer(player)
            .then(res => {
                let data = res[0]

                playerObject.name = data.hz_player_name
                playerObject.icon = (data.Avatar_URL === '') ? 'http://cds.q6u4m8x5.hwcdn.net/web/smite-app//wp-content/uploads/2017/05/AvatarCutesyFafnir.png' : data.Avatar_URL
                playerObject.team = data.Team_Name
                playerObject.level = data.Level
                playerObject.masteries = data.MasteryLevel
                playerObject.rank = data.Rank_Stat_Conquest
                playerObject.region = data.Region
                playerObject.hours = data.HoursPlayed
                playerObject.wins = data.Wins
                playerObject.loss = data.Losses
                playerObject.leaves = data.Leaves

            })
            .catch(err => {
                console.log(err)
                throw new Error('Player does not exist!')
            })

        await api.getFriends(player)
            .then(async friends => {
                let filteredFriends = friends.filter(friend => { return friend.account_id !== '0' })

                for await (let friend of filteredFriends) {
                    if (friend.avatar_url === '') friend.avatar_url = 'http://cds.q6u4m8x5.hwcdn.net/web/smite-app//wp-content/uploads/2017/05/AvatarCutesyFafnir.png'
                }

                playerObject.friends = filteredFriends
            })
            .catch(err => {
                console.log(err)
                throw new Error('Error finding friends list!')
            })

        await api.getMatchHistory(player)
            .then(async matches => {
                let matchArray = []

                if (matches.length === 1 && matches[0].ret_msg.includes('No Match History')) return playerObject.matches = matchArray // checks incase there is no recent matches

                for await (let match of matches) {
                    let matchObject = {}

                    matchObject.win = (match.Win_Status === 'Win') ? true : false
                    matchObject.godIcon = await godPortrait(match.God.replace('_', ' '), gods)
                    matchObject.godName = match.God.replace('_', ' ')
                    matchObject.mode = match.Map_Game
                    matchObject.id = match.Match
                    matchObject.date = match.Match_Time
                    matchObject.length = match.Minutes
                    matchObject.kills = match.Kills
                    matchObject.deaths = match.Deaths
                    matchObject.assists = match.Assists

                    matchArray.push(matchObject)
                }

                playerObject.matches = matchArray
            })
            .catch(err => {
                console.log(err)
                throw new Error('Error finding match history!')
            })

    })
        .then(() => {
            res.status(200).json(playerObject);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            });
        })
}

module.exports.getMongoData = (req, res) => {
    Main.findById('5e15606ba16a672c7897d41d')
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}

function godsInfo() {
    return new Promise((resolve, reject) => {
        api.getGods()
            .then(gods => {
                resolve(gods)
            })
            .catch(err => console.log(err))
    })
        .catch(err => console.log(err))
}

function godPortrait(name, gods) {
    return new Promise(async (resolve, reject) => {
        let character = await gods.find(god => { return god.Name === name })

        if (character !== undefined) {
            resolve(character.godIcon_URL)
        } else {
            resolve('')
        }
    })
        .catch(err => console.log(err))
}