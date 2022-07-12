var express = require('express');
var axios = require('axios');

var { Battlelogs, Totallogs, sequelize, Sequelize: { Op } } = require('../models');

var router = express.Router();

async function checkTotal(data) {
    const ret = await Totallogs.findAll({
        where: {
            A: data[0],
            B: data[1],
            C: data[2],
            D: data[3],
            E: data[4]
        }
    });


    return ret;
}

async function insertTotal(data, win, lose) {
    try {
        const ret = await Totallogs.create({
            A: data[0],
            B: data[1],
            C: data[2],
            D: data[3],
            E: data[4],
            win: win,
            lose: lose
        });

        return ret;
    } catch (err) {
        return err;
    }

}

async function updateTotal(data, win, lose) {
    try {
        const ret = await Totallogs.update({
            win: win,
            lose: lose
        }, {
            where: {
                A: data[0],
                B: data[1],
                C: data[2],
                D: data[3],
                E: data[4]
            }
        });
        return ret;
    } catch (err) {
        throw err;
    }
}

router.get('/', async function(req, res, next) {
    try {
        const ret = await Battlelogs.findAll({
            where: { checkTotal: null },
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
});

router.get('/:battleId', async function(req, res, next) {
    const battleId = req.params.battleId;
    try {
        const ret = await Battlelogs.update({
            checktotal: 1
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

router.post('/win/', async function(req, res, next) {
    try {
        if (req.body.length != 5) throw `length 값 오류`;
        //console.log(req.body);
        let ret = await checkTotal(req.body);

        // ret 값 : 0 => 존재하지 않음
        if (ret.length > 0) {
            let win = parseInt(ret[0]['win']);
            let lose = parseInt(ret[0]['lose']);
            win++;
            ret = await updateTotal(req.body, win, lose);
        } else {
            ret = await insertTotal(req.body, 1, 0);
        }
        res.send('ok');

    } catch (err) {
        res.send('err');
        console.error(err);
        next(err);
    }
});

router.post('/lose/', async function(req, res, next) {
    try {
        if (req.body.length != 5) throw `length 값 오류`;
        //console.log(req.body);
        let ret = await checkTotal(req.body);


        // ret 값 : 0 => 존재하지 않음
        if (ret.length > 0) {
            let win = parseInt(ret[0]['win']);
            let lose = parseInt(ret[0]['lose']);
            lose++;
            ret = await updateTotal(req.body, win, lose);
        } else {
            ret = await insertTotal(req.body, 0, 1);
        }
        res.send('ok');

    } catch (err) {
        res.send('err');
        console.error(err);
        next(err);
    }
});



module.exports = router;