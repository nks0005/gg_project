const db = require('../restapi/db');

function hellgate(msg) {

    var sql = `
    SELECT * 
    FROM battlelog
    WHERE totalplayers = 10
    `;
    db.con.query(sql, function(err, result, fields) {
        if (err) throw err;

        /*
                var body = ``;

                    console.log(result[i]['killboard_id']);
                    body = body + `https://albionbattles.com/battles/${result[i]['killboard_id']}
        `;

                msg.channel.send(body);
        */
        var count = 0;
        var notcount = 0;
        for (var i = 0; i < result.length; i++) {
            sql = `SELECT *
            FROM battlelog_killevent
            WHERE killboard_id = '${result[i]['killboard_id']}'`;
            var killboard_id = result[i]['killboard_id'];

            console.log(result[i]['start_time']);
            var killdate = new Date(result[i]['start_time']);
            var curdate = new Date();
            curdate.setHours(curdate.getHours() - 9);
            var killdate_after60m = new Date(killdate);
            killdate_after60m.setHours(killdate_after60m.getHours() + 1);


            if (killdate_after60m >= curdate && curdate >= killdate) {
                console.log("1시간 내외 발견");
                db.con.query(sql, function(err, result, fields) {
                    if (err) throw err;

                    for (var j = 0; j < result.length; j++) {
                        var killevent_id = result[j]['killevent_id'];

                        sql = `SELECT *
                        FROM killevent
                        WHERE killevent_id = ${killevent_id}`;
                        db.con.query(sql, function(err, result, fields) {
                            if (err) throw err;

                            var groupMemberCount = result[0]['groupMemberCount'];

                            if (groupMemberCount == 5) count++;
                            else notcount++;

                            if (count == result.length) {
                                msg.channel.send(`https://albionbattles.com/battles/${killboard_id}`);
                            } else if ((notcount + count) == result.length) msg.channel.send(`못찾았습니다.`);
                        });
                    }
                });
            } else {
                msg.channel.send(`1시간 이내에 헬게이트 파티가 없습니다.`);
            }
        }
    });
}

exports.hellgate = hellgate;