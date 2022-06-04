const mysql = require('mysql2');

async function hellgate(msg) {
    let db;
    try {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'crawl'
        });

        // 전체 유저 수가 10명인 경우 + 킬수가 5킬 이상 + (한국 시간-10h) ~ (한국 시간-9h) 인지 여부
        let sql = `SELECT *
                   FROM battlelog
                   WHERE totalplayers = 10 AND totalKills >= 5 AND start_time BETWEEN DATE_SUB(NOW(), INTERVAL 10 HOUR) AND DATE_SUB(NOW(), INTERVAL 9 HOUR)`;
        let [battlelog] = await db.promise().query(sql);

        let sendmsg = ``;
        for (var i = 0; i < battlelog.length; i++) {
            // kill event들을 모두 조사
            // 힐러 최소 1명[x]
            // 파티 구성이 5명[o]
            let killboard_id = battlelog[i]['killboard_id'];

            sql = `SELECT *
                   FROM battlelog_killevent
                   WHERE killboard_id = '${killboard_id}';`;
            let [battlelog_killevent] = await db.promise().query(sql);

            let check_count = 0;
            for (var j = 0; j < battlelog_killevent.length; j++) {
                let killevent_id = battlelog_killevent[j]['killevent_id'];

                sql = `SELECT *
                       FROM killevent
                       WHERE killevent_id = ${killevent_id};`;
                let [killevent] = await db.promise().query(sql);
                if (killevent[0]['groupMemberCount'] == 5) check_count++; // 파티 인원이 5명인가?
            }
            if (check_count == battlelog_killevent.length) { // 조건 부합
                sendmsg += `> https://albionbattles.com/battles/${killboard_id}
            `;
            }
        }
        if (sendmsg == ``) {
            msg.channel.send(`> 1시간 이내 레헬 전적이 없습니다.`);
        } else {
            msg.channel.send(sendmsg);
        }
    } catch (e) {
        msg.channel.send('> fatal error');
        console.log(e);
    } finally {
        db.end();
    }
}

exports.hellgate = hellgate;