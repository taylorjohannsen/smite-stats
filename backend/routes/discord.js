const express = require('express')
const router = express.Router()
const { getLastMatch, getMongoArray, getPlayer} = require('../controllers/discordCont')

router.post('/player/:player', getPlayer)
router.post('/match/:player', getLastMatch)
router.post('/mongo/:array', getMongoArray)

module.exports = router;