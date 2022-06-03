// node js 기본 코드
var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(
        200,
        {'Content-Type' : 'text/plain'});
    response.write("Hello Js");
    response.end();
}).listen()


/*
createServer에는 리스너 함수를 등록해야 요청 처리가 가능하다.
리스너는 함수 형태로 존재하며, 익명 또는 기명으로 할 수 있다.
*/

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.write('Hello World');
    response.end();
}

http.createServer(onRequest).listen(80);


