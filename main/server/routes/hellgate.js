var express = require('express');
var axios = require('axios');

var { Battlelogs, Eventlogs, Playerlogs, sequelize, Sequelize: { Op } } = require('../models');

var router = express.Router();

router.get('/', async function(req, res, next) {
    try {
        const ret = await Battlelogs.findAll({
            include: [{
                model: Eventlogs,
                include: [{
                    model: Playerlogs
                }]
            }],
            where: { send: null, ten: 0 },
            limit: 1
        });
        if (ret.length) {
            res.status(201).send(ret);
        } else {
            res.status(202).send('Nothing');
        }
    } catch (err) {
        res.status(501).send('err');
        console.err(err);
        next(err);
    }
    //console.log(ret);
    //console.log(ret[0]['eventlogs'][0]['eventId']);
});

router.get('/ten/', async function(req, res, next) {
    try {
        const ret = await Battlelogs.findAll({
            include: [{
                model: Eventlogs,
                include: [{
                    model: Playerlogs
                }]
            }],
            where: { send: null, ten: 1 },
            limit: 1
        });
        if (ret.length) {
            res.status(201).send(ret);
        } else {
            res.status(202).send('Nothing');
        }
    } catch (err) {
        res.status(501).send('err');
        console.err(err);
        next(err);
    }
    //console.log(ret);
    //console.log(ret[0]['eventlogs'][0]['eventId']);
});

router.get('/:battleId', async function(req, res, next) {
    const battleId = req.params.battleId;
    try {
        const ret = await Battlelogs.update({
            send: 1
        }, {
            where: { battleId: battleId }
        });
        res.status(201).send('OK');
    } catch (err) {
        res.status(501).send('Error');
        console.log(err);
        next(err);
    }
});


module.exports = router;