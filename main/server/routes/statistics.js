var express = require('express');
var axios = require('axios');

var { Battlelogs, Eventlogs, Playerlogs, sequelize, Sequelize: { Op } } = require('../models');

var router = express.Router();

router.get('/:hour', async function(req, res, next) {
    try {
        let endTime = new Date().getTime();
        endTime -= (9 * 60 * 60 * 1000);


        var startTime = new Date().getTime();
        startTime -= (((parseInt(req.params.hour) + 9)) * 60 * 60 * 1000);

        console.log(`endtime : ${new Date(endTime)} / startTime : ${new Date(startTime)}`);

        const ret = await Battlelogs.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(startTime), new Date(endTime)]
                },
                ten: 0
            }
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
});

router.get('/ten/:hour', async function(req, res, next) {
    try {
        let endTime = new Date().getTime();
        endTime -= (9 * 60 * 60 * 1000);


        var startTime = new Date().getTime();
        startTime -= (((parseInt(req.params.hour) + 9)) * 60 * 60 * 1000);

        console.log(`endtime : ${new Date(endTime)} / startTime : ${new Date(startTime)}`);

        const ret = await Battlelogs.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(startTime), new Date(endTime)]
                },
                ten: 1
            }
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
});


router.get('/ten/', async function(req, res, next) {
    try {
        const ret = await Battlelogs.findAll({
            where: { ten: 1 }
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
});
module.exports = router;

router.get('/', async function(req, res, next) {
    try {
        const ret = await Battlelogs.findAll({
            where: { ten: 0 }
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
});
module.exports = router;