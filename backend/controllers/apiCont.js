const Main = require('../models/Main')
const { godPortrait, godsInfo, getItems, orderBans, getBuild } = require('../utility/gameData')

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
                playerObject.icon = (data.Avatar_URL === '' || data.Avatar_URL === 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2016/10/Cutesy_Valkyrie.png') ? 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2015/06/Icon_Snowman_08.png' : data.Avatar_URL
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

                throw error
            })

        await api.getFriends(player)
            .then(async friends => {
                let filteredFriends = friends.filter(friend => { return friend.account_id !== '0' || friend.platform === 'Steam' })

                for await (let friend of filteredFriends) {
                    if (friend.avatar_url === '') friend.avatar_url = 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2015/06/Icon_Snowman_08.png'
                }

                playerObject.friends = filteredFriends
            })
            .catch(err => {
                let error = {
                    actual: err,
                    message: 'something went wrong with finding their friends list'
                }

                throw error
            })

        await api.getMatchHistory(player)
            .then(async matches => {
                let matchArray = []

                if (matches.length === 1 && matches[0].ret_msg.includes('No Match History')) return playerObject.matches = matchArray // checks incase there is no recent matches

                for await (let match of matches) {
                    let matchObject = {}

                    if (match.God === 'ChangE') match.God = "Chang'e" // thanks hirez for inconsitent api data 

                    matchObject.win = (match.Win_Status === 'Win') ? true : false
                    matchObject.godIcon = await godPortrait(match.God.replace(/_/g, ' '), gods)
                    matchObject.godName = match.God.replace(/_/g, ' ')
                    matchObject.mode = match.Queue
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
                let error = {
                    actual: err,
                    message: 'an error happened when looking up the players match history'
                }

                throw error
            })

    })
        .then(() => {
            res.status(200).json(playerObject);
        })
        .catch(err => {
            console.log(err.actual)

            res.status(500).json({
                message: err.message,
                actual: err.actual.toString()
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

module.exports.getMatchData = async (req, res) => {
    const {
        match
    } = req.body

    let gods = await godsInfo()
    let items = await getItems()
    let matchObject = {
        mode: '',
        date: '',
        length: 0,
        id: '',
        region: '',
        banWin: [],
        banLose: [],
        winners: [],
        losers: []
    }

    await api.getMatchDetails(match)
        .then(async data => {            
            let banArray = []
            let firstData = data[0]
            let winFirst = (firstData.First_Ban_Side === 'Winner') ? true : false

            for (let x = 1; x <= 10; x++) {
                let banName = 'Ban' + x

                banArray.push(firstData[banName])
            }

            let filterBanArray = banArray.filter(ban => { return ban !== '' })
            let orderedBans = await orderBans(winFirst, filterBanArray, gods)

            matchObject.mode = firstData.name
            matchObject.id = firstData.Match
            matchObject.date = firstData.Entry_Datetime
            matchObject.length = firstData.Minutes
            matchObject.region = firstData.Region
            matchObject.banWin = orderedBans.winArray
            matchObject.banLose = orderedBans.loseArray

            for await (let player of data) {
                let playerObject = {}
                let buildArray = []
                let activeArray = []

                playerObject.godName = player.Reference_Name.replace(/_/g, ' ')
                playerObject.godIcon = await godPortrait(playerObject.godName, gods)
                playerObject.player = player.hz_player_name === null ? player.hz_gamer_tag : player.hz_player_name
                playerObject.godLevel = player.Final_Match_Level
                playerObject.kills = player.Kills_Player
                playerObject.deaths = player.Deaths
                playerObject.assists = player.Assists
                playerObject.gold = player.Gold_Earned
                playerObject.gpm = player.Gold_Per_Minute
                playerObject.damage = player.Damage_Player
                playerObject.taken = player.Damage_Taken
                playerObject.mitigated = player.Damage_Mitigated
                playerObject.healing = player.Healing
                playerObject.wards = player.Wards_Placed

                for (let i = 1; i <= 6; i++) {
                    let propName = 'ItemId' + i

                    buildArray.push(player[propName])
                }

                for (let z = 1; z <= 2; z++) {
                    let propName = 'ActiveId' + z

                    activeArray.push(player[propName])
                }


                let playerBuild = await getBuild(buildArray, activeArray, items)

                playerObject.actives = playerBuild.actives
                playerObject.build = playerBuild.build

                player.Win_Status === 'Winner' ? matchObject.winners.push(playerObject) : matchObject.losers.push(playerObject)
            }
        })
        .then(() => {
            res.status(200).json(matchObject)
        })
        .catch(err => {
            console.log(err)

            let error = {
                message: 'there was an issue finding this match data, maybe it does not exist, or it is too old',
                actual: err
            }

            res.status(500).json({
                message: error.message,
                actual: err.toString()
            })
        })
}