const Main = require('../models/Main')

module.exports.getPlayerInfo = async (req, res) => {
    let players = ['taylortj', 'justvincent', 'ClassicWaldo', 'Nightwing728']
    let playerInfo = [];


    function getPlayerData(player) {
        return api.getPlayer(player)
            .then(data => {
                console.log(data)
                playerInfo.push(data);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    }

    res.status(200).json(playerInfo);
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