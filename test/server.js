/* 
단위 js 모듈화

export : start()
*/

var http = require('http');
var url = require('url');

function start(route, handle){
    function onRequest(request, response){
        var pathname = url.parse(request.url).pathname;
        console.log('request received.');

        route(handle, pathname, response); // injected function call

    }

    http.createServer(onRequest).listen(80);

    console.log('server has started');
}

exports.start = start;