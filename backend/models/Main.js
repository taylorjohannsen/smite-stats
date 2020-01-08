const mongoose = require('mongoose');
const modelData = require('../utility/model')

// mongodb Main model for main page
const MainData = new mongoose.Schema({
    kills: [modelData],
    deaths: [modelData],
    healing: [modelData],
    wins: [modelData],
    damage: [modelData],
    wards: [modelData],
    masteries: [modelData],
    gold: [modelData],
    conquest: [modelData],
    hours: [modelData]
})

const Main = mongoose.model('Main', MainData, 'main')

module.exports = Main