const express = require('express')
const router = express.Router()
const { getLastMatches, getMongoArray, getPlayer} = require('../controllers/discordCont')

router.get('/player/:player', getPlayer)
router.get('/matches/:player', getLastMatches)
router.get('/mongo/:array', getMongoArray)

module.exports = router;