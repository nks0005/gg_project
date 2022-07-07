var express = require('express');
var axios = require('axios');

var { Battlelogs, Eventlogs, Playerlogs, sequelize, Sequelize: { Op } } = require('../models');

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
                res.status(201).send(id.toString());
            } catch (err) {
                console.log("error");
                res.status(501).send('err');
                if (transaction) await transaction.rollback();
                next(err);
            }
        }
    }
});
module.exports = router;