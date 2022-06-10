// 데이터베이스에 주기적으로 킬보드를 업로드
const https = require('https');
const mysql2 = require('mysql2');


class battlelog {

    constructor() {
        this.dbcon = mysql2.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: 'my_bot'
        });

        this.battleMax = 20;

        this.urlBattlelog = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=${this.battleMax}&sort=recent`;
    }

    async getJsonbyUrl(url) {
        let complete = false;
        let body = ``;
        while (true) {
            try {
                body = await this.getJsonbyUrl2(url);
                complete = true;
            } catch (e) {
                //console.log(e);
            }
            if (complete === true) return body;
        }
    }
    async getJsonbyUrl2(url) {
        return new Promise((resolve, reject) => {
            const request = https.request(url, function(res) {
                let data = ``;

                res.on('data', function(chunk) { data += chunk.toString(); });
                res.on('end', function() {
                    if (res.statusCode === 200) {
                        //console.log(`${url} OK`);
                        const body = JSON.parse(data);
                        resolve(body);
                        // 처리 함수
                    } else {
                        reject(`${url}에 대한 OK 에러 발생`)
                    }
                });
            });
            request.setTimeout(50000, function() {
                reject(`${url} timeout`);
            });
            request.on('error', function(err) {
                reject(`${url}에 대한 request 에러 발생`);
            });


            request.end();
        });
    }

    check_equip(arg) {
        if (arg == null) {
            arg = {};
            arg['Type'] = '0';
        }
        return arg;
    }

    // eqid 값을 얻기 위해서는 db에 올린 후 값을 받아야한다.
    async process_equip(equip) {
        let eq = new Object();
        eq.mainhand = this.check_equip(equip['MainHand'])['Type'];
        eq.offhand = this.check_equip(equip['OffHand'])['Type'];
        eq.head = this.check_equip(equip['Head'])['Type'];
        eq.armor = this.check_equip(equip['Armor'])['Type'];
        eq.shoes = this.check_equip(equip['Shoes'])['Type'];
        eq.cape = this.check_equip(equip['Cape'])['Type'];
        eq.potion = this.check_equip(equip['Potion'])['Type'];
        eq.food = this.check_equip(equip['Food'])['Type'];

        const [row] = await this.dbcon.promise().query(`INSERT IGNORE INTO equiment (mainHand, offHand, head, armor, shoes, cape, potion, food) VALUES ('${eq.mainhand}', '${eq.offhand}', '${eq.head}', '${eq.armor}', '${eq.shoes}', '${eq.cape}', '${eq.potion}' ,'${eq.food}');`);
        return parseInt(row.insertId);
    }

    async process_player(kill, whois) {
        let killer = new Object();
        killer.playerid = kill['Id'];
        killer.whois = whois;
        killer.avgip = parseInt(kill['AverageItemPower']);
        killer.eqid = await this.process_equip(kill['Equipment']);
        killer.playername = kill['Name'];
        killer.guildname = kill['GuildName'];
        killer.alliancename = kill['AllianceName'];

        if (whois === 0) { // 막타 유저
            killer.killfame = kill['KillFame'];
        } else
        if (whois === 1) { // victim. 죽은자
            killer.deathfame = kill['DeathFame'];
        } else if (whois === 2) { // Participants. 
            killer.damage = kill['DamageDone'];
            killer.heal = kill['SupportHealingDone'];
        }

        return killer;
    }

    async processall_db(battles, killevents, players) {


        for (var i = 0; i < battles.length; i++) {
            const battle = battles[i];
            await this.dbcon.promise().query(`INSERT IGNORE INTO battlelog (battleid, totalkills, totalplayers, starttime, endtime) VALUES
            ('${battle.battleid}', '${battle.totalkills}', '${battle.totalplayers}', '${battle.starttime}', '${battle.endtime}');`);
        }

        for (var i = 0; i < killevents.length; i++) {
            const killevent = killevents[i];
            await this.dbcon.promise().query(`INSERT IGNORE INTO killevent (eventid, battleid, starttime, partymembercount, killercount, killarea) 
            VALUES 
            ('${killevent.eventid}', '${killevent.battleid}', '${killevent.timestamp}', '${killevent.partymembercount}', '${killevent.killercount}', '${killevent.killarea}');`);
        }

        for (var i = 0; i < players.length; i++) {
            const player = players[i];

            var sql = ``;
            if (parseInt(player.whois) === 0) { // 막타 killfame
                sql = `
                INSERT IGNORE INTO player (playerid, whois, avgip, eqid, playername, guildname, alliancename, killfame)
                VALUES 
                ('${player.playerid}', '${player.whois}', '${player.avgip}', '${player.eqid}', '${player.playername}', '${player.guildname}', '${player.alliancename}', '${player.killfame}');`;
            } else if (parseInt(player.whois) === 1) { // victim deathfame
                sql = `
                INSERT IGNORE INTO player (playerid, whois, avgip, eqid, playername, guildname, alliancename, deathfame)
                VALUES 
                ('${player.playerid}', '${player.whois}', '${player.avgip}', '${player.eqid}', '${player.playername}', '${player.guildname}', '${player.alliancename}', '${player.deathfame}');`;
            } else if (parseInt(player.whois) === 2) { // part, damage heal
                sql = `
                INSERT IGNORE INTO player (playerid, whois, avgip, eqid, playername, guildname, alliancename, damage, heal)
                VALUES 
                ('${player.playerid}', '${player.whois}', '${player.avgip}', '${player.eqid}', '${player.playername}', '${player.guildname}', '${player.alliancename}', '${player.damage}', '${player.heal}');`;
            }
            if (sql === ``) {
                console.log(`${player} whois error`);
            } else {
                await this.dbcon.promise().query(sql);
            }
        }
        let time = new Date();
        console.log(`[${time.toLocaleString()}] db 업로드 완료`);



    }

    async update() {
        try {
            let body_bb = await this.getJsonbyUrl(this.urlBattlelog); // body[0] ~ body[this.battleMax-1]

            // 이벤트 로그
            const killevents = new Array();
            const players = new Array();
            const battles = new Array();

            for (var i = 0; i < this.battleMax; i++) {
                const battleboard = body_bb[i];

                // 이미 존재하는지 확인
                let [ret] = await this.dbcon.promise().query(`
                SELECT * 
                FROM battlelog 
                WHERE battleid = ${parseInt(battleboard['id'])};`);
                //console.log(ret[0]['battleid'])
                if (ret[0] != undefined) {
                    if (ret[0]['battleid'] === battleboard['id']) {
                        //console.log(`${battleboard['id']} 중복 배제`);
                        continue;
                    }
                }
                if (parseInt(battleboard['totalKills'] > 20)) {
                    console.log(`${battleboard['totalKills']} 킬수가 너무 많습니다.`);
                    continue;
                }



                let battlelogs = new Object();
                // TABLE battlelog
                battlelogs.battleid = parseInt(battleboard['id']);
                battlelogs.totalkills = parseInt(battleboard['totalKills']);
                battlelogs.totalplayers = Object.keys(battleboard['players']).length;
                battlelogs.starttime = new Date(battleboard['startTime']).toISOString().slice(0, 19).replace('T', ' ');;
                battlelogs.endtime = new Date(battleboard['endTime']).toISOString().slice(0, 19).replace('T', ' ');;
                //console.log(battlelogs.starttime);
                //console.log(battlelogs.endtime);

                battles.push(battlelogs);


                const urlEventlog = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${battlelogs.battleid}?offset=0&limit=${battlelogs.totalkills}`;
                let body_ev = await this.getJsonbyUrl(urlEventlog);

                const totaleventcount = battlelogs.totalkills;
                for (var j = 0; j < totaleventcount; j++) {
                    const eventboard = body_ev[j];

                    /*
                    if (parseInt(eventboard['Victim']['AverageItemPower']) === 0) { // 평균 템렙이 0인 경우 = 버그 킬
                        battles[i].totalkills = battles[i].totalKills - 1;
                        continue;
                    }
                    */

                    // killevent
                    var killevent = new Object();
                    killevent.eventid = parseInt(eventboard['EventId']);
                    killevent.battleid = parseInt(eventboard['BattleId']);
                    killevent.timestamp = new Date(eventboard['TimeStamp']).toISOString().slice(0, 19).replace('T', ' ');;
                    killevent.partymembercount = parseInt(eventboard['groupMemberCount']);
                    killevent.killercount = Object.keys(eventboard['Participants']).length;
                    killevent.killarea = eventboard['KillArea'];
                    //console.log(killevent.timestamp);
                    killevents.push(killevent);

                    // 킬을 먹은 유저 정보 (막타)
                    const lastkiller = eventboard['Killer'];
                    players.push(await this.process_player(lastkiller, 0));

                    // Participants로 부터 killer들의 정보를 추출
                    const totalkillercount = killevent.killercount;
                    for (var k = 0; k < totalkillercount; k++) {
                        const partiboard = eventboard['Participants'][k];
                        players.push(await this.process_player(partiboard, 2));
                    }

                    // victim 정보 추출
                    const victim = eventboard['Victim'];
                    players.push(await this.process_player(victim, 1));
                }
            }

            // db 입력
            await this.processall_db(battles, killevents, players)

        } catch (err) {
            console.log(err);
        }
        return true;
    }
    sleep = (ms) => {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    async updateINF() {
        while (true) {
            try {
                await this.update();
                await this.sleep(10000);

            } catch (e) {
                console.log(e);
                break;
            }
        }
    }
}

exports.hellgatemodule = battlelog;