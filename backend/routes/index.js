const router = require('express').Router();
const { getPlayerInfo, getMongoData } = require('../controllers/apiCont');

router.post('/player', getPlayerInfo)
router.get('/mongo', getMongoData)

module.exports = router;
