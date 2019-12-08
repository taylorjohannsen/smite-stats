const express = require('express');
const Hirez = require('hirez.js');

const app = express();

app.listen(3001, () => console.log('Started Node on port 3001!'));

let hirez = new Hirez({
    devId: '3420',
    authKey: 'A26A258DC35048DEA884D8DDF99DBD56'
})

hirez.smite('pc').session.generate()
    .then((res) => {
        hirez.smite('pc').getGodRanks('taylortj')
            .then(ranks => {
                let topGods = ranks.filter(rank => {
                    return rank.Rank > 5;
                });

                console.log(topGods)
            })
    })
    .catch(err => {
        console.log(err);
    })