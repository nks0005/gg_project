var express = require('express');

var { Battlelogs, Eventlogs, Playerlogs, sequelize } = require('../models');
const playerlogs = require('../models/playerlogs');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
    const battleId = 12345678;
    const totalKills = 10;
    const totalPlayers = 20;
    const logTime = new Date();

    const eventId = 23456789;
    const partyMemberCount = 10;
    const killArea = "OPEN_WORLD";

    const userName = "wanthealcome";
    const guildName = "GOSTOP";
    const allianceName = "SLAP";
    const killType = 2;
    const damage = 1000;
    const heal = 20000;

    const mainHand = "Nature";
    const offHand = "MistCaller";
    const head = "graveGuard";
    const armor = "claricRobe";
    const shoes = "claricShoes";
    const cape = "lymhurst";
    const potion = "resist";

    let transaction;
    try {
        transaction = await sequelize.transaction();
        let result = await Battlelogs.create({
            battleId: battleId,
            totalKills: totalKills,
            totalPlayers: totalPlayers,
            logTime: logTime
        }, { transaction });

        result = await Eventlogs.create({
            eventId,
            partyMemberCount: partyMemberCount,
            killArea: killArea,
            battleId: battleId
        }, { transaction })

        console.log(result);
        res.status(201).json(result);
        //res.render('index', { title: 'Express' });

        await transaction.commit();
    } catch (err) {
        console.log(err);
        if (transaction) await transaction.rollback();
    }


});

module.exports = router;