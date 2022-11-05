const Main = require('../models/Main')

module.exports.getPlayer = async (req, res) => {
    const {
        player
    } = req.params

    let playerObject = {}

    await api.getPlayer(player)
        .then(res => {
            let data = res[0]

            playerObject.name = data.hz_player_name
            playerObject.icon = (data.Avatar_URL === '') ? 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2015/06/Icon_Snowman_08.png' : data.Avatar_URL
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
            let error = {
                actual: err,
                message: 'this player does not exist on pc or their stats are private'
            }

            res.status(500).json(error)
        })

    res.status(200).json(playerObject)
}

module.exports.getLastMatches = async (req, res) => {
    const {
        player
    } = req.params

    let playerObject = {}

    await api.getMatchHistory(player)
        .then(async matches => {
            let matchArray = []

            if (matches.length === 1 && matches[0].ret_msg.includes('No Match History')) return playerObject.matches = matchArray // checks incase there is no recent matches

            for await (let match of matches) {
                let matchObject = {}

                matchObject.win = (match.Win_Status === 'Win') ? true : false
                matchObject.godName = match.God.replace(/_/g, ' ')
                matchObject.mode = match.Queue
                matchObject.id = match.Match
                matchObject.date = match.Match_Time
                matchObject.length = match.Minutes
                matchObject.kills = match.Kills
                matchObject.deaths = match.Deaths
                matchObject.assists = match.Assists
                matchObject.damage = match.damage
                matchObject.wards = match.Wards_Placed

                matchArray.push(matchObject)
            }

            if (matchArray.length === 0) throw new Error('No matches!')

            playerObject.matches = matchArray
            res.status(200).json(playerObject)
        })
        .catch(err => {
            let error = {
                actual: err,
                message: 'an error happened when looking up the players match history'
            }

            res.status(500).json(error)
        })
}

module.exports.getMongoArray = (req, res) => {
    const {
        array
    } = req.params

    Main.findById('5e15606ba16a672c7897d41d')
        .then(mongo => {
            let selectedArray = mongo[array]

            if (selectedArray === undefined) {
                throw new Error('No such leaderboard!')
            }

            res.status(200).json(selectedArray);
        })
        .catch(err => {
            res.status(500).json(err);
        })
}