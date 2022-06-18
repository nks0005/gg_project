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

    // 전투 로그 업데이트
    async updateBattlelog() {

        const battleMax = 20;
        const battlelogUrl = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${battleMax}&sort=recent`;

        const battlelogs = await this.crawler.mustGetBodyByUrl(battlelogUrl); // battlelog가 담긴 json 데이터를 받는다.

        for (const battlelog of battlelogs) {
            const param = [battlelog['id'], battlelog['totalKills'], this.array2count(battlelog['players']), this.timestamp2datetime(battlelog['endTime'])];
            const [ret] = await this.con.query(`INSERT IGNORE INTO battlelog (battleid, totalkills, totalplayercount, endtime) VALUES (?, ?, ?, ?);`, param);
        }
        return battlelogs;
    }

    // 이벤트 로그 업데이트
    async updateEventlog(battlelogs) {
        let arrEventlog = new Array();
        let arrEventlogJson = new Array();
        for (const battlelog of battlelogs) {
            const eventlogUrl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battlelog['id']}?offset=0&limit=51`;
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

    // 전투 로그 이벤트 로그 연결 업데이트
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

                // 막타 killtype = 0
                this.checkUpdatePlayer(eventlog['EventId'], eventlog['Killer'], this.killtype.killer);

                // 죽은자 killtype = 1
                this.checkUpdatePlayer(eventlog['EventId'], eventlog['Victim'], this.killtype.victim);

                // 도운자 killtype = 2
                for (const part of eventlog['Participants']) {
                    this.checkUpdatePlayer(eventlog['EventId'], part, this.killtype.assist);
                }
            }
        }
    }


    async start() {
        try {
            await this.con.beginTransaction(); // db 트렌젝션 제어

            // 전투로그 
            console.time('updateBattelog');
            const battlelogs = await this.updateBattlelog();
            console.timeEnd('updateBattelog');

            // 이벤트로그
            console.time('updateEventlog');
            const [arrEventlog, arrEventlogJson] = await this.updateEventlog(battlelogs);
            console.timeEnd('updateEventlog');

            // 전투로그-이벤트로그 연결
            //console.time('updateBattleEvent');
            //await this.updateBattleEvent(arrEventlog);
            //console.timeEnd('updateBattleEvent');

            // 플레이어로그
            console.time('updatePlayerLog');
            await this.updatePlayerLog(arrEventlogJson);
            console.timeEnd('updatePlayerLog');

            await this.con.commit(); // db 변동
        } catch (err) {
            await this.con.rollback(); // DB 변동 사항 없음
            console.log(err);
        } finally {
            // await this.con.end();
        }
    }
}

module.exports.killboard = killboard;