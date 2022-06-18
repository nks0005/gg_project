const database = require('./database');
const { DB } = require('../config/config.json');

class hellgate {
    constructor() {
        this.con = new database.database(DB).getCon();
    }

    async check55hellgate() {
        try {
            const [battlelogs] = await this.con.query(`SELECT * FROM battlelog WHERE totalplayercount = 10 AND totalkills >= 5 AND totalkills <= 9 AND endtime BETWEEN DATE_SUB(NOW(), INTERVAL 10 HOUR) AND DATE_SUB(NOW(), INTERVAL 9 HOUR)`);
            //console.log(battlelogs.length);
            for (const battlelog of battlelogs) {
                const [hellgate] = await this.con.query(`SELECT * FROM hellgate55 WHERE battleid = '${battlelog['battleid']}'`);
                //console.log(`hellgate count : ${hellgate.length}`);
                if (hellgate.length == 0) {
                    //console.log(`${battlelog['battleid']} 5v5 헬게이트를 발견했습니다. 1차`);


                    var healCount = 0; // 힐러 카운트
                    var checkPartyCount = 0; // 파티 적합 카운트
                    var ipCount = 0; // 아이템 레벨 적합 카운트
                    const [eventlogs] = await this.con.query(`SELECT * FROM eventlog WHERE battleid = '${battlelog['battleid']}'`);
                    for (const eventlog of eventlogs) {
                        if (parseInt(eventlog['partymembercount']) === 5) {
                            checkPartyCount++;
                        }

                        const [playerlogs] = await this.con.query(`SELECT * FROM playerlog WHERE eventid = '${eventlog['eventid']}'`);
                        for (const playerlog of playerlogs) {
                            if (playerlog['heal'] != undefined) {
                                healCount++;
                            }
                            if (parseInt(playerlog['avgip']) >= 1450 && parseInt(playerlog['avgip']) <= 1100 && parseInt(playerlog['avgip'] != 0)) // ip 가 이상하다.
                            {
                                ipCount++;
                            }
                        }
                    }

                    console.log(`${checkPartyCount} : ${battlelog['totalkills']} : ${healCount} : ${ipCount}`);
                    // 마지막 비교
                    if (checkPartyCount >= parseInt(battlelog['totalkills']) &&
                        healCount >= 4 &&
                        ipCount < 0) {
                        console.log(`${battlelog} 5v5 헬게이트를 발견했습니다. 최종`);
                        await this.con.query(`INSERT IGNORE INTO hellgate55 (checkvalue, battleid) VALUES (0, ${battlelog['battleid']})`);
                    }
                }
            }
        } catch (err) {
            console.trace();
            console.error(`${err} 5v5 분석 도중 에러가 발생하였습니다.`);
        } finally {}
    }
}
module.exports.hellgate = hellgate;