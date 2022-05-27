// https: //smilehugo.tistory.com/entry/nodejs-using-https-module-instead-of-request-npm

const https = require('https');
// const url = `https://api.albionbattles.com/battles?largeOnly=false&offset=0&search=`;
const url = 'https://gameinfo.albiononline.com/api/gameinfo/battles?offset=0&limit=1&sort=recent';

// https://gameinfo.albiononline.com/api/gameinfo/events/battle/474090600?offset=0&limit=51
// 상세 정보 


const request = https.request(url, function(response) {
    let data = ``;

    response.on('data', function(chunk) {
        data = data + chunk.toString();
    });

    response.on('end', function() {
        const body = JSON.parse(data);
        console.log(JSON.stringify(body));
        console.log(body);
        console.log(body[0]['players']);
        console.log(body[0]['guilds']);
        console.log(body[0]['alliances']);
    });
});

request.on('error', function(error) {
    console.log('An Error', error);
});

request.end();