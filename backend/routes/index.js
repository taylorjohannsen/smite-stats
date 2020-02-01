const router = require('express').Router();
const { getPlayerInfo, getMongoData, getMatchData } = require('../controllers/apiCont');

router.post('/player', getPlayerInfo)
router.get('/mongo', getMongoData)
router.post('/match', getMatchData)

module.exports = router;
