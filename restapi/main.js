const { Console } = require('console');
const { syncBuiltinESMExports } = require('module');
const { mainModule } = require('process');
const crawling = require('./crawling');
const process = require('./process');
const db = require('./db');


const url = 'https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=1&sort=recent';
// https://gameinfo.albiononline.com/api/gameinfo/events/battle/474090600?offset=0&limit=51
// 상세 정보 

function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function main() {
    db.con.connect();
    while (true) {
        console.log("start");
        for (var i = 0; i < 20; i++) {
            var url = `https://gameinfo.albiononline.com/api/gameinfo/battles?offset=${i}&limit=1&sort=recent`;
            crawling.start(process.battlelog_process, url);
        }
        await sleep(30000);
        console.log("End");
    }
    db.con.end();
}

main();