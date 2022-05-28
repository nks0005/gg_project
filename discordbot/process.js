const db = require('../restapi/db');

function hellgate(msg) {
    db.con.connect();

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
        for (var i = 0; i < result.length; i++) {
            sql = `SELECT *
            FROM battlelog_killevent
            WHERE killboard_id = '${result[i]['killboard_id']}'`;
            var killboard_id = result[i]['killboard_id'];
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
                        if (count == result.length) msg.channel.send(`https://albionbattles.com/battles/${killboard_id}`);
                    });
                }
            });
        }
    });
}

exports.hellgate = hellgate;