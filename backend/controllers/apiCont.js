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
                let filteredFriends = friends.filter(friend => { return friend.account_id !== '0'|| friend.platform === 'Steam'})

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
                    console.log(match)
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

            let filterBanArray = banArray.filter(ban => { return ban !== ''})
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
        .catch(err => {
            console.log(err)
            res.json(500).json({
                message: 'There was an error retrieving match data!'
            })
        })

    res.status(200).json(matchObject)
}