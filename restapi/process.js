const db = require('./db');
const crawling = require('./crawling');
const async = require('async');
const { Console, debug } = require('console');




function check_equip(arg) {
    if (arg == null) {
        arg = {};
        arg['Type'] = '0';
    }
    return arg;
}


function callback(proc, arg) {
    proc(arg);
}

function callback(proc, arg1, arg2) {
    proc(arg1, arg2);
}

function process_killer(killers, killevent_id) {

    var killers_Equipments = [];
    killers_Equipments[0] = check_equip(killers['Equipment']['MainHand'])['Type'];
    killers_Equipments[1] = check_equip(killers['Equipment']['OffHand'])['Type'];
    killers_Equipments[2] = check_equip(killers['Equipment']['Head'])['Type'];
    killers_Equipments[3] = check_equip(killers['Equipment']['Armor'])['Type'];
    killers_Equipments[4] = check_equip(killers['Equipment']['Shoes'])['Type'];
    killers_Equipments[5] = check_equip(killers['Equipment']['Bag'])['Type'];
    killers_Equipments[6] = check_equip(killers['Equipment']['Cape'])['Type'];
    killers_Equipments[7] = check_equip(killers['Equipment']['Mount'])['Type'];
    killers_Equipments[8] = check_equip(killers['Equipment']['Potion'])['Type'];
    killers_Equipments[9] = check_equip(killers['Equipment']['Food'])['Type'];

    var sql = `INSERT INTO equiment (mainHand, offHand, head, armor, shoes, bag, cape, mount, potion, food) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,? ,?)`;
    var param = killers_Equipments;

    db.con.query(sql, param, function(err, result) {
        if (err) throw err;

        // 가해자 장비에 넣기
        var killer_avg = parseInt(killers['AverageItemPower']);
        var killer_name = killers['Name'];
        var killer_equi_id = result.insertId;
        var killer_user_id = killers['Id'];
        var killer_guildName = killers['GuildName'];
        var killer_AllianceName = killers['AllianceName'];
        var killer_AllianceTag = killers['AllianceTag'];

        sql = `INSERT IGNORE INTO killer
            (avgIp, equiment_id, name, user_id, guildName, AlianceName, AlianceTag)
            VALUES
            (?, ?, ?, ?, ?, ?, ?);
            `;
        param = [killer_avg, killer_equi_id, killer_name, killer_user_id, killer_guildName, killer_AllianceName, killer_AllianceTag];
        db.con.query(sql, param, function(err, result) {
            if (err) throw err;
            // killer와 killevent에 연관 시켜야함. 

            sql = `INSERT IGNORE INTO killevent_killer 
            (killevent_id, killer_id)
            VALUES
            (?, ?);`;
            param = [killevent_id, result.insertId];
            db.con.query(sql, param, function(err, result) {
                if (err) throw err;


                console.log("최종 확인");
            });
        });
    });
}

