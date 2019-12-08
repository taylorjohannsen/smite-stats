const express = require('express');
const Hirez = require('hirez.js');
const creds = require('./utility/dev-key');

const app = express();

app.listen(3001, () => console.log('Started Node on port 3001!'));

let hirez = new Hirez({
    devId: creds.devid,
    authKey: creds.authKey
})

hirez.smite('pc').session.generate()
    .then((res) => {
        hirez.smite('pc').getMatchHistory('taylortj')
            .then(player => {
                

                console.log(player)
            })
    })
    .catch(err => {
        console.log(err);
    })