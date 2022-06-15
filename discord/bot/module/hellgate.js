const database = require('./database');
const { DB } = require('../config/config.json');

class hellgate {
    constructor() {
        this.con = new database.database(DB).getCon();
    }

    async check55hellgate() {
        try {
            // 조건에 맞으면 hellgate55 테이블 넣음


            // 전체 유저 수가 10명인 경우 + 킬수가 5킬 이상 + (한국 시간-10h) ~ (한국 시간-9h) 인지 여부
            let sql = `SELECT *
         FROM battlelog
         WHERE totalplayercount = 10
         AND totalkills >= 5  AND totalkills <= 9
         AND endtime BETWEEN DATE_SUB(NOW(), INTERVAL 10 HOUR) AND DATE_SUB(NOW(), INTERVAL 9 HOUR)
         ;`;
            const [battlelogs] = await this.con.query(sql);
            for (const battlelog of battlelogs) {
                const [check55hellgate] = await this.con.query(`SELECT * FROM hellgate55 WHERE battleid = '${battlelog['battleid']}';`);
                if (check55hellgate.length > 0) continue;

                // event에서 partymember가 5명인 이벤트가 킬수 만큼 같아야 함
                const killcount = battlelog['totalkills'];
                let checkcount = 0;
                // 힐러가 최소 1명은 있어야 함 = 킬수 이상 만큼 존재
                let checkhealer = 0;

                sql = `SELECT * FROM battlelog_eventlog WHERE battleid = '${battlelog['battleid']}';`;
                const [eventids] = await this.con.query(sql);
                for (const eventid of eventids) {
                    sql = `SELECT * FROM eventlog WHERE eventid = '${eventid['eventid']}';`;
                    const [eventlog] = await this.con.query(sql);
                    if (eventlog[0]['killarea'] === 'OPEN_WORLD' && parseInt(eventlog[0]['partymembercount']) === 5) {
                        checkcount++;
                    }

                    // 힐러 확인
                    sql = `SELECT * FROM playerlog WHERE eventid = '${eventid['eventid']}' AND killtype = 2;`;
                    const [playerlogs] = this.con.query(sql);
                    for (const playerlog of playerlogs) {
                        if (playerlog['heal'] != null) {
                            checkhealer++;
                        }
                    }


                }
                if (checkhealer >= killcount && checkcount == killcount) {
                    await this.con.query(`INSERT IGNORE hellgate55 (checkvalue, battleid) VALUES (0, ${battelog['battleid']})`);
                }
            }
        } catch (err) {
            console.trace();
            console.error(`${err} 5v5 분석 도중 에러가 발생하였습니다.`);
        }
    }
}

module.exports.hellgate = hellgate;