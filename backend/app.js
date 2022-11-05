const express = require('express')
const hirez = require('./utility/hirez-api')
const creds = require('./utility/dev-key')
const db = require('./utility/db')
const index = require('./routes/index')
const discord = require('./routes/discord')
const mongoose = require('mongoose')
const update = require('./utility/update')
const schedule = require('node-schedule')
const cors = require('cors')

const app = express()

app.use(cors())

global.api = new hirez.Smite({
    platform: "PC",
    devId: creds.devid,
    authKey: creds.authKey,
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect(db.uri, { useNewUrlParser: true, useUnifiedTopology: true } ,(err) => (err) ? console.log(err) : console.log('Connnected to DB!'))

app.use('/', index)
app.use('/discord', discord)

schedule.scheduleJob('30 * * * *', () => update.updateMongo())

app.listen(3100, () => console.log('Started Node on port 3100!'))
