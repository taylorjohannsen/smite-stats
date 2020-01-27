const Main = require('../models/Main')

module.exports.getPlayerInfo = async (req, res) => {
    // const {
    //     player
    // } = req.body
    let player = 'taylortj'
    let playerObject = {}
    
    // team, name, level, master, conq rank, region, hoursl, wins ,losess leaves, friends list, matches
    api.getPlayer(player)
        .then(res => {
            let data = res[0]

            playerObject.name = data.hz_player_name
            playerObject.icon = (data.Avatar_URL === '') ? '' : ''



            // res.status(200).json(playerInfo);
        })
        .catch(err => {
            res.status(500).json(err);
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

