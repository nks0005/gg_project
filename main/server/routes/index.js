var express = require('express');
var axios = require('axios');

var { Battlelogs, Eventlogs, Playerlogs, sequelize, Sequelize: { Op } } = require('../models');
const playerlogs = require('../models/playerlogs');

var router = express.Router();


function array2count(array) {
    return Object.keys(array).length
}

function timestamp2datetime(timestamp) {
    return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
}

function equip2Type(Equip) {
    if (Equip == null) return Equip;
    return Equip['Type'];
}

const killType = { Killer: 0, Victim: 1, Support: 2 };

async function createPlayerlog(json, eventId, killType, Playerlogs, transaction) {
    const { Name, GuildName, AllianceName, DamageDone, SupportHealingDone, AverageItemPower, Equipment: { MainHand, OffHand, Head, Armor, Shoes, Cape, Potion } } = json;

    await Playerlogs.create({
        userName: Name,
        guildName: GuildName,
        allianceName: AllianceName,
        killType: killType,
        damage: DamageDone,
        heal: SupportHealingDone,
        avgIp: AverageItemPower,
        mainHand: equip2Type(MainHand),
        offHand: equip2Type(OffHand),
        head: equip2Type(Head),
        armor: equip2Type(Armor),
        shoes: equip2Type(Shoes),
        cape: equip2Type(Cape),
        eventId: eventId
    }, { transaction });
}


// battleid 값을 받으면 크롤링과 DB에 업데이트를 진행한다.
router.get('/:battleid', async function(req, res, next) {
    //console.log(req.params.battleid);
    const battleId = req.params.battleid;
    if (battleId != undefined && parseInt(battleId) == battleId) {
        // 이미 존재하는지 확인
        let check = await Battlelogs.findAll({
            attributes: ['battleId'],
            where: { battleId: parseInt(battleId) }
        });
        //console.log(check.length);
        if (check.length > 0) { res.status(202).send("Exists"); } else {

            let transaction;
            try {
                transaction = await sequelize.transaction();

                let battlelogs = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/battles/${battleId}`);
                const { id, totalKills, players, endTime } = battlelogs.data;
                //console.log(`id = ${id}, totalKills = ${totalKills}, players = ${array2count(players)}, endTime = ${timestamp2datetime(endTime)}`);

                await Battlelogs.create({
                    battleId: id,
                    totalKills: totalKills,
                    totalPlayers: array2count(players),
                    logTime: timestamp2datetime(endTime)
                }, { transaction });

                let eventlogs = await axios.get(`https://gameinfo.albiononline.com/api/gameinfo/events/battle/${id}?offset=0&limit=${totalKills}`)
                for (const eventlog of eventlogs.data) {
                    // eventlog
                    const { EventId, GroupMembers, KillArea, BattleId } = eventlog;
                    await Eventlogs.create({
                        eventId: EventId,
                        partyMemberCount: array2count(GroupMembers),
                        killArea: KillArea,
                        battleId: BattleId
                    }, { transaction });

                    // playerlog
                    const { Killer, Victim, Participants } = eventlog;

                    // Killer (killtype)0
                    await createPlayerlog(Killer, EventId, killType.Killer, Playerlogs, transaction);

                    // Victim (killtype)1
                    await createPlayerlog(Victim, EventId, killType.Victim, Playerlogs, transaction);

                    // Participants (killtype)2
                    for (const support of Participants) {
                        await createPlayerlog(support, EventId, killType.Support, Playerlogs, transaction);
                    }
                }

                await transaction.commit();
                res.status(201).send(id);
            } catch (err) {
                console.log("error");
                if (transaction) await transaction.rollback();
                next(err);
            }
        }
    }
});
/*
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

const avgIp = 1200;
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
        eventId: eventId,
        partyMemberCount: partyMemberCount,
        killArea: killArea,
        battleId: battleId
    }, { transaction });

    result = await Playerlogs.create({
        userName: userName,
        guildName: guildName,
        allianceName: allianceName,
        killType: killType,
        damage: damage,
        heal: heal,
        avgIp: avgIp,
        mainHand: mainHand,
        offHand: offHand,
        head: head,
        armor: armor,
        shoes: shoes,
        cape: cape,
        eventId: eventId

    }, { transaction });

    console.log(result);
    res.status(201).json(result);
    //res.render('index', { title: 'Express' });

    await transaction.commit();
} catch (err) {
    console.log(err);
    if (transaction) await transaction.rollback();
}


});
*/

module.exports = router;