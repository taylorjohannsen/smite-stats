const express = require('express')
const hirez = require('hirez-api')
const creds = require('./utility/dev-key')
const db = require('./utility/db')
const index = require('./routes/index')
const mongoose = require('mongoose')
const update = require('./utility/update')
const schedule = require('node-schedule')
const cors = require('cors')

const app = express()

global.api = new hirez.Smite({
    platform: "PC",
    devId: creds.devid,
    authKey: creds.authKey,
})

app.use(cors())

mongoose.connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true } ,(err) => (err) ? console.log(err) : console.log('Connnected to DB!'))

app.use('/', index)
schedule.scheduleJob('30 * * * *', () => update.updateMongo())
require('./controllers/apiCont').getPlayerInfo()

app.listen(3001, () => console.log('Started Node on port 3001!'))

