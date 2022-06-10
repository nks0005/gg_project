// DB에서 값을 가져와서 비교만 하면됨

const mysql2 = require('mysql2');

class hellgate {
    constructor() {
        this.con = mysql2.createConnection({
            host: "127.0.0.1",
            user: "root",
            password: "root",
            database: 'my_bot'
        });
    }

    async check5v5hellgate1hour() {
        let msg = ``;

        /*
            비교 목록
            =battlelog=
            1. 플레이어 수 10
            2. 킬 수 [5~9]
            3. 시간 (utc는 한국시간 - 9)

            =eventlogs=
            1. 모든 킬 파티원 수 5명
            2. 
        */

        // 전체 유저 수가 10명인 경우 + 킬수가 5킬 이상 + (한국 시간-10h) ~ (한국 시간-9h) 인지 여부
        let sql = `SELECT *
        FROM battlelog
        WHERE totalplayers = 10 
        AND totalkills >= 5  AND totalkills <= 9
        AND endtime BETWEEN DATE_SUB(NOW(), INTERVAL 10 HOUR) AND DATE_SUB(NOW(), INTERVAL 9 HOUR)
        ;`;
        const [battlelogs] = await this.con.promise().query(sql);
        for (var i = 0; i < battlelogs.length; i++) {
            const battlelog = battlelogs[i];

            const battleid = battlelog['battleid'];
            const battletime = battlelog['endtime'];
            const battlekillcount = battlelog['totalkills'];

            // event에서 모든 유저의 킬에 파티원이 5명인지 확인
            sql = `
            SELECT *
            FROM killevent
            WHERE battleid = ${battleid} 
            AND partymembercount = 5
            AND killarea = 'OPEN_WORLD'
            ;`;
            const [eventlogs] = await this.con.promise().query(sql);
            let healer_check = 0;
            let dealer_check = 0;

            for (var j = 0; j < eventlogs.length; j++) {
                const eventlog = eventlogs[j];
                //console.log(eventlog['eventid']);
                sql = `
                SELECT *
                FROM player
                WHERE eventid = ${eventlog['eventid']};`;
                let [playerlogs] = await this.con.promise().query(sql);
                for (var k = 0; k < playerlogs.length; k++) {
                    const playerlog = playerlogs[k];
                    const heal = parseInt(playerlog['heal']);
                    if (heal != NaN && heal > 0) healer_check++;
                    else dealer_check++;
                }
            }

            console.log(`${battleid} | ${eventlogs.length} : ${battlekillcount} : | ${healer_check} : ${battlekillcount}`);
            if (eventlogs.length === battlekillcount && healer_check >= battlekillcount)
                msg += `UTC시간 : ${battletime.toLocaleString()}\nhttps://albionbattles.com/battles/${battleid}\n`;
        }

        return msg;
    }
}

exports.hellgatemodule = hellgate;