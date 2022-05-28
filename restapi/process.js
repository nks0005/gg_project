const db = require('./db');
const crawling = require('./crawling');
const { Console } = require('console');

db.con.connect();


function check_equip(arg) {
    if (arg == null) {
        arg = {};
        arg['Type'] = '0';
    }
    return arg;
}

function eventlog_process(body) {
    //console.log(body);

    /*
    body의 BattleId 값을 알아 낸 후, DB에서 몇킬이 이루어졌는지 확인
    */
    var killboard_id = parseInt(body[0]['BattleId']);
    // console.log(`킬보드 : ${killboard_id}`);

    var sql = `SELECT totalKills FROM battlelog WHERE killboard_id='${killboard_id}';`;
    db.con.query(sql, function(err, result) {
        if (err) throw err;

        totalkills = parseInt(result[0]['totalKills']);
        console.log(totalkills);
        console.log(killboard_id);

        for (var i = 0; i < totalkills; i++) {
            // killevent 테이블
            var killevent_id = body[i]['EventId'];
            var groupMemberCount = body[i]['groupMemberCount'];
            var numberOfParticipants = body[i]['numberOfParticipants'];
            var creat_time = new Date(body[i]['TimeStamp']);
            var TotalVictimKillFame = body[i]['TotalVictimKillFame'];

            var sql = `INSERT IGNORE INTO killevent (killevent_id, groupMemberCount, numberOfParticipants, creat_time, TotalVictimKillFame) VALUES ('${killevent_id}', '${groupMemberCount}', '${numberOfParticipants}', '${create_time}', '${TotalVictimKillFame}');`;
            db.con.query(sql, function(err, result) {
                if (err) throw err;

                var victim = body[i]['Victim'];
                var victim_Equipments = [];
                victim_Equipments[0] = check_equip(victim['Equipment']['MainHand'])['Type'];
                victim_Equipments[1] = check_equip(victim['Equipment']['OffHand'])['Type'];
                victim_Equipments[2] = check_equip(victim['Equipment']['Head'])['Type'];
                victim_Equipments[3] = check_equip(victim['Equipment']['Armor'])['Type'];
                victim_Equipments[4] = check_equip(victim['Equipment']['Shoes'])['Type'];
                victim_Equipments[5] = check_equip(victim['Equipment']['Bag'])['Type'];
                victim_Equipments[6] = check_equip(victim['Equipment']['Cape'])['Type'];
                victim_Equipments[7] = check_equip(victim['Equipment']['Mount'])['Type'];
                victim_Equipments[8] = check_equip(victim['Equipment']['Potion'])['Type'];
                victim_Equipments[9] = check_equip(victim['Equipment']['Food'])['Type'];

                var sql = `INSERT IGNORE INTO equiment (mainHand, offHand, head, armor, shoes, bag, cape, mount, potion, food) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,? ,?)`;
                var param = victim_Equipments;

                db.con.query(sql, param, function(err, result) {
                    if (err) throw err;

                    //console.log(result.insertId);
                    // equiment_id = result.insertId;
                    // victim 테이블을 만들어야 한다
                    var victim_avg = victim['AverageItemPower'];
                    var victim_name = victim['Name'];
                    var victim_equi_id = result.insertId;
                    var victim_user_id = victim['Id'];
                    var victim_guildName = victim['GuildName'];
                    var victim_AllianceName = victim['AllianceName'];
                    var victim_AllianceTag = victim['AllianceTag'];

                    var debug = `
                        victim_avg : ${victim_avg}
                        victim_name : ${victim_name}
                        victim_equi_id : ${victim_equi_id}
                        victim_user_id : ${victim_user_id}
                        victim_guildName : ${victim_guildName}
                        victim_AllianceName : ${victim_AllianceName}
                        victim_AllianceTag : ${victim_AllianceTag}
                    `;
                    console.log(debug);
                });

            });
        }
    });
}

function battlelog_process(body) {
    // db 접속

    // battlelog [TABLE]
    var killboard_id = parseInt(body[0]['id']);
    var startTime = new Date(body[0]['startTime']);
    var endTime = new Date(body[0]['endTime']);
    var totalFame = parseInt(body[0]['totalFame']);
    var totalKills = parseInt(body[0]['totalKills']);

    var sql = `INSERT IGNORE INTO battlelog (killboard_id, start_time, end_time, totalFrame, totalKills) VALUES ('${killboard_id}', '${startTime.toISOString()}', '${endTime.toISOString()}', '${totalFame}', '${totalKills}' );`;
    db.con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        console.log("result? " + result.insertId);

        // event 크롤링을 진행해야 함 - 수정해야할것 : insert 결과가 있는 경우 
        var eventurl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${killboard_id}?offset=0&limit=51`
        crawling.start(eventlog_process, eventurl);
    });
}


exports.battlelog_process = battlelog_process;