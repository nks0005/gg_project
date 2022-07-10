var express = require('express');
var axios = require('axios');

var { Battlelogs, Eventlogs, Playerlogs, sequelize, Sequelize } = require('../models');

var router = express.Router();

router.get('/:userName', async function(req, res, next) {
    const userName = req.params.userName;

    try {
        var { count, rows } = await Battlelogs.findAndCountAll({
            include: [{
                model: Eventlogs,
                required: true,
                include: [{
                    model: Playerlogs,
                    where: { killType: 2, userName: userName },
                    required: true
                }]
            }],
            distinct: true,
        });
        const wincount = count;
        //console.log(wincount);

        var { count, rows } = await Battlelogs.findAndCountAll({
            include: [{
                model: Eventlogs,
                required: true,
                include: [{
                    model: Playerlogs,
                    where: { killType: 1, userName: userName },
                    required: true
                }]
            }],
            distinct: true,
        });
        const losecount = count;
        //console.log(losecount);

        if (wincount > 0)
            res.status(201).send({ 'wincount': wincount, 'losecount': losecount });
        else
            res.status(202).send('Not Found');
    } catch (err) {
        res.status(501).send('Error');
        console.log(err);
        next(err);
    }
});

module.exports = router;