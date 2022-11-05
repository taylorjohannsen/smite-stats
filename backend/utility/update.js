const Main = require('../models/Main')
const mongoose = require('mongoose')
const { godPortrait, godsInfo } = require('./gameData')

module.exports.updateMongo = () => {
    const players = ['taylortj', 'justvincent', 'Grynth', 'Nightwing728', 'Awesmoses', 'Seraphex', 'Psalodran', 'Cannares']

    Main.findById('5e15606ba16a672c7897d41d')
        .then(async database => {
            let wins = []
            let masteries = []
            let conquest = []
            let hours = []
            let kills = []
            let deaths = []
            let healing = []
            let damage = []
            let wards = []
            let gold = []

            let gods = await godsInfo()

            for await (let player of players) {
                await api.getPlayer(player)
                    .then(data => {
                        console.log(player)
                        playerUpdate(data[0], wins, 'Wins')
                        playerUpdate(data[0], masteries, 'MasteryLevel')
                        playerUpdate(data[0], conquest, 'Rank_Stat_Conquest')
                        playerUpdate(data[0], hours, 'HoursPlayed')
                    })
                    .catch(err => console.log(err))

                await api.getMatchHistory(player)
                    .then(async matches => {
                        await matchUpdate(matches, kills, 'Kills', gods)
                        await matchUpdate(matches, deaths, 'Deaths', gods)
                        await matchUpdate(matches, healing, 'Healing', gods)
                        await matchUpdate(matches, damage, 'Damage', gods)
                        await matchUpdate(matches, wards, 'Wards_Placed', gods)
                        await matchUpdate(matches, gold, 'Gold', gods)
                    })
                    .catch(err => console.log(err))
            }

            database.wins = await sortArrayByCount(wins)
            database.masteries = await sortArrayByCount(masteries)
            database.conquest = await sortArrayByCount(conquest)
            database.hours = await sortArrayByCount(hours)
            database.kills = await sortArrayRemoveDuplicates(kills, database.kills)
            database.deaths = await sortArrayRemoveDuplicates(deaths, database.deaths)
            database.healing = await sortArrayRemoveDuplicates(healing, database.healing)
            database.damage = await sortArrayRemoveDuplicates(damage, database.damage)
            database.wards = await sortArrayRemoveDuplicates(wards, database.wards)
            database.gold = await sortArrayRemoveDuplicates(gold, database.gold)

            database.markModified('wins', 'masteries', 'conquest', 'hours', 'kills', 'deaths', 'healing', 'damage', 'wards', 'gold')
            database.save((err) => console.log('Updated!'))
        })
        .catch(err => console.log(err))
}

function playerUpdate(api, array, property) {
    let newObject = {
        player: '',
        count: 0,
        god: {
            name: '',
            portrait: ''
        },
        date: '',
        match: ''
    }
    
    if (!api) {
        console.log(api)
    }

    newObject.player = api.hz_player_name
    newObject.count = api[property]
    newObject.god.portrait = (api.Avatar_URL === '' || api.Avatar_URL === 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2016/10/Cutesy_Valkyrie.png') ? 'http://webcdn.hirezstudios.com/smite-app/wp-content/uploads/2015/06/Icon_Snowman_08.png' : api.Avatar_URL

    array.push(newObject)
}

function matchUpdate(api, array, property, gods) {
    return new Promise(async (resolve, reject) => {
        let newArray = []
        let filteredMatches = await api.filter(match => {
            if (match.Map_Game !== null) {
                return match.Map_Game.includes('Conquest')
            }
        })

        for await (let match of filteredMatches) {
            let newObject = {
                _id: mongoose.Types.ObjectId(),
                player: '',
                count: 0,
                god: {
                    name: '',
                    portrait: ''
                },
                date: '',
                match: 0
            }

            if (match.God === 'ChangE') match.God = "Chang'e" // thanks hirez for inconsitent api data 

            newObject.player = match.playerName
            newObject.count = match[property]
            newObject.god.name = match.God.replace(/_/g, ' ')
            newObject.god.portrait = await godPortrait(match.God.replace(/_/g, ' '), gods)
            newObject.date = match.Match_Time
            newObject.match = match.Match

            array.push(newObject)
        }

        resolve(newArray)
    })
        .catch(err => console.log(err))
}

function sortArrayByCount(array) {
    return new Promise((resolve, reject) => {
        let sortedArray = array.sort((a, b) => (a.count < b.count) ? 1 : -1)

        sortedArray.splice(10)
        resolve(sortedArray)
    })
        .catch(err => console.log(err))
}

async function sortArrayRemoveDuplicates(array, db) {
    return new Promise(async (resolve, reject) => {
        let sortedArray = []
        let duplicateArray = []

        for await (let element of db) {
            let found = await array.find(obj => element.match === obj.match)

            if (found) {
                duplicateArray.push(found)
            }
        }

        for await (let duplicate of duplicateArray) {
            array.splice(array.indexOf(duplicate), 1)
        }
        
        array.concat(db)
        sortedArray = array.sort((a, b) => (a.count < b.count) ? 1 : -1)

        sortedArray.splice(10)
        resolve(sortedArray)
    })
        .catch(err => console.log(err))
}

