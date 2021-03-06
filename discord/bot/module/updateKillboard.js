const crawler = require('./crawler');
const database = require('./database');
const { DB } = require('../config/config.json');


class killboard {
    constructor() {
        this.con = new database.database(DB).getCon();
        this.crawler = new crawler.crawler();
        this.killtype = { killer: 0, victim: 1, assist: 2 }; // enum

        //this.battleMax = 20;
        // this.battlelogUrl = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${this.battleMax}&sort=recent`;
        // this.eventlogUrl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/?offset=0&limit=${battlelogs.totalkills}`;
    }

    timestamp2datetime(timestamp) {
        return new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    }

    array2count(array) {
        return Object.keys(array).length
    }

    async updateEventLog(_arg) {
        const { battlelog: { battleid, totalkills } } = _arg;
        console.log(`updateEventLog battleid : ${battleid} | totalkills : ${totalkills}`);

        const eventLogUrl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battleid}?offset=0&limit=${totalkills}`;
        const eventlogs = await this.crawler.mustGetBodyByUrl(eventLogUrl);


        let arrEventlog = new Array();
        let arrEventlogJson = new Array();
        for (const battlelog of battlelogs) {
            const eventlogUrl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battlelog['id']}?offset=0&limit=${battlelog['totalKills']}`;
            const eventlogs = await this.crawler.mustGetBodyByUrl(eventlogUrl);
            arrEventlogJson.push(eventlogs);