// 콜백으로 구성한 이유 : arg인 body[i]['Victim'] 값이 비동기로 호출됨에 따라 i값이 정해지지 않음. i 값을 임시적으로 보관해야 하기 때문에 
function process_victim(arg) {
    // 피해자 장비 확인 
    var victim = arg['Victim'];
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


    sql = `INSERT INTO equiment (mainHand, offHand, head, armor, shoes, bag, cape, mount, potion, food) VALUES (?, ?, ?, ?, ?, ?, ? ,? ,? ,?)`;
    var param = victim_Equipments;
    db.con.query(sql, param, function(err, result) {
        if (err) throw err;

        // 피해자 장비에 넣기
        var victim_avg = parseInt(victim['AverageItemPower']);
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
        //console.log(debug);


        sql = `INSERT IGNORE INTO victim
            (avgIp, equiment_id, name, user_id, guildName, AlianceName, AlianceTag)
            VALUES
            (?, ?, ?, ?, ?, ?, ?);
            `;
        param = [victim_avg, victim_equi_id, victim_name, victim_user_id, victim_guildName, victim_AllianceName, victim_AllianceTag];
        db.con.query(sql, param, function(err, result) {
            if (err) throw err;

            // killevent에 값을 넣어야함 
            let killevent_id = arg['EventId'];
            let groupMemberCount = arg['groupMemberCount'];
            let numberOfParticipants = arg['numberOfParticipants'];
            let creat_time = new Date(arg['TimeStamp']).toISOString();
            let TotalVictimKillFame = arg['TotalVictimKillFame'];
            let Victim_id = result.insertId;

            // battlog와 killevent의 연결 테이블 연결
            let battlelog = arg['BattleId'];
            sql = `INSERT IGNORE INTO battlelog_killevent
            (killboard_id, killevent_id)
            VALUES
            (?, ?);`;
            param = [battlelog, killevent_id];
            db.con.query(sql, param, function(err, result) {
                if (err) throw err;
            });

            sql = `INSERT IGNORE INTO killevent 
            (killevent_id, groupMemberCount, numberOfParticipants, creat_time, Victim_id, TotalVictimKillFame)
            VALUES
            (?, ?, ?, ?, ?, ?);`;
            param = [killevent_id, groupMemberCount, numberOfParticipants, creat_time, Victim_id, TotalVictimKillFame];
            db.con.query(sql, param, function(err, result) {
                if (err) throw err;
                console.log("killevent updated");

                // killer들을 업데이트 해야함
                // killer들은 participants 배열에 있음
                let killers = arg['Participants'];
                // numberOfParticipants : 킬에 도움 준 자 몇명?
                for (var i = 0; i < parseInt(numberOfParticipants); i++) {
                    callback(process_killer, killers[i], killevent_id);
                }
            })
        });
    });
}



function eventlog_process(body) {

    let killboard_id = parseInt(body[0]['BattleId']); // 킬 이벤트가 있다는건 킬이 하나 이상이 존재한다.
    let totalkills;

    // killboard_id를 이용하여 SELECT로 전체 킬 횟수를 알아낸다. ( 이벤트 갯수를 파악하기 위해서 ) 
    var sql = `
    SELECT totalKills 
    FROM battlelog 
    WHERE killboard_id='${killboard_id}';`;

    db.con.query(sql, function(err, result) {
        if (err) throw err;
        totalkills = parseInt(result[0]['totalKills']);

        // 킬 이벤트 갯수 만큼 반복
        for (let i = 0; i < totalkills; i++) {
            callback(process_victim, body[i]);
        }
    });
}











function battlelog_process(body) {
    try {
        // db 접속

        // battlelog [TABLE]
        var killboard_id = parseInt(body[0]['id']);
        var startTime = new Date(body[0]['startTime']);
        var endTime = new Date(body[0]['endTime']);
        var totalFame = parseInt(body[0]['totalFame']);
        var totalKills = parseInt(body[0]['totalKills']);
        var totalplayers = Object.keys(body[0]['players']).length;


        var sql = `INSERT IGNORE INTO battlelog (killboard_id, start_time, end_time, totalFrame, totalKills, totalplayers) VALUES ('${killboard_id}', '${startTime.toISOString()}', '${endTime.toISOString()}', '${totalFame}', '${totalKills}', '${totalplayers}' );`;
        db.con.query(sql, function(err, result) {
            if (err) throw err;
            //console.log("Number of records inserted: " + result.affectedRows);
            //console.log("result? " + result.insertId);


            // event 크롤링을 진행해야 함 - 수정해야할것 : insert 결과가 있는 경우
            if (result.affectedRows == 1) {
                console.log("crawling start");
                var eventurl = `https://gameinfo.albiononline.com/api/gameinfo/events/battle/${killboard_id}?offset=0&limit=51`
                crawling.start(eventlog_process, eventurl);
            }
        });
    } catch (e) {
        console.log(e);
    }
}


exports.battlelog_process = battlelog_process;