// https: //smilehugo.tistory.com/entry/nodejs-using-https-module-instead-of-request-npm

const https = require('https');
const process = require('./process');





function start(callback, url) {
    const request = https.request(url, function(response) {
        let data = ``;

        response.on('data', function(chunk) {
            data = data + chunk.toString();
        });

        response.on('end', function() {
            const body = JSON.parse(data);
            callback(body);
        });
    });

    request.on('error', function(error) {
        console.log('An Error', error);
    });
    request.end();
}

exports.start = start;