            for (const eventlog of eventlogs) {
                arrEventlog.push({
                    "eventid": eventlog['EventId'],
                    "battleid": battlelog['id']
                });


                // eventid | endtime | partymembercount | killarea | battleid
                const param = [eventlog['EventId'], this.timestamp2datetime(eventlog['TimeStamp']), this.array2count(eventlog['GroupMembers']), eventlog['KillArea'], eventlog['BattleId']];
                const [ret] = await this.con.query(`INSERT IGNORE INTO eventlog (eventid, endtime, partymembercount, killarea, battleid) VALUES (?, ?, ?, ?, ?);`, param);
            }
        }
        return [arrEventlog, arrEventlogJson];
    }

    async updateBattleLog(_battlelog) {
        const battlelog = _battlelog;

        const param = [battlelog['id'], battlelog['totalKills'], this.array2count(battlelog['players']), this.timestamp2datetime(battlelog['endTime'])];
        const [ret] = await this.con.query(`INSERT IGNORE INTO battlelog (battleid, totalkills, totalplayercount, endtime) VALUES (?, ?, ?, ?);`, param);

        await this.updateEventLog({
            battlelog: {
                battleid: battlelog['id'],
                totalkills: battlelog['totalKills']
            }
        });
    }



    async updateAll(_battlelog) {
        try {
            await this.con.beginTransaction(); // db ???????????? ??????

            const battlelog = _battlelog;
            await this.updateBattleLog();




            await this.con.commit(); // db ??????
        } catch (err) {
            await this.con.rollback(); // DB ?????? ?????? ??????
        } finally {

        }
    }

    async update() {
        const battleMax = 20;
        const battlelogUrl = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${battleMax}&sort=recent`;

        const battlelogs = await this.crawler.mustGetBodyByUrl(battlelogUrl); // get json from url

        for (const battlelog of battlelogs) {
            const [check] = await this.con.query(`SELECT battleid FROM battlelog WHERE battleid = ${battlelog['id']};`);
            if (check.length === 0)
                updateAll(battlelog);
            else console.log(`?????? ???????????????. ${check['battleid']}`);
        }
    }

    // ?????? ?????? ????????????
    async updateBattlelog() {

        const battleMax = 20;
        const battlelogUrl = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${battleMax}&sort=recent`;

        const battlelogs = await this.crawler.mustGetBodyByUrl(battlelogUrl); // battlelog??? ?????? json ???????????? ?????????.

        for (const battlelog of battlelogs) {
            const param = [battlelog['id'], battlelog['totalKills'], this.array2count(battlelog['players']), this.timestamp2datetime(battlelog['endTime'])];
            const [ret] = await this.con.query(`INSERT IGNORE INTO battlelog (battleid, totalkills, totalplayercount, endtime) VALUES (?, ?, ?, ?);`, param);
        }
        return battlelogs;
    }

    // ????????? ?????? ????????????
    async updateEventlog(battlelogs) {
        let arrEventlog = new Array();
        let arrEventlogJson = new Array();
        for (const battlelog of battlelogs) {
            const eventlogUrl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battlelog['id']}?offset=0&limit=${battlelog['totalKills']}`;
            const eventlogs = await this.crawler.mustGetBodyByUrl(eventlogUrl);
            arrEventlogJson.push(eventlogs);

            for (const eventlog of eventlogs) {
                arrEventlog.push({
                    "eventid": eventlog['EventId'],
                    "battleid": battlelog['id']
                });


                // eventid | endtime | partymembercount | killarea | battleid
                const param = [eventlog['EventId'], this.timestamp2datetime(eventlog['TimeStamp']), this.array2count(eventlog['GroupMembers']), eventlog['KillArea'], eventlog['BattleId']];
                const [ret] = await this.con.query(`INSERT IGNORE INTO eventlog (eventid, endtime, partymembercount, killarea, battleid) VALUES (?, ?, ?, ?, ?);`, param);
            }
        }
        return [arrEventlog, arrEventlogJson];
    }

    // ?????? ?????? ????????? ?????? ?????? ????????????
    async updateBattleEvent(arrEventlog) {
        for (const eventlog of arrEventlog) {
            // battleid | eventid
            const param = [eventlog['battleid'], eventlog['eventid']];
            await this.con.query(`INSERT IGNORE INTO battlelog_eventlog (battleid, eventid) VALUES (?, ?);`, param);
        }
    }


    check_equip(arg) {
        if (arg == null) {
            arg = {};
            arg['Type'] = '0';
        }
        return arg['Type'];
    }

    async checkUpdatePlayer(eventid, player, killtype) {
        // eventid | username | guildname | alliancename | killtype | damage | heal | avgip | mainhand | offhand | head | armor | shoes | cape | potion | food
        //console.log(player);
        //console.log(player['Equipment']);
        const equiment = player['Equipment'];
        let param = [
            eventid,
            player['Name'],
            player['GuildName'],
            player['AllianceName'],
            killtype,
            null, // damage  [5]
            null, // heal [6]
            player['AverageItemPower'],
            this.check_equip(equiment['MainHand']),
            this.check_equip(equiment['OffHand']),
            this.check_equip(equiment['Head']),
            this.check_equip(equiment['Armor']),
            this.check_equip(equiment['Shoes']),
            this.check_equip(equiment['Cape']),
            this.check_equip(equiment['Potion']),
            this.check_equip(equiment['Food'])
        ];
        switch (killtype) {
            case this.killtype.killer:
                break;

            case this.killtype.victim:
                break;

            case this.killtype.assist:
                param[5] = player['DamageDone'];
                param[6] = player['SupportHealingDone'];
                break;
        }
        const [ret] = await this.con.query(`SELECT * FROM playerlog WHERE eventid = '${param[0]}' AND username = '${param[1]}';`);
        if (ret.length < 1) {
            await this.con.query(`INSERT INTO playerlog (eventid, username, guildname, alliancename, killtype, damage, heal, avgip, mainhand, offhand, head, armor, shoes, cape, potion, food) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, param);
        }
    }

    async updatePlayerLog(arrEventlogJson) {
        for (const eventlogs of arrEventlogJson) {
            for (const eventlog of eventlogs) {

                // ?????? killtype = 0
                this.checkUpdatePlayer(eventlog['EventId'], eventlog['Killer'], this.killtype.killer);

                // ????????? killtype = 1
                this.checkUpdatePlayer(eventlog['EventId'], eventlog['Victim'], this.killtype.victim);

                // ????????? killtype = 2
                for (const part of eventlog['Participants']) {
                    this.checkUpdatePlayer(eventlog['EventId'], part, this.killtype.assist);
                }
            }
        }
    }


    async start() {
        try {
            await this.con.beginTransaction(); // db ???????????? ??????

            // ???????????? 
            console.time('updateBattelog');
            const battlelogs = await this.updateBattlelog();
            console.timeEnd('updateBattelog');

            // ???????????????
            console.time('updateEventlog');
            const [arrEventlog, arrEventlogJson] = await this.updateEventlog(battlelogs);
            console.timeEnd('updateEventlog');

            // ????????????-??????????????? ??????
            //console.time('updateBattleEvent');
            //await this.updateBattleEvent(arrEventlog);
            //console.timeEnd('updateBattleEvent');

            // ??????????????????
            console.time('updatePlayerLog');
            await this.updatePlayerLog(arrEventlogJson);
            console.timeEnd('updatePlayerLog');

            await this.con.commit(); // db ??????
        } catch (err) {
            await this.con.rollback(); // DB ?????? ?????? ??????
            console.log(err);
        } finally {
            // await this.con.end();
        }
    }
}

module.exports.killboard = killboard;


// ????????? ????????? ????????????
/*
?????? ??????
??????????????? 20?????? ??????

?????? ??????
?????????????????? 1?????? ??? 20??? ??????



*/