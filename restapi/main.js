const crawling = require('./crawling');
const process = require('./process');


const url = 'https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=1&sort=recent';
// https://gameinfo.albiononline.com/api/gameinfo/events/battle/474090600?offset=0&limit=51
// 상세 정보 

crawling.start(process.battlelog_process, url